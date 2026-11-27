import { createSupabaseServerClient } from "@/lib/supabase-server";

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function toAmountCents(value: unknown): number | null {
  if (value === null) return 0;
  if (
    typeof value !== "number" &&
    typeof value !== "string"
  ) {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount)
    ? Math.round(amount * 100)
    : null;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  if (!isRecord(payload)) {
    return errorResponse("Invalid request body.", 400);
  }

  const { studentId, projectId, action, password, verifyOnly } =
    payload;

  if (
    typeof studentId !== "string" ||
    !studentId ||
    typeof projectId !== "string" ||
    !projectId ||
    (action !== "deposit" && action !== "withdraw") ||
    typeof password !== "string" ||
    !password ||
    (verifyOnly !== undefined &&
      typeof verifyOnly !== "boolean")
  ) {
    return errorResponse("Transaction details are invalid.", 400);
  }

  const isVerificationRequest = verifyOnly === true;
  const amount = payload.amount;
  const description = payload.description;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return errorResponse("Sign in to authorize this transaction.", 401);
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (projectError) {
    console.error("Could not verify transaction project access.", projectError);
    return errorResponse("Could not verify project access.", 500);
  }

  if (!project) {
    return errorResponse("The project could not be found.", 404);
  }

  const { data: student, error: studentError } = await supabase
    .from("student_details")
    .select("id, password")
    .eq("id", studentId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (studentError) {
    console.error("Could not load student transaction credentials.", studentError);
    return errorResponse("Could not verify the student.", 500);
  }

  if (!student) {
    return errorResponse("The student could not be found.", 404);
  }

  if (student.password !== password) {
    return errorResponse("This password is incorrect.", 401);
  }

  if (isVerificationRequest) {
    return Response.json({ verified: true });
  }

  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount < 0.01 ||
    typeof description !== "string"
  ) {
    return errorResponse("Enter a valid transaction amount.", 400);
  }

  const amountInCents = Math.round(amount * 100);

  if (amountInCents < 1) {
    return errorResponse(
      "Enter a transaction amount of at least GHS 0.01.",
      400
    );
  }

  const { data: amountRows, error: amountsError } = await supabase
    .from("amounts")
    .select("id, student_id, amount")
    .eq("student_id", studentId)
    .order("id", { ascending: true });

  if (amountsError) {
    console.error("Could not load student amounts.", amountsError);
    return errorResponse("Could not load the student's balance.", 500);
  }

  const currentAmounts = amountRows ?? [];
  const currentAmountCents = currentAmounts.map((row) => ({
    row,
    cents: toAmountCents(row.amount),
  }));

  if (currentAmountCents.some(({ cents }) => cents === null)) {
    console.error("A student amount row contains an invalid amount.");
    return errorResponse("Could not verify the student's balance.", 500);
  }

  const balanceInCents = currentAmountCents.reduce(
    (total, { cents }) => total + (cents ?? 0),
    0
  );

  if (action === "withdraw" && amountInCents > balanceInCents) {
    return errorResponse(
      "The student does not have enough balance.",
      409
    );
  }

  const changedAmounts: Array<{
    id: string;
    previousAmount: unknown;
    inserted: boolean;
  }> = [];
  const updatedAmounts = [...currentAmounts];

  const rollbackAmounts = async () => {
    let rollbackFailed = false;

    for (const change of [...changedAmounts].reverse()) {
      const { error } = change.inserted
        ? await supabase
            .from("amounts")
            .delete()
            .eq("id", change.id)
        : await supabase
            .from("amounts")
            .update({ amount: change.previousAmount })
            .eq("id", change.id);

      if (error) {
        rollbackFailed = true;
        console.error("Could not roll back a student amount update.", error);
      }
    }

    return !rollbackFailed;
  };

  if (action === "deposit") {
    const { data: newAmount, error: insertAmountError } = await supabase
      .from("amounts")
      .insert({
        student_id: studentId,
        amount: Number((amountInCents / 100).toFixed(2)),
      })
      .select("id, student_id, amount")
      .single();

    if (insertAmountError || !newAmount) {
      console.error("Could not add to student amounts.", insertAmountError);
      return errorResponse("Could not update the student's balance.", 500);
    }

    changedAmounts.push({
      id: newAmount.id,
      previousAmount: null,
      inserted: true,
    });
    updatedAmounts.push(newAmount);
  } else {
    let remainingCents = amountInCents;

    for (const { row, cents } of currentAmountCents) {
      if (remainingCents === 0) break;

      const availableCents = Math.max(cents ?? 0, 0);
      const deductionCents = Math.min(
        availableCents,
        remainingCents
      );

      if (deductionCents === 0) continue;

      const nextAmount = Number(
        ((availableCents - deductionCents) / 100).toFixed(2)
      );
      let updateQuery = supabase
        .from("amounts")
        .update({ amount: nextAmount })
        .eq("id", row.id);

      updateQuery =
        row.amount === null
          ? updateQuery.is("amount", null)
          : updateQuery.eq("amount", row.amount);

      const { data: updatedAmount, error: updateAmountError } =
        await updateQuery
          .select("id, student_id, amount")
          .maybeSingle();

      if (updateAmountError || !updatedAmount) {
        await rollbackAmounts();
        if (updateAmountError) {
          console.error(
            "Could not deduct from student amounts.",
            updateAmountError
          );
        }
        return errorResponse(
          "The student's balance changed. Please try again.",
          409
        );
      }

      changedAmounts.push({
        id: row.id,
        previousAmount: row.amount,
        inserted: false,
      });

      const rowIndex = updatedAmounts.findIndex(
        (amountRow) => amountRow.id === row.id
      );
      updatedAmounts[rowIndex] = updatedAmount;
      remainingCents -= deductionCents;
    }

    if (remainingCents > 0) {
      await rollbackAmounts();
      return errorResponse(
        "The student does not have enough balance.",
        409
      );
    }
  }

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      student_id: studentId,
      state: action,
      amount: Number((amountInCents / 100).toFixed(2)),
      description: description.trim() || null,
      status: "completed",
    })
    .select("*")
    .single();

  if (transactionError || !transaction) {
    const rollbackSucceeded = await rollbackAmounts();
    console.error(
      rollbackSucceeded
        ? "Could not save student transaction."
        : "Could not save student transaction or restore the balance.",
      transactionError
    );
    return errorResponse("Could not save the transaction.", 500);
  }

  return Response.json(
    { transaction, amounts: updatedAmounts },
    { status: 201 }
  );
}
