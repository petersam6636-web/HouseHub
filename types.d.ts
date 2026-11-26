export type StudentMessageRole =
  | "house_master"
  | "student";

export type StudentMessage = {
  id: number;
  student_id: number;

  sender_name: string;
  sender_role: StudentMessageRole;

  message: string;

  created_at: string;

  is_read: boolean;
};

export type StudentFee = {
  id: number;
  student_id: number;

  academic_year: string;
  semester: string;

  fee_name: string;
  amount: number;

  description: string | null;
  due_date: string | null;

  created_at: string;
};


export type StudentsPartTimeJobType = "daily" | "part_time";

export type SemesterJob = {
  id: number;
  part_time_job_id: number | null;

  student_id: number;

  level: string;
  semester: string;
  academic_year: string;

  job_type: SemesterJobType;

  created_at: string;
};

export type StudentsSemesterJobType = "daily" | "part_time";

export type SemesterJob = {
  id: number;
  psemester_job_id: number | null;

  student_id: number;

  level: string;
  semester: string;
  academic_year: string;

  job_type: SemesterJobType;

  created_at: string;
};


export type PartTimeJob = {
  id: number;

  job_name: string;
  description: string | null;

  level: string;
  semester: string;
  job_day: string;
  start_time: string | null;
  end_time: string | null;

  created_at: string;
};

export type DailyJob = {
  id: number;

  job_name: string;
  description: string | null;

  level: string;
  semester: string;

  start_time: string | null;
  end_time: string | null;

  created_at: string;
};

export type StudentFeedback = {
  id: number;
  student_id: number;
  feedback_date: string;
  created_at: string;
};

export type Product = {
  id: number;
  student_id: number;

  product_info: string;
  price: number;
  quantity: number;

  date: string;
  notes: string | null;

  created_at: string;
};


export type TransactionState =
  | "loan"
  | "deposit"
  | "transfer"
  | "withdraw"
  | "message";

export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

export type Transaction = {
  id: number;
  student_id: number;

  state: TransactionState;
  created_at: string;

  amount: number | null;
  description: string | null;
  status: TransactionStatus | null;
  reference: string | null;

  updated_at: string;
};




// Student has many related records
export type StudentDetailsWithRelations = StudentDetails & {
      id: number;
  project_id: number;

  full_name: string;
  index_number: string | null;
  email_address: string | null;

  NHI_image: string | null;
  NHI_number: string;

  birth_cer_image: string;

  mother_name: string;
  father_name: string;

  mother_contact: string;
  father_contact: string;

  emergency_number: string;

  location: string;
  gender: string;

  profile_image: string | null;
    password: string;
  created_at: string;

  transactions: Transaction[];
  products: Product[];
  fees: StudentFee[];
  messages: StudentMessage[];
  feedback: StudentFeedback[];
  semester_jobs: SemesterJob[];
};

// Project has many students and jobs
export type ProjectWithRelations = Project & {
  id: number;
  title: string;
  school_name: string;
  location: string | null;
  logo_image: string | null;
  start_date: string | null;
  academic_year: string;
  user_id: string;
  created_at: string | null;
  students: StudentDetailsWithRelations[];
  daily_jobs: DailyJob[];
  part_time_jobs: PartTimeJob[];
  created_at: string;
};