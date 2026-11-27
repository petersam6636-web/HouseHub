INSERT INTO public.amounts (student_id, amount)
SELECT
  transaction_totals.student_id,
  SUM(
    CASE
      WHEN transaction_totals.state = 'deposit'
        THEN COALESCE(transaction_totals.amount, 0)
      ELSE -COALESCE(transaction_totals.amount, 0)
    END
  )
FROM public.transactions AS transaction_totals
WHERE transaction_totals.status = 'completed'
  AND transaction_totals.state IN ('deposit', 'withdraw')
GROUP BY transaction_totals.student_id
HAVING SUM(
  CASE
    WHEN transaction_totals.state = 'deposit'
      THEN COALESCE(transaction_totals.amount, 0)
    ELSE -COALESCE(transaction_totals.amount, 0)
  END
) <> 0;

CREATE OR REPLACE FUNCTION public.apply_student_transaction(
  p_project_id uuid,
  p_student_id uuid,
  p_action text,
  p_amount numeric,
  p_description text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_student_id uuid;
  v_balance numeric;
  v_remaining numeric;
  v_deduction numeric;
  v_amount_row record;
  v_transaction public.transactions%ROWTYPE;
  v_state public.transactions.state%TYPE;
  v_status public.transactions.status%TYPE;
  v_amounts jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'AUTH_REQUIRED' USING ERRCODE = '42501';
  END IF;

  IF p_action NOT IN ('deposit', 'withdraw')
    OR p_amount IS NULL
    OR p_amount < 0.01
    OR ROUND(p_amount, 2) <> p_amount
  THEN
    RAISE EXCEPTION 'INVALID_TRANSACTION' USING ERRCODE = 'P0001';
  END IF;

  PERFORM 1
  FROM public.projects
  WHERE id = p_project_id
    AND user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'PROJECT_ACCESS_DENIED' USING ERRCODE = '42501';
  END IF;

  SELECT id
  INTO v_student_id
  FROM public.student_details
  WHERE id = p_student_id
    AND project_id = p_project_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'STUDENT_NOT_FOUND' USING ERRCODE = 'P0001';
  END IF;

  SELECT COALESCE(SUM(COALESCE(amount, 0)), 0)
  INTO v_balance
  FROM public.amounts
  WHERE student_id = p_student_id;

  IF p_action = 'withdraw' AND p_amount > v_balance THEN
    RAISE EXCEPTION 'INSUFFICIENT_BALANCE' USING ERRCODE = 'P0001';
  END IF;

  IF p_action = 'deposit' THEN
    INSERT INTO public.amounts (student_id, amount)
    VALUES (p_student_id, p_amount);
  ELSE
    v_remaining := p_amount;

    FOR v_amount_row IN
      SELECT id, COALESCE(amount, 0) AS amount
      FROM public.amounts
      WHERE student_id = p_student_id
      ORDER BY id
      FOR UPDATE
    LOOP
      EXIT WHEN v_remaining <= 0;

      v_deduction := LEAST(
        GREATEST(v_amount_row.amount, 0),
        v_remaining
      );

      IF v_deduction > 0 THEN
        UPDATE public.amounts
        SET amount = COALESCE(amount, 0) - v_deduction
        WHERE id = v_amount_row.id;

        v_remaining := v_remaining - v_deduction;
      END IF;
    END LOOP;

    IF v_remaining > 0 THEN
      RAISE EXCEPTION 'INSUFFICIENT_BALANCE' USING ERRCODE = 'P0001';
    END IF;
  END IF;

  v_state := p_action;
  v_status := 'completed';

  INSERT INTO public.transactions (
    student_id,
    state,
    amount,
    description,
    status
  )
  VALUES (
    p_student_id,
    v_state,
    p_amount,
    p_description,
    v_status
  )
  RETURNING * INTO v_transaction;

  SELECT COALESCE(
    jsonb_agg(to_jsonb(amount_row) ORDER BY amount_row.id),
    '[]'::jsonb
  )
  INTO v_amounts
  FROM public.amounts AS amount_row
  WHERE amount_row.student_id = p_student_id;

  RETURN jsonb_build_object(
    'transaction', to_jsonb(v_transaction),
    'amounts', v_amounts
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.apply_student_transaction(
  uuid,
  uuid,
  text,
  numeric,
  text
) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.apply_student_transaction(
  uuid,
  uuid,
  text,
  numeric,
  text
) FROM anon;

GRANT EXECUTE ON FUNCTION public.apply_student_transaction(
  uuid,
  uuid,
  text,
  numeric,
  text
) TO authenticated;
