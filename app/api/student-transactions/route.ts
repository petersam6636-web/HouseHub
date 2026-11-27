import { createSupabaseServerClient } from "@/lib/supabase-server";

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
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

  const { data: transactionResult, error: transactionError } =
    await supabase.rpc("apply_student_transaction", {
      p_project_id: projectId,
      p_student_id: studentId,
      p_action: action,
      p_amount: Number((amountInCents / 100).toFixed(2)),
      p_description: description.trim() || null,
    });

  if (transactionError) {
    if (
      transactionError.code === "P0001" &&
      transactionError.message === "INSUFFICIENT_BALANCE"
    ) {
      return errorResponse(
        "The student does not have enough balance.",
        409
      );
    }

    if (transactionError.code === "42501") {
      return errorResponse(
        "You do not have permission to change this student's balance.",
        403
      );
    }

    console.error(
      "Could not apply student balance transaction.",
      transactionError
    );
    return errorResponse("Could not save the transaction.", 500);
  }

  if (
    !isRecord(transactionResult) ||
    !isRecord(transactionResult.transaction) ||
    !Array.isArray(transactionResult.amounts)
  ) {
    console.error(
      "Student balance transaction returned an invalid response."
    );
    return errorResponse("Could not confirm the transaction.", 500);
  }

  return Response.json(transactionResult, { status: 201 });
}
