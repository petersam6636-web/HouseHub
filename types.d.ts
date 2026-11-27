
export type StudentMessageRole =
  | "house_master"
  | "student";

export type StudentMessage = {
  id: string;
  student_id: string;

  sender_name: string;
  sender_role: StudentMessageRole;

  message: string;

  created_at: string;

  is_read: boolean;
};

export type StudentFee = {
  id: string;
  student_id: string;

  academic_year: string;
  semester: string;

  fee_name: string;
  amount: number;

  description: string | null;
  due_date: string | null;

  created_at: string;
};

export type Amount = {
  id: string;
  student_id: string;

  [key: string]: unknown;
};

export type StudentsPartTimeJobType =
  | "daily"
  | "part_time";

export type StudentPartTimeJob = {
  id: string;
  part_time_job_id: string | null;

  student_id: string;

  level: string;
  semester: string;
  academic_year: string;

  job_type: StudentsPartTimeJobType;

  created_at: string;
};

export type StudentsSemesterJobType =
  | "daily"
  | "part_time";

export type StudentSemesterJob = {
  id: string;
  psemester_job_id: string | null;

  student_id: string;

  level: string;
  semester: string;
  academic_year: string;

  job_type: StudentsSemesterJobType;

  created_at: string;
};


export type PartTimeJob = {
  id: string;
  project_id: string;

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
  id: string;
  project_id: string;

  job_name: string;
  description: string | null;

  level: string;
  semester: string;

  start_time: string | null;
  end_time: string | null;

  created_at: string;
};


export type StudentFeedback = {
  id: string;
  student_id: string;

  feedback_date: string;
  created_at: string;
};

export type Product = {
  id: string;
  student_id: string;

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
  id: string;
  student_id: string;

  state: TransactionState;
  created_at: string;

  amount: number | null;
  description: string | null;
  status: TransactionStatus | null;
  reference: string | null;

  updated_at: string;
};


// Student has many related records
export type StudentDetailsWithRelations = {
  id: string;
  project_id: string;

  full_name: string;
  index_number: string | null;
  email_address: string | null;

  nhi_image: string | null;
  nhi_number: string;

  birth_cer_image: string;

  mother_name: string;
  father_name: string;

  mother_contact: string;
  father_contact: string;

  emergency_number: string;

  location: string;
  gender: string;
  password: string;
  profile_image: string | null;
  created_at: string;

  amounts: Amount[];
  transactions: Transaction[];
  products: Product[];
  fees: StudentFee[];
  messages: StudentMessage[];
  feedback: StudentFeedback[];
  semester_jobs: StudentSemesterJob[];
  part_time_jobs: StudentPartTimeJob[];
};


// Project has many students and jobs
export type ProjectWithRelations = {
  id: string;

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
};

export type ProjectSummary = Pick<
  ProjectWithRelations,
  | "id"
  | "title"
  | "school_name"
  | "location"
  | "logo_image"
  | "start_date"
  | "academic_year"
  | "user_id"
  | "created_at"
>;
