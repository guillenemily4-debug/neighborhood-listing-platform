# AI Collaboration Log



| Tool | Prompt | Output Used | Output Rejected | Verification | Commit |

|---|---|---|---|---|---|

| ChatGPT | Explain in plain language the proposed technology stack for a neighborhood listing platform using Next.js, TypeScript, Tailwind CSS, Git, GitHub, and Vercel. | Used the explanation of Next.js, TypeScript, Tailwind, Git, GitHub, Vercel, and App Router. | No generated code was used because this step only required an explanation. | Compared the response with the technologies required in Lab 1. | 3b2c61b |

| Gemini | Explain in plain language the proposed technology stack for a neighborhood listing platform using Next.js, TypeScript, Tailwind CSS, Git, GitHub, and Vercel. | Used the explanations and examples involving SEO, listing data, mobile responsiveness, Git, GitHub, and Vercel. | Extra analogies and details that were not necessary for the basic explanation. | Compared the response with the technologies required in Lab 1. | 3b2c61b |

| Google AI Studio | Act as a senior teaching assistant. Propose a minimal Next.js App Router + TypeScript + Tailwind starter for a neighborhood property platform. Give a file plan, terminal commands, accessibility requirements, and a verification checklist. Never include secrets. | Used the suggested file plan, terminal workflow, accessibility ideas, and verification checklist as guidance. | Did not use optional packages or generate the full application from AI Studio. | Created the Next.js app manually and verified it at localhost:3000. | 3b2c61b |



## Two Differences



1. Gemini provided more detailed real-world examples, including SEO, listing data, mobile responsiveness, and Git as an "undo button." ChatGPT gave a shorter and more general explanation.



2. ChatGPT specifically mentioned the Next.js App Router. Gemini discussed routing through Next.js but did not specifically identify the App Router.

## Midterm Practical Examination — Version B

| Step / Tool | Prompt Summary | Model Output Used | Model Output Rejected & Rationale | Verification Method | Associated Git Commit |
|---|---|---|---|---|---|
| Part 1 / ChatGPT | Asked how to set up Git on a new laptop, clone the existing project, and create the exam branch. | Used Git installation, cloning, branching, and push instructions. | Rejected creating a new project because the existing repository could be reused. | Verified git version, clean working tree, and successful GitHub push. | 6352bd8 |
| Part 1 / ChatGPT | Asked for help reviewing the .gitignore and AI collaboration log. | Used the existing .env* protection and added exam documentation. | Kept existing Lab 1 records instead of replacing them. | Inspected .gitignore, reviewed Git status, and committed AI documentation. | 6352bd8 |
| Part 2 / ChatGPT | Requested user stories and acceptance criteria for merchants, clients, and administrators. | Used three user stories with Given/When/Then criteria, scope estimates, and implementation references. | Did not replace previous Lab 4 documentation because the exam requirements were separate. | Reviewed requirements.md and confirmed successful GitHub commit. | 1e79251 |
| Part 3 / ChatGPT | Requested PostgreSQL tables and constraints for the services and bookings subsystem. | Used SQL for service categories, services, mappings, and bookings. | Rejected recreating the profiles table after discovering it already existed from Lab 5. | Corrected SQL errors and confirmed the migration appeared in the local Supabase migration history. | 15863d0 |
| Part 4 / ChatGPT | Requested RLS policies for public visitors, providers, clients, and administrators. | Used role-scoped policies, provider restrictions, and administrator approval rules. | Rejected unrestricted public access and client modification of approved services because these violate least privilege. | Verified RLS activation and performed role-based tests in Supabase SQL Editor. | cb04304, 577dbd0, e7e9b5a |
| Part 4 / ChatGPT | Requested assistance testing anonymous, merchant, client, and administrator permissions. | Used SQL test procedures and a security audit matrix. | Corrected an initial test that accessed auth.users after switching to the authenticated role. | Tested approved/draft visibility, provider ownership, booking privacy, and administrator access. | 9d92d15, 2d81dc6 |
| Part 5 / ChatGPT | Requested Zod validation and secure services API handlers. | Used strict Zod validation, authenticated service creation, and approved-service retrieval. | Reused existing Supabase authentication clients rather than creating duplicate connections. | TypeScript, ESLint, and production build passed; GET returned services; unauthenticated POST returned HTTP 401. | e968496, ba64824 |
| Part 6 / ChatGPT | Requested accessible service cards and responsive layouts. | Used ServiceCard, ServiceGrid, semantic HTML, accessible button labels, and responsive Tailwind classes. | Did not use generic nonsemantic wrappers for service cards. | Verified rendering in the browser and passed TypeScript, lint, and build checks. | 75c0a36 |
| Parts 5–6 / ChatGPT | Requested a working services page and appointment booking form. | Used the services browsing page, booking API, and form validation. | Replaced the demonstration alert with an actual database-backed booking workflow. | Submitted a fictional booking and verified the matching record in local Supabase. | 3202157, 3818a49, 01f305c |
| Deployment / ChatGPT | Asked for help troubleshooting the Vercel Services API and hosted Supabase database. | Used migration comparison, scoped database grants, and function permission guidance. | Rejected disabling RLS or using elevated service-role credentials for public requests. | Verified hosted migrations, confirmed database permissions, and observed /api/services return an empty services array. | Add actual deployment-fix commit hashes |
