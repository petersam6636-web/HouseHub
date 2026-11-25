HOUSEMASTER — COMPLETE APPLICATION DEVELOPMENT SPECIFICATION

1. PROJECT IDENTITY

Product Name: HouseMaster

Tagline: Simplifying House Management. Empowering Student Welfare.

Product Type: All-in-One SHS House Administration and Student Welfare Management Platform.

Target Market: Senior High Schools (SHSs) in Ghana.

Project Vision

Build a complete, modern, professional web application that digitises the everyday responsibilities of housemasters and housemistresses in Ghanaian Senior High Schools.

The application should eliminate manual paperwork, improve financial transparency, simplify student information collection, automate student duty assignments, improve attendance monitoring and provide an effective communication system between housemasters and students.

HouseMaster must be a complete multi-school SaaS platform, not an ordinary school management system.

Each school should have its own isolated environment, with administrators, housemasters and students operating within their assigned permissions.

---

2. TECHNOLOGY STACK

Use the following technologies:

Frontend

- React.js
- JavaScript
- Tailwind CSS
- React Router
- Lucide React icons
- Recharts

Backend

- Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions where necessary
- Supabase Row Level Security

Deployment

- Vercel for frontend hosting.
- Supabase for backend services.

Development requirements

- Use reusable React components.
- Use a clean folder structure.
- Separate UI, business logic and database operations.
- Create reusable hooks.
- Use environment variables.
- Implement proper error handling.
- Avoid unnecessary dependencies.
- Use JavaScript consistently.
- Never expose Supabase service-role keys in frontend code.

Do not use mock functionality for features that should be connected to the backend.

---

3. BRAND IDENTITY AND DESIGN SYSTEM

HouseMaster must have a distinctive, premium and modern SaaS design.

The design should communicate professionalism, trust, organisation, financial transparency and educational innovation.

3.1 Main Brand Colour Palette

HouseMaster must use exactly three primary brand colours.

PRIMARY — EMERALD GREEN

- Main: #10B981
- Hover: #059669
- Active: #047857
- Light: #D1FAE5
- Dark: #065F46

Usage:

- Main branding.
- Primary buttons.
- Active navigation.
- Main calls to action.
- Important dashboard indicators.
- Selected navigation items.

SECONDARY — VIOLET

- Main: #8B5CF6
- Hover: #7C3AED
- Active: #6D28D9
- Light: #EDE9FE
- Dark: #5B21B6

Usage:

- Secondary buttons.
- Student management indicators.
- Supporting dashboard elements.
- Duty assignment features.
- Secondary charts and statistics.

ACCENT — AMBER GOLD

- Main: #F59E0B
- Hover: #D97706
- Active: #B45309
- Light: #FEF3C7
- Dark: #92400E

Usage:

- Financial highlights.
- Payment indicators.
- Important notices.
- Premium feature highlights.
- Attention-grabbing statistics.

These three colours must remain the permanent brand identity throughout the application.

Do not randomly introduce new brand colours.

3.2 LIGHT MODE PALETTE

Use a sophisticated, clean and spacious light theme.

Element| Colour
Main background| #F5F8F7
Sidebar| #FFFFFF
Header| #FFFFFF
Cards| #FFFFFF
Elevated surface| #FFFFFF
Primary text| #172033
Secondary text| #64748B
Muted text| #94A3B8
Borders| #E2E8F0
Input background| #FFFFFF
Input border| #CBD5E1
Hover background| #F1F5F9
Selected background| #E7F8F0

3.3 DARK MODE PALETTE

Use Midnight Navy instead of pure black.

Element| Colour
Main background| #0B1220
Sidebar| #101A2A
Header| #101A2A
Cards| #151F30
Elevated surface| #1B283B
Primary text| #F1F5F9
Secondary text| #A1AFC0
Muted text| #8493A7
Borders| #293548
Input background| #111C2D
Input border| #334155
Hover background| #1E293B
Selected background| #12372D

3.4 COLOURED SURFACE TINTS

Brand| Light mode| Dark mode
Emerald| #E7F8F0| #12372D
Violet| #F1EBFF| #2B2045
Amber| #FFF5DF| #40321A

3.5 STATUS COLOURS

Success:

- Light: #15803D
- Dark: #4ADE80

Warning:

- Light: #B45309
- Dark: #FBBF24

Danger:

- Light: #DC2626
- Dark: #F87171

Information:

- Light: #2563EB
- Dark: #60A5FA

Status colours are functional colours, not replacements for the three main brand colours.

3.6 THEME REQUIREMENTS

Implement a complete light and dark theme system.

Requirements:

1. Provide a theme toggle in the top navigation.
2. Support automatic system theme detection.
3. Save the user's theme preference.
4. Apply the theme across every application page.
5. Support both themes in charts, tables, forms, modals, dropdowns and notifications.
6. Use CSS variables or centralised Tailwind design tokens.
7. Maintain readable text contrast.
8. Avoid pure black backgrounds.
9. Avoid bright white surfaces in dark mode.
10. Use subtle theme transitions.
11. Never hardcode random colours inside components.
12. Test every newly created component in both themes.

The application must look professionally designed in both modes.

---

4. USER ROLES AND ACCESS CONTROL

Create three major account types.

4.1 SCHOOL ADMINISTRATOR

The school administrator manages the entire school's environment.

Permissions:

- Manage school information.
- Create and manage houses.
- Register housemasters.
- Assign housemasters to houses.
- Register students.
- Manage student records.
- View school-wide statistics.
- Monitor house finances.
- View financial reports.
- Manage school settings.
- Manage user permissions.
- View school-wide announcements.
- Monitor house activities.

4.2 HOUSEMASTER / HOUSEMISTRESS

Each housemaster should only manage their assigned house.

Permissions:

- Register students.
- Manage student information.
- Collect and track payments.
- Record house expenses.
- Manage house funds.
- Assign student duties.
- Manage attendance.
- Manage dormitories.
- Publish announcements.
- Receive student complaints.
- Manage maintenance requests.
- Generate house reports.

4.3 STUDENT

Students should have personalised accounts.

Permissions:

- View personal information.
- View house and dormitory details.
- View personal payment records.
- View outstanding payments.
- View assigned duties.
- Receive announcements.
- View attendance records.
- Submit complaints.
- Submit maintenance requests.
- View house activities.
- Receive notifications.

Implement strict role-based access control using Supabase RLS.

A student must never access another student's private records.

A housemaster must never access another house's private records without authorised permission.

One school must never access another school's data.

---

5. CORE APPLICATION MODULES

MODULE 1: STUDENT INFORMATION MANAGEMENT

Build a comprehensive digital student registration system.

Features:

- Register students individually.
- Import students using CSV files.
- Record full names.
- Record admission numbers.
- Record gender.
- Record class and programme.
- Record date of admission.
- Record guardian information.
- Record parent contact details.
- Record emergency contact information.
- Assign students to houses.
- Assign students to dormitories.
- Assign students to rooms.
- Edit student records.
- Search students.
- Filter students.
- Export student information.
- View individual student profiles.

Create a beautiful student directory with table and card views.

Provide proper form validation.

Protect sensitive student information.

MODULE 2: FINANCIAL MANAGEMENT

This is one of the most important modules.

Create a complete house financial management system.

Money collection

- Record money collected from students.
- Create payment categories.
- Set payment amounts.
- Track individual student payments.
- Track outstanding payments.
- Record payment dates.
- Record payment descriptions.
- Support partial payments.
- Generate payment receipts.
- View payment history.

House expenses

- Record expenses.
- Select expense categories.
- Record expense amounts.
- Record expense descriptions.
- Upload receipts.
- Record who authorised the expense.
- Track total expenditure.
- Maintain historical records.

Personal student expenses

Where authorised, allow housemasters to record individual student expenses separately from general house funds.

Keep each student's personal financial records private.

Financial dashboard

Display:

- Total money collected.
- Total expenditure.
- Available balance.
- Outstanding payments.
- Recent transactions.
- Monthly financial activity.
- Payment completion statistics.

Financial reports

- Daily reports.
- Weekly reports.
- Monthly reports.
- Student payment reports.
- House expenditure reports.
- Outstanding payment reports.
- Downloadable PDF reports.
- CSV exports.

Financial accountability

Every financial transaction must have:

- Unique transaction ID.
- Student or house reference where applicable.
- Amount.
- Transaction category.
- Description.
- Transaction date.
- Responsible user.
- Supporting receipt where applicable.

Maintain an audit trail.

Never silently delete historical financial records.

Use reversals or correction entries for financial adjustments.

Do not automatically assume that every student payment is received or verified simply because a record was created.

MODULE 3: SMART STUDENT DUTY ASSIGNMENT

Build an intelligent student duty assignment system using JavaScript.

Housemasters should be able to:

- Create daily duties.
- Create weekly duties.
- Create custom duties.
- Define the number of students required per duty.
- Select eligible students.
- Automatically assign students.
- Manually adjust assignments.
- View previous assignments.
- View upcoming schedules.
- Mark duties as completed.
- Record missed duties.
- View assignment history.

SMART ASSIGNMENT ALGORITHM

Create a fair rotation algorithm.

The algorithm must:

1. Distribute tasks evenly.
2. Avoid repeatedly assigning students to the same task.
3. Consider previous assignment history.
4. Exclude students marked absent or unavailable.
5. Respect the required number of students per duty.
6. Allow housemasters to manually override assignments.
7. Save assignment history.
8. Support daily, weekly and custom schedules.
9. Prevent duplicate assignments within the same schedule.
10. Handle cases where there are insufficient eligible students.

Create a beautiful duty schedule showing:

- Duty name.
- Assigned students.
- Assignment date.
- Completion status.
- Responsible housemaster.

MODULE 4: ANNOUNCEMENTS AND COMMUNICATION

Create a central announcement system.

Features:

- Publish announcements.
- Edit announcements.
- Schedule announcements.
- Set announcement priority.
- Attach documents.
- Attach images.
- Notify students.
- Mark announcements as read.
- View announcement history.
- Filter announcements by date.

Use Supabase Realtime where appropriate.

MODULE 5: ATTENDANCE MANAGEMENT

Create a complete attendance system.

Features:

- Morning roll call.
- Evening roll call.
- Manual attendance.
- Present status.
- Absent status.
- Excused status.
- Attendance history.
- Individual attendance records.
- Absence reports.
- Attendance statistics.
- Export attendance reports.

MODULE 6: DORMITORY MANAGEMENT

Features:

- Create dormitories.
- Create rooms.
- Define room capacity.
- Assign students to rooms.
- View room occupants.
- Track available spaces.
- Record room inspections.
- Record cleanliness reports.
- Submit maintenance requests.
- Track maintenance status.

MODULE 7: STUDENT WELFARE AND COMPLAINTS

Allow students to communicate concerns directly with their housemasters.

Features:

- Submit complaints.
- Report maintenance problems.
- Request assistance.
- Report damaged facilities.
- Track complaint status.
- Allow housemasters to respond.
- Maintain complaint history.
- Set complaint priority.

Provide appropriate privacy controls for sensitive complaints.

MODULE 8: NOTIFICATIONS

Create a central notification system.

Features:

- New announcements.
- Duty assignment updates.
- Payment reminders.
- Attendance notifications.
- Complaint responses.
- Maintenance updates.

Support:

- In-app notifications.
- Read and unread status.
- Notification history.
- Notification preferences.

MODULE 9: REPORTS AND ANALYTICS

Create a comprehensive reporting centre.

Include:

- Student population reports.
- Financial reports.
- Payment reports.
- Expense reports.
- Attendance reports.
- Duty assignment reports.
- Duty completion reports.
- Dormitory occupancy reports.
- Complaint reports.

Use Recharts for professional visualisations.

Ensure charts support both light and dark themes.

---

6. DASHBOARD REQUIREMENTS

Create separate dashboards for each account type.

ADMINISTRATOR DASHBOARD

Display:

- Total students.
- Total houses.
- Total housemasters.
- Total financial transactions.
- House performance overview.
- Recent school activities.
- Outstanding issues.
- Recent announcements.
- School-wide statistics.

HOUSEMASTER DASHBOARD

Display:

- Total students in the house.
- Present students.
- Absent students.
- Total money collected.
- Total expenditure.
- Outstanding payments.
- Available house balance.
- Today's assigned duties.
- Pending complaints.
- Recent announcements.
- Recent financial transactions.

STUDENT DASHBOARD

Display:

- Personalised welcome message.
- Student profile summary.
- Current house.
- Current dormitory.
- Personal payment status.
- Outstanding payments.
- Recent payment history.
- Today's assigned duties.
- Upcoming duties.
- Latest announcements.
- Attendance summary.
- Complaint status.

Use visually balanced statistics cards.

Avoid overcrowding dashboards.

---

7. NAVIGATION AND APPLICATION LAYOUT

Create a professional dashboard interface.

Main layout

- Collapsible sidebar.
- Top navigation bar.
- Global search.
- Notification centre.
- User profile menu.
- Theme toggle.
- Breadcrumb navigation.
- Responsive mobile navigation.

Administrator sidebar

1. Overview
2. Houses
3. Housemasters
4. Students
5. Finance
6. Duty Assignments
7. Attendance
8. Dormitories
9. Announcements
10. Welfare
11. Reports
12. Settings

Housemaster sidebar

1. Overview
2. Students
3. Finance
4. Duty Assignments
5. Attendance
6. Dormitories
7. Announcements
8. Welfare
9. Reports
10. Settings

Student navigation

1. My Dashboard
2. My Profile
3. My Payments
4. My Duties
5. Announcements
6. Attendance
7. Complaints
8. Notifications
9. Settings

Only display navigation items that each account is authorised to access.

---

8. DATABASE ARCHITECTURE

Design a properly relational Supabase PostgreSQL database.

Create appropriate tables for:

- schools
- profiles
- school_memberships
- houses
- housemasters
- students
- guardians
- dormitories
- rooms
- payment_categories
- payments
- expenses
- financial_transactions
- duties
- duty_assignments
- attendance
- announcements
- notifications
- complaints
- maintenance_requests
- audit_logs

Use:

- UUID primary keys.
- Foreign keys.
- Created_at timestamps.
- Updated_at timestamps.
- Appropriate indexes.
- Unique constraints.
- Database validation.
- Referential integrity.

Use proper relationships between schools, houses, housemasters and students.

Implement strict Row Level Security policies.

Ensure all data is scoped to the correct school.

Do not rely only on frontend role checks.

Create secure database policies for every sensitive table.

Never expose private information through unrestricted database queries.

---

9. USER EXPERIENCE AND INTERFACE QUALITY

Every page must have:

- Proper form validation.
- Loading states.
- Skeleton loaders.
- Success notifications.
- Error notifications.
- Confirmation dialogs.
- Search functionality.
- Filtering.
- Pagination.
- Empty states.
- Responsive layouts.
- Accessible interactions.

Use consistent design patterns throughout the application.

Create reusable components for:

- Buttons.
- Cards.
- Tables.
- Modals.
- Forms.
- Dropdowns.
- Badges.
- Navigation.
- Statistics cards.
- Charts.
- Notifications.

Avoid unnecessary duplication.

---

10. RESPONSIVE DESIGN

The application must work properly on:

- Desktop computers.
- Laptops.
- Tablets.
- Android smartphones.
- iPhones.

Prioritise mobile responsiveness because many Ghanaian teachers and students primarily use smartphones.

Ensure:

- Responsive sidebar.
- Mobile navigation drawer.
- Responsive tables.
- Mobile-friendly forms.
- Appropriate touch targets.
- Responsive charts.
- Proper text wrapping.
- No horizontal overflow.

---

11. SECURITY AND DATA PROTECTION

Security is essential because the application handles student and financial information.

Implement:

- Supabase authentication.
- Role-based permissions.
- Row Level Security.
- School-level data isolation.
- Secure file uploads.
- Input validation.
- Server-side validation for sensitive actions.
- Audit logging.
- Safe error handling.
- Protected routes.
- Secure password recovery.

Do not expose service-role keys.

Do not allow students to modify their financial records or attendance records.

Do not allow housemasters to modify information outside their authorised houses.

Provide appropriate access restrictions for sensitive student information.

---

12. PROJECT STRUCTURE

Organise the React application into clear directories.

Suggested structure:

src/
  components/
    common/
    dashboard/
    navigation/
    students/
    finance/
    duties/
    attendance/
    dormitories/
    announcements/
    welfare/

  pages/
    auth/
    admin/
    housemaster/
    student/

  hooks/
  contexts/
  services/
  lib/
  utils/
  styles/
  layouts/
  routes/

supabase/
  migrations/
  functions/

Use reusable components and avoid placing the entire application in one large file.

---

13. FUNCTIONALITY REQUIREMENTS

The following rules are mandatory:

1. Every button must perform its advertised action.
2. Every form must validate its input.
3. All important data must be connected to Supabase.
4. Dashboard statistics must come from actual database records.
5. Search and filtering must work.
6. Pagination must work.
7. File uploads must work.
8. Theme switching must work across the entire application.
9. Notifications must work.
10. Authentication must be secure.
11. Role permissions must be enforced.
12. Database relationships must be correct.
13. Financial calculations must be accurate.
14. Duty assignments must follow the fair rotation algorithm.
15. All pages must work on mobile devices.

Never present a static UI as a completed feature.

---

14. DEVELOPMENT WORKFLOW

Build the application systematically.

PHASE 1 — FOUNDATION

- Initialise React.
- Configure Tailwind CSS.
- Configure React Router.
- Configure Supabase.
- Establish the global design system.
- Implement light and dark modes.
- Create authentication.
- Implement protected routes.
- Establish role-based access.

PHASE 2 — SCHOOL STRUCTURE

- School registration.
- Administrator dashboard.
- House creation.
- Housemaster registration.
- Housemaster assignment.
- Student registration.
- Student management.

PHASE 3 — CORE MANAGEMENT

- Financial management.
- Payment tracking.
- Expense tracking.
- Smart duty assignments.
- Attendance.
- Dormitory management.

PHASE 4 — COMMUNICATION AND WELFARE

- Announcements.
- Notifications.
- Complaints.
- Maintenance requests.

PHASE 5 — REPORTING

- Financial reports.
- Attendance reports.
- Student reports.
- Duty reports.
- Analytics dashboards.
- PDF and CSV exports.

PHASE 6 — QUALITY ASSURANCE

- Test every feature.
- Test database permissions.
- Test school data isolation.
- Test both themes.
- Test mobile responsiveness.
- Fix all errors.
- Verify all application workflows.

---

15. FINAL DESIGN AND DEVELOPMENT RULES

HouseMaster must look like a premium international SaaS application designed specifically for Ghanaian Senior High Schools.

The visual identity must remain consistent across every page.

Permanent brand identity

PRIMARY: EMERALD GREEN — #10B981

SECONDARY: VIOLET — #8B5CHOUSEMASTER — COMPLETE APPLICATION DEVELOPMENT SPECIFICATION

1. PROJECT IDENTITY

Product Name: HouseMaster

Tagline: Simplifying House Management. Empowering Student Welfare.

Product Type: All-in-One SHS House Administration and Student Welfare Management Platform.

Target Market: Senior High Schools (SHSs) in Ghana.

Project Vision

Build a complete, modern, professional web application that digitises the everyday responsibilities of housemasters and housemistresses in Ghanaian Senior High Schools.

The application should eliminate manual paperwork, improve financial transparency, simplify student information collection, automate student duty assignments, improve attendance monitoring and provide an effective communication system between housemasters and students.

HouseMaster must be a complete multi-school SaaS platform, not an ordinary school management system.

Each school should have its own isolated environment, with administrators, housemasters and students operating within their assigned permissions.

---

2. TECHNOLOGY STACK

Use the following technologies:

Frontend

- React.js
- JavaScript
- Tailwind CSS
- React Router
- Lucide React icons
- Recharts

Backend

- Supabase Authentication
- Supabase PostgreSQL
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions where necessary
- Supabase Row Level Security

Deployment

- Vercel for frontend hosting.
- Supabase for backend services.

Development requirements

- Use reusable React components.
- Use a clean folder structure.
- Separate UI, business logic and database operations.
- Create reusable hooks.
- Use environment variables.
- Implement proper error handling.
- Avoid unnecessary dependencies.
- Use JavaScript consistently.
- Never expose Supabase service-role keys in frontend code.

Do not use mock functionality for features that should be connected to the backend.

---

3. BRAND IDENTITY AND DESIGN SYSTEM

HouseMaster must have a distinctive, premium and modern SaaS design.

The design should communicate professionalism, trust, organisation, financial transparency and educational innovation.

3.1 Main Brand Colour Palette

HouseMaster must use exactly three primary brand colours.

PRIMARY — EMERALD GREEN

- Main: #10B981
- Hover: #059669
- Active: #047857
- Light: #D1FAE5
- Dark: #065F46

Usage:

- Main branding.
- Primary buttons.
- Active navigation.
- Main calls to action.
- Important dashboard indicators.
- Selected navigation items.

SECONDARY — VIOLET

- Main: #8B5CF6
- Hover: #7C3AED
- Active: #6D28D9
- Light: #EDE9FE
- Dark: #5B21B6

Usage:

- Secondary buttons.
- Student management indicators.
- Supporting dashboard elements.
- Duty assignment features.
- Secondary charts and statistics.

ACCENT — AMBER GOLD

- Main: #F59E0B
- Hover: #D97706
- Active: #B45309
- Light: #FEF3C7
- Dark: #92400E

Usage:

- Financial highlights.
- Payment indicators.
- Important notices.
- Premium feature highlights.
- Attention-grabbing statistics.

These three colours must remain the permanent brand identity throughout the application.

Do not randomly introduce new brand colours.

3.2 LIGHT MODE PALETTE

Use a sophisticated, clean and spacious light theme.

Element| Colour
Main background| #F5F8F7
Sidebar| #FFFFFF
Header| #FFFFFF
Cards| #FFFFFF
Elevated surface| #FFFFFF
Primary text| #172033
Secondary text| #64748B
Muted text| #94A3B8
Borders| #E2E8F0
Input background| #FFFFFF
Input border| #CBD5E1
Hover background| #F1F5F9
Selected background| #E7F8F0

3.3 DARK MODE PALETTE

Use Midnight Navy instead of pure black.

Element| Colour
Main background| #0B1220
Sidebar| #101A2A
Header| #101A2A
Cards| #151F30
Elevated surface| #1B283B
Primary text| #F1F5F9
Secondary text| #A1AFC0
Muted text| #8493A7
Borders| #293548
Input background| #111C2D
Input border| #334155
Hover background| #1E293B
Selected background| #12372D

3.4 COLOURED SURFACE TINTS

Brand| Light mode| Dark mode
Emerald| #E7F8F0| #12372D
Violet| #F1EBFF| #2B2045
Amber| #FFF5DF| #40321A

3.5 STATUS COLOURS

Success:

- Light: #15803D
- Dark: #4ADE80

Warning:

- Light: #B45309
- Dark: #FBBF24

Danger:

- Light: #DC2626
- Dark: #F87171

Information:

- Light: #2563EB
- Dark: #60A5FA

Status colours are functional colours, not replacements for the three main brand colours.

3.6 THEME REQUIREMENTS

Implement a complete light and dark theme system.

Requirements:

1. Provide a theme toggle in the top navigation.
2. Support automatic system theme detection.
3. Save the user's theme preference.
4. Apply the theme across every application page.
5. Support both themes in charts, tables, forms, modals, dropdowns and notifications.
6. Use CSS variables or centralised Tailwind design tokens.
7. Maintain readable text contrast.
8. Avoid pure black backgrounds.
9. Avoid bright white surfaces in dark mode.
10. Use subtle theme transitions.
11. Never hardcode random colours inside components.
12. Test every newly created component in both themes.

The application must look professionally designed in both modes.

---

4. USER ROLES AND ACCESS CONTROL

Create three major account types.

4.1 SCHOOL ADMINISTRATOR

The school administrator manages the entire school's environment.

Permissions:

- Manage school information.
- Create and manage houses.
- Register housemasters.
- Assign housemasters to houses.
- Register students.
- Manage student records.
- View school-wide statistics.
- Monitor house finances.
- View financial reports.
- Manage school settings.
- Manage user permissions.
- View school-wide announcements.
- Monitor house activities.

4.2 HOUSEMASTER / HOUSEMISTRESS

Each housemaster should only manage their assigned house.

Permissions:

- Register students.
- Manage student information.
- Collect and track payments.
- Record house expenses.
- Manage house funds.
- Assign student duties.
- Manage attendance.
- Manage dormitories.
- Publish announcements.
- Receive student complaints.
- Manage maintenance requests.
- Generate house reports.

4.3 STUDENT

Students should have personalised accounts.

Permissions:

- View personal information.
- View house and dormitory details.
- View personal payment records.
- View outstanding payments.
- View assigned duties.
- Receive announcements.
- View attendance records.
- Submit complaints.
- Submit maintenance requests.
- View house activities.
- Receive notifications.

Implement strict role-based access control using Supabase RLS.

A student must never access another student's private records.

A housemaster must never access another house's private records without authorised permission.

One school must never access another school's data.

---

5. CORE APPLICATION MODULES

MODULE 1: STUDENT INFORMATION MANAGEMENT

Build a comprehensive digital student registration system.

Features:

- Register students individually.
- Import students using CSV files.
- Record full names.
- Record admission numbers.
- Record gender.
- Record class and programme.
- Record date of admission.
- Record guardian information.
- Record parent contact details.
- Record emergency contact information.
- Assign students to houses.
- Assign students to dormitories.
- Assign students to rooms.
- Edit student records.
- Search students.
- Filter students.
- Export student information.
- View individual student profiles.

Create a beautiful student directory with table and card views.

Provide proper form validation.

Protect sensitive student information.

MODULE 2: FINANCIAL MANAGEMENT

This is one of the most important modules.

Create a complete house financial management system.

Money collection

- Record money collected from students.
- Create payment categories.
- Set payment amounts.
- Track individual student payments.
- Track outstanding payments.
- Record payment dates.
- Record payment descriptions.
- Support partial payments.
- Generate payment receipts.
- View payment history.

House expenses

- Record expenses.
- Select expense categories.
- Record expense amounts.
- Record expense descriptions.
- Upload receipts.
- Record who authorised the expense.
- Track total expenditure.
- Maintain historical records.

Personal student expenses

Where authorised, allow housemasters to record individual student expenses separately from general house funds.

Keep each student's personal financial records private.

Financial dashboard

Display:

- Total money collected.
- Total expenditure.
- Available balance.
- Outstanding payments.
- Recent transactions.
- Monthly financial activity.
- Payment completion statistics.

Financial reports

- Daily reports.
- Weekly reports.
- Monthly reports.
- Student payment reports.
- House expenditure reports.
- Outstanding payment reports.
- Downloadable PDF reports.
- CSV exports.

Financial accountability

Every financial transaction must have:

- Unique transaction ID.
- Student or house reference where applicable.
- Amount.
- Transaction category.
- Description.
- Transaction date.
- Responsible user.
- Supporting receipt where applicable.

Maintain an audit trail.

Never silently delete historical financial records.

Use reversals or correction entries for financial adjustments.

Do not automatically assume that every student payment is received or verified simply because a record was created.

MODULE 3: SMART STUDENT DUTY ASSIGNMENT

Build an intelligent student duty assignment system using JavaScript.

Housemasters should be able to:

- Create daily duties.
- Create weekly duties.
- Create custom duties.
- Define the number of students required per duty.
- Select eligible students.
- Automatically assign students.
- Manually adjust assignments.
- View previous assignments.
- View upcoming schedules.
- Mark duties as completed.
- Record missed duties.
- View assignment history.

SMART ASSIGNMENT ALGORITHM

Create a fair rotation algorithm.

The algorithm must:

1. Distribute tasks evenly.
2. Avoid repeatedly assigning students to the same task.
3. Consider previous assignment history.
4. Exclude students marked absent or unavailable.
5. Respect the required number of students per duty.
6. Allow housemasters to manually override assignments.
7. Save assignment history.
8. Support daily, weekly and custom schedules.
9. Prevent duplicate assignments within the same schedule.
10. Handle cases where there are insufficient eligible students.

Create a beautiful duty schedule showing:

- Duty name.
- Assigned students.
- Assignment date.
- Completion status.
- Responsible housemaster.

MODULE 4: ANNOUNCEMENTS AND COMMUNICATION

Create a central announcement system.

Features:

- Publish announcements.
- Edit announcements.
- Schedule announcements.
- Set announcement priority.
- Attach documents.
- Attach images.
- Notify students.
- Mark announcements as read.
- View announcement history.
- Filter announcements by date.

Use Supabase Realtime where appropriate.

MODULE 5: ATTENDANCE MANAGEMENT

Create a complete attendance system.

Features:

- Morning roll call.
- Evening roll call.
- Manual attendance.
- Present status.
- Absent status.
- Excused status.
- Attendance history.
- Individual attendance records.
- Absence reports.
- Attendance statistics.
- Export attendance reports.

MODULE 6: DORMITORY MANAGEMENT

Features:

- Create dormitories.
- Create rooms.
- Define room capacity.
- Assign students to rooms.
- View room occupants.
- Track available spaces.
- Record room inspections.
- Record cleanliness reports.
- Submit maintenance requests.
- Track maintenance status.

MODULE 7: STUDENT WELFARE AND COMPLAINTS

Allow students to communicate concerns directly with their housemasters.

Features:

- Submit complaints.
- Report maintenance problems.
- Request assistance.
- Report damaged facilities.
- Track complaint status.
- Allow housemasters to respond.
- Maintain complaint history.
- Set complaint priority.

Provide appropriate privacy controls for sensitive complaints.

MODULE 8: NOTIFICATIONS

Create a central notification system.

Features:

- New announcements.
- Duty assignment updates.
- Payment reminders.
- Attendance notifications.
- Complaint responses.
- Maintenance updates.

Support:

- In-app notifications.
- Read and unread status.
- Notification history.
- Notification preferences.

MODULE 9: REPORTS AND ANALYTICS

Create a comprehensive reporting centre.

Include:

- Student population reports.
- Financial reports.
- Payment reports.
- Expense reports.
- Attendance reports.
- Duty assignment reports.
- Duty completion reports.
- Dormitory occupancy reports.
- Complaint reports.

Use Recharts for professional visualisations.

Ensure charts support both light and dark themes.

---

6. DASHBOARD REQUIREMENTS

Create separate dashboards for each account type.

ADMINISTRATOR DASHBOARD

Display:

- Total students.
- Total houses.
- Total housemasters.
- Total financial transactions.
- House performance overview.
- Recent school activities.
- Outstanding issues.
- Recent announcements.
- School-wide statistics.

HOUSEMASTER DASHBOARD

Display:

- Total students in the house.
- Present students.
- Absent students.
- Total money collected.
- Total expenditure.
- Outstanding payments.
- Available house balance.
- Today's assigned duties.
- Pending complaints.
- Recent announcements.
- Recent financial transactions.

STUDENT DASHBOARD

Display:

- Personalised welcome message.
- Student profile summary.
- Current house.
- Current dormitory.
- Personal payment status.
- Outstanding payments.
- Recent payment history.
- Today's assigned duties.
- Upcoming duties.
- Latest announcements.
- Attendance summary.
- Complaint status.

Use visually balanced statistics cards.

Avoid overcrowding dashboards.

---

7. NAVIGATION AND APPLICATION LAYOUT

Create a professional dashboard interface.

Main layout

- Collapsible sidebar.
- Top navigation bar.
- Global search.
- Notification centre.
- User profile menu.
- Theme toggle.
- Breadcrumb navigation.
- Responsive mobile navigation.

Administrator sidebar

1. Overview
2. Houses
3. Housemasters
4. Students
5. Finance
6. Duty Assignments
7. Attendance
8. Dormitories
9. Announcements
10. Welfare
11. Reports
12. Settings

Housemaster sidebar

1. Overview
2. Students
3. Finance
4. Duty Assignments
5. Attendance
6. Dormitories
7. Announcements
8. Welfare
9. Reports
10. Settings

Student navigation

1. My Dashboard
2. My Profile
3. My Payments
4. My Duties
5. Announcements
6. Attendance
7. Complaints
8. Notifications
9. Settings

Only display navigation items that each account is authorised to access.

---

8. DATABASE ARCHITECTURE

Design a properly relational Supabase PostgreSQL database.

Create appropriate tables for:

- schools
- profiles
- school_memberships
- houses
- housemasters
- students
- guardians
- dormitories
- rooms
- payment_categories
- payments
- expenses
- financial_transactions
- duties
- duty_assignments
- attendance
- announcements
- notifications
- complaints
- maintenance_requests
- audit_logs

Use:

- UUID primary keys.
- Foreign keys.
- Created_at timestamps.
- Updated_at timestamps.
- Appropriate indexes.
- Unique constraints.
- Database validation.
- Referential integrity.

Use proper relationships between schools, houses, housemasters and students.

Implement strict Row Level Security policies.

Ensure all data is scoped to the correct school.

Do not rely only on frontend role checks.

Create secure database policies for every sensitive table.

Never expose private information through unrestricted database queries.

---

9. USER EXPERIENCE AND INTERFACE QUALITY

Every page must have:

- Proper form validation.
- Loading states.
- Skeleton loaders.
- Success notifications.
- Error notifications.
- Confirmation dialogs.
- Search functionality.
- Filtering.
- Pagination.
- Empty states.
- Responsive layouts.
- Accessible interactions.

Use consistent design patterns throughout the application.

Create reusable components for:

- Buttons.
- Cards.
- Tables.
- Modals.
- Forms.
- Dropdowns.
- Badges.
- Navigation.
- Statistics cards.
- Charts.
- Notifications.

Avoid unnecessary duplication.

---

10. RESPONSIVE DESIGN

The application must work properly on:

- Desktop computers.
- Laptops.
- Tablets.
- Android smartphones.
- iPhones.

Prioritise mobile responsiveness because many Ghanaian teachers and students primarily use smartphones.

Ensure:

- Responsive sidebar.
- Mobile navigation drawer.
- Responsive tables.
- Mobile-friendly forms.
- Appropriate touch targets.
- Responsive charts.
- Proper text wrapping.
- No horizontal overflow.

---

11. SECURITY AND DATA PROTECTION

Security is essential because the application handles student and financial information.

Implement:

- Supabase authentication.
- Role-based permissions.
- Row Level Security.
- School-level data isolation.
- Secure file uploads.
- Input validation.
- Server-side validation for sensitive actions.
- Audit logging.
- Safe error handling.
- Protected routes.
- Secure password recovery.

Do not expose service-role keys.

Do not allow students to modify their financial records or attendance records.

Do not allow housemasters to modify information outside their authorised houses.

Provide appropriate access restrictions for sensitive student information.

---

12. PROJECT STRUCTURE

Organise the React application into clear directories.

Suggested structure:

src/
  components/
    common/
    dashboard/
    navigation/
    students/
    finance/
    duties/
    attendance/
    dormitories/
    announcements/
    welfare/

  pages/
    auth/
    admin/
    housemaster/
    student/

  hooks/
  contexts/
  services/
  lib/
  utils/
  styles/
  layouts/
  routes/

supabase/
  migrations/
  functions/

Use reusable components and avoid placing the entire application in one large file.

---

13. FUNCTIONALITY REQUIREMENTS

The following rules are mandatory:

1. Every button must perform its advertised action.
2. Every form must validate its input.
3. All important data must be connected to Supabase.
4. Dashboard statistics must come from actual database records.
5. Search and filtering must work.
6. Pagination must work.
7. File uploads must work.
8. Theme switching must work across the entire application.
9. Notifications must work.
10. Authentication must be secure.
11. Role permissions must be enforced.
12. Database relationships must be correct.
13. Financial calculations must be accurate.
14. Duty assignments must follow the fair rotation algorithm.
15. All pages must work on mobile devices.

Never present a static UI as a completed feature.

---

14. DEVELOPMENT WORKFLOW

Build the application systematically.

PHASE 1 — FOUNDATION

- Initialise React.
- Configure Tailwind CSS.
- Configure React Router.
- Configure Supabase.
- Establish the global design system.
- Implement light and dark modes.
- Create authentication.
- Implement protected routes.
- Establish role-based access.

PHASE 2 — SCHOOL STRUCTURE

- School registration.
- Administrator dashboard.
- House creation.
- Housemaster registration.
- Housemaster assignment.
- Student registration.
- Student management.

PHASE 3 — CORE MANAGEMENT

- Financial management.
- Payment tracking.
- Expense tracking.
- Smart duty assignments.
- Attendance.
- Dormitory management.

PHASE 4 — COMMUNICATION AND WELFARE

- Announcements.
- Notifications.
- Complaints.
- Maintenance requests.

PHASE 5 — REPORTING

- Financial reports.
- Attendance reports.
- Student reports.
- Duty reports.
- Analytics dashboards.
- PDF and CSV exports.

PHASE 6 — QUALITY ASSURANCE

- Test every feature.
- Test database permissions.
- Test school data isolation.
- Test both themes.
- Test mobile responsiveness.
- Fix all errors.
- Verify all application workflows.

---

15. FINAL DESIGN AND DEVELOPMENT RULES

HouseMaster must look like a premium international SaaS application designed specifically for Ghanaian Senior High Schools.

The visual identity must remain consistent across every page.

Permanent brand identity

PRIMARY: EMERALD GREEN — #10B981

SECONDARY: VIOLET — #8B5CF6

ACCENT: AMBER GOLD — #F59E0B

LIGHT BACKGROUND: #F5F8F7

DARK BACKGROUND: #0B1220

Non-negotiable requirements

- Always follow the defined colour palette.
- Always support light and dark modes.
- Never introduce random brand colours.
- Never use pure black as the main background.
- Never create inconsistent page designs.
- Always use reusable components.
- Always prioritise accessibility.
- Always prioritise security.
- Always ensure the application is responsive.
- Never leave important buttons non-functional.
- Never replace real backend functionality with fake data.
- Never compromise school data isolation.

FINAL GOAL:

Deliver a complete, secure, beautiful and production-ready HouseMaster platform that transforms how housemasters and housemistresses manage students, finances, duties, attendance, dormitories and student welfare in Ghanaian Senior High Schools.