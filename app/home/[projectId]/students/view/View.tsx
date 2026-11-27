
// "use client";

// import { Suspense } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// import {
//   ArrowLeft,
//   ArrowUpRight,
//   BriefcaseBusiness,
//   CalendarDays,
//   CheckCircle2,
//   Clock3,
//   Mail,
//   MapPin,
//   MessageCircle,
//   Phone,
//   ShieldCheck,
//   UserRound,
//   Users,
//   Wallet,
// } from "lucide-react";

// import Header from "@/components/Header";
// import useApp from "@/lib/useApp";

// import type {
//   ProjectWithRelations,
//   StudentDetailsWithRelations,
// } from "@/types";

// function formatDate(value: string | null | undefined) {
//   if (!value) return "Not available";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "Not available";
//   }

//   return date.toLocaleDateString("en-GH", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });
// }

// function getInitials(name: string) {
//   return name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("");
// }

// function DetailCard({
//   title,
//   value,
//   icon: Icon,
// }: {
//   title: string;
//   value: string;
//   icon: React.ElementType;
// }) {
//   return (
//     <div className="rounded-2xl border border-white/[0.07] bg-[#0B1424] p-4 transition hover:border-blue-400/20">
//       <div className="flex items-center gap-2 text-slate-400">
//         <Icon size={15} className="text-blue-400" />

//         <span className="text-xs">{title}</span>
//       </div>

//       <p className="mt-3 break-words text-sm font-semibold text-white">
//         {value || "Not provided"}
//       </p>
//     </div>
//   );
// }

// function SectionCard({
//   title,
//   description,
//   icon: Icon,
//   children,
// }: {
//   title: string;
//   description?: string;
//   icon: React.ElementType;
//   children: React.ReactNode;
// }) {
//   return (
//     <section className="min-w-0 rounded-3xl border border-white/[0.07] bg-[#0B1424] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-6">
//       <div className="flex items-start gap-3">
//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/[0.12] bg-blue-500/[0.08]">
//           <Icon size={18} className="text-blue-400" />
//         </div>

//         <div className="min-w-0">
//           <h2 className="text-sm font-semibold text-white">
//             {title}
//           </h2>

//           {description && (
//             <p className="mt-1 text-xs leading-5 text-slate-500">
//               {description}
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="mt-5">{children}</div>
//     </section>
//   );
// }

// function StatCard({
//   label,
//   value,
//   icon: Icon,
// }: {
//   label: string;
//   value: number;
//   icon: React.ElementType;
// }) {
//   return (
//     <div className="rounded-2xl border border-white/[0.07] bg-[#0B1424] p-4">
//       <div className="flex items-center justify-between gap-2">
//         <p className="text-xs text-slate-400">{label}</p>

//         <Icon size={16} className="text-blue-400" />
//       </div>

//       <p className="mt-3 text-2xl font-bold tracking-tight text-white">
//         {new Intl.NumberFormat("en-GH").format(value)}
//       </p>
//     </div>
//   );
// }

// function ViewStudentContent() {
//   const params = useSearchParams();

//   const studentId = params.get("id");
//   const projectId = params.get("projectId");

//   const { projects } = useApp();

//   const project = projects.find(
//     (item) => item.id === projectId
//   ) as ProjectWithRelations | undefined;

//   const student = project?.students?.find(
//     (item) => item.id === studentId
//   ) as StudentDetailsWithRelations | undefined;

//   if (!studentId || !projectId) {
//     return (
//       <>
//         <Header />

//         <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4">
//           <div className="max-w-sm text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//               <UserRound className="text-blue-400" size={24} />
//             </div>

//             <h1 className="mt-5 text-lg font-semibold text-white">
//               Missing student information
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               The student ID or project ID was not provided.
//             </p>

//             <Link
//               href="/home"
//               className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
//             >
//               <ArrowLeft size={16} />
//               Back to dashboard
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   if (!project || !student) {
//     return (
//       <>
//         <Header />

//         <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4">
//           <div className="max-w-sm text-center">
//             <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
//               <Users className="text-blue-400" size={24} />
//             </div>

//             <h1 className="mt-5 text-lg font-semibold text-white">
//               Student not found
//             </h1>

//             <p className="mt-2 text-sm leading-6 text-slate-400">
//               This student could not be found in the selected project.
//             </p>

//             <Link
//               href={`/home/${projectId}/students?id=${projectId}`}
//               className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
//             >
//               <ArrowLeft size={16} />
//               Back to students
//             </Link>
//           </div>
//         </main>
//       </>
//     );
//   }

//   const transactions = student.transactions ?? [];
//   const fees = student.fees ?? [];
//   const messages = student.messages ?? [];
//   const products = student.products ?? [];
//   const feedback = student.feedback ?? [];

//   const completedTransactions = transactions.filter(
//     (transaction) => transaction.status === "completed"
//   );

//   const pendingTransactions = transactions.filter(
//     (transaction) => transaction.status === "pending"
//   );

//   const unreadMessages = messages.filter(
//     (message) => !message.is_read
//   );

//   const totalFees = fees.reduce(
//     (total, fee) => total + (Number(fee.amount) || 0),
//     0
//   );

//   const totalProductValue = products.reduce(
//     (total, product) =>
//       total +
//       (Number(product.price) || 0) *
//         (Number(product.quantity) || 0),
//     0
//   );

//   const money = (value: number) =>
//     new Intl.NumberFormat("en-GH", {
//       style: "currency",
//       currency: "GHS",
//       maximumFractionDigits: 2,
//     }).format(value);

//   return (
//     <>
//       <Header />

//       <main className="min-h-[calc(100vh-72px)] w-full px-3 py-5 text-white sm:px-5 sm:py-8 lg:px-8">
//         <div className="mx-auto w-full max-w-6xl">
//           {/* Back navigation */}
//           <Link
//             href={`/home/${projectId}/students?id=${projectId}`}
//             className="group inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
//           >
//             <ArrowLeft
//               size={15}
//               className="transition group-hover:-translate-x-0.5"
//             />

//             All students
//           </Link>

//           {/* Student hero */}
//           <section className="relative mt-5 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#14243A] via-[#0D1728] to-[#080E19] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
//             <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.10] blur-3xl" />

//             <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-8">
//               {/* Profile image */}
//               <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32">
//                 {student.profile_image ? (
//                   <img
//                     src={student.profile_image}
//                     alt={student.full_name}
//                     className="h-full w-full rounded-3xl border border-white/10 object-cover shadow-xl"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10 text-3xl font-bold text-blue-300">
//                     {getInitials(student.full_name)}
//                   </div>
//                 )}

//                 <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-4 border-[#101D31] bg-blue-500">
//                   <ShieldCheck size={16} className="text-white" />
//                 </div>
//               </div>

//               {/* Student identity */}
//               <div className="min-w-0 flex-1">
//                 <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
//                   Student profile
//                 </p>

//                 <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
//                   {student.full_name}
//                 </h1>

//                 <p className="mt-2 text-sm text-slate-400">
//                   {student.index_number || "Index number not assigned"}
//                 </p>

//                 <div className="mt-4 flex flex-wrap gap-2">
//                   {student.gender && (
//                     <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.08] px-3 py-1.5 text-xs text-blue-200">
//                       {student.gender}
//                     </span>
//                   )}

//                   {student.location && (
//                     <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-300">
//                       <MapPin size={12} />
//                       {student.location}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Contact actions */}
//               <div className="flex flex-wrap gap-2 sm:flex-col">
//                 {student.email_address && (
//                   <a
//                     href={`mailto:${student.email_address}`}
//                     className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10"
//                   >
//                     <Mail size={15} />
//                     Email student
//                     <ArrowUpRight size={13} />
//                   </a>
//                 )}

//                 {student.emergency_number && (
//                   <a
//                     href={`tel:${student.emergency_number}`}
//                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-blue-500"
//                   >
//                     <Phone size={15} />
//                     Emergency contact
//                   </a>
//                 )}
//               </div>
//             </div>

//             {/* Project information */}
//             <div className="relative flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.06] px-5 py-4 sm:px-8">
//               <div className="flex items-center gap-2 text-xs text-slate-400">
//                 <CalendarDays size={14} className="text-blue-400" />
//                 Registered {formatDate(student.created_at)}
//               </div>

//               <div className="flex items-center gap-2 text-xs text-slate-400">
//                 <MapPin size={14} className="text-blue-400" />
//                 {project.school_name}
//               </div>
//             </div>
//           </section>

//           {/* Student statistics */}
//           <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
//             <StatCard
//               label="Transactions"
//               value={transactions.length}
//               icon={Wallet}
//             />

//             <StatCard
//               label="Completed"
//               value={completedTransactions.length}
//               icon={CheckCircle2}
//             />

//             <StatCard
//               label="Pending"
//               value={pendingTransactions.length}
//               icon={Clock3}
//             />

//             <StatCard
//               label="Messages"
//               value={unreadMessages.length}
//               icon={MessageCircle}
//             />
//           </section>

//           {/* Main content */}
//           <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
//             {/* Personal information */}
//             <div className="lg:col-span-7">
//               <SectionCard
//                 title="Personal information"
//                 description="Student identity and contact details"
//                 icon={UserRound}
//               >
//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                   <DetailCard
//                     title="Full name"
//                     value={student.full_name}
//                     icon={UserRound}
//                   />

//                   <DetailCard
//                     title="Index number"
//                     value={student.index_number || "Not assigned"}
//                     icon={ShieldCheck}
//                   />

//                   <DetailCard
//                     title="Email address"
//                     value={student.email_address || "Not provided"}
//                     icon={Mail}
//                   />

//                   <DetailCard
//                     title="Gender"
//                     value={student.gender || "Not provided"}
//                     icon={Users}
//                   />

//                   <DetailCard
//                     title="Location"
//                     value={student.location || "Not provided"}
//                     icon={MapPin}
//                   />

//                   <DetailCard
//                     title="Registration date"
//                     value={formatDate(student.created_at)}
//                     icon={CalendarDays}
//                   />
//                 </div>
//               </SectionCard>
//             </div>

//             {/* Emergency contact */}
//             <div className="lg:col-span-5">
//               <SectionCard
//                 title="Emergency contact"
//                 description="Important contact information"
//                 icon={Phone}
//               >
//                 <div className="rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] p-4">
//                   <p className="text-xs text-slate-400">
//                     Emergency phone number
//                   </p>

//                   <p className="mt-3 break-all text-xl font-bold tracking-tight text-white">
//                     {student.emergency_number || "Not provided"}
//                   </p>

//                   {student.emergency_number && (
//                     <a
//                       href={`tel:${student.emergency_number}`}
//                       className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-semibold text-white transition hover:bg-blue-500"
//                     >
//                       <Phone size={15} />
//                       Call emergency contact
//                     </a>
//                   )}
//                 </div>

//                 <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
//                   <DetailCard
//                     title="Mother's contact"
//                     value={student.mother_contact || "Not provided"}
//                     icon={Phone}
//                   />

//                   <DetailCard
//                     title="Father's contact"
//                     value={student.father_contact || "Not provided"}
//                     icon={Phone}
//                   />
//                 </div>
//               </SectionCard>
//             </div>

//             {/* Parents */}
//             <div className="lg:col-span-6">
//               <SectionCard
//                 title="Parent information"
//                 description="Student's family contact details"
//                 icon={Users}
//               >
//                 <div className="space-y-3">
//                   <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
//                     <p className="text-xs text-slate-500">
//                       Mother / Guardian
//                     </p>

//                     <p className="mt-2 text-sm font-semibold text-white">
//                       {student.mother_name || "Not provided"}
//                     </p>

//                     {student.mother_contact && (
//                       <a
//                         href={`tel:${student.mother_contact}`}
//                         className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-blue-300 hover:text-blue-200"
//                       >
//                         <Phone size={13} />
//                         {student.mother_contact}
//                       </a>
//                     )}
//                   </div>

//                   <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
//                     <p className="text-xs text-slate-500">
//                       Father / Guardian
//                     </p>

//                     <p className="mt-2 text-sm font-semibold text-white">
//                       {student.father_name || "Not provided"}
//                     </p>

//                     {student.father_contact && (
//                       <a
//                         href={`tel:${student.father_contact}`}
//                         className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-blue-300 hover:text-blue-200"
//                       >
//                         <Phone size={13} />
//                         {student.father_contact}
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </SectionCard>
//             </div>

//             {/* Student activity */}
//             <div className="lg:col-span-6">
//               <SectionCard
//                 title="Student activity"
//                 description="Related records connected to this student"
//                 icon={BriefcaseBusiness}
//               >
//                 <div className="grid grid-cols-2 gap-3">
//                   <DetailCard
//                     title="Student fees"
//                     value={String(fees.length)}
//                     icon={Wallet}
//                   />

//                   <DetailCard
//                     title="Products"
//                     value={String(products.length)}
//                     icon={BriefcaseBusiness}
//                   />

//                   <DetailCard
//                     title="Feedback"
//                     value={String(feedback.length)}
//                     icon={MessageCircle}
//                   />

//                   <DetailCard
//                     title="Job assignments"
//                     value={String(
//                       (student.semester_jobs ?? []).length +
//                         (student.part_time_jobs ?? []).length
//                     )}
//                     icon={CheckCircle2}
//                   />
//                 </div>

//                 <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
//                   <div className="flex items-center justify-between gap-3">
//                     <span className="text-xs text-slate-400">
//                       Recorded fee amount
//                     </span>

//                     <span className="text-sm font-bold text-white">
//                       {money(totalFees)}
//                     </span>
//                   </div>

//                   <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
//                     <span className="text-xs text-slate-400">
//                       Recorded product value
//                     </span>

//                     <span className="text-sm font-bold text-white">
//                       {money(totalProductValue)}
//                     </span>
//                   </div>
//                 </div>
//               </SectionCard>
//             </div>
//           </section>
//         </div>
//       </main>
//     </>
//   );
// }

// function ViewStudentFallback() {
//   return (
//     <>
//       <Header />

//       <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-400" />

//           <p className="text-xs text-slate-400">
//             Loading student profile...
//           </p>
//         </div>
//       </main>
//     </>
//   );
// }

// export default function ViewStudent() {
//   return (
//     <Suspense fallback={<ViewStudentFallback />}>
//       <ViewStudentContent />
//     </Suspense>
//   );
// }
