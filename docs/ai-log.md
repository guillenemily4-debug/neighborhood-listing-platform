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
| :--- | :--- | :--- | :--- | :--- | :--- |
| Part 1 / ChatGPT | Asked for guidance on setting up Git on a different laptop, cloning the existing repository, and creating a dedicated examination branch. | Used instructions for installing Git, cloning the repository, checking branch status, and pushing the exam branch to GitHub. | Did not create a new Next.js project because the existing repository could be reused. | Verified Git installation using `git --version`, confirmed the branch using `git branch --show-current`, and confirmed a successful push to GitHub. | Pending |
| Part 1 / ChatGPT | Reviewed existing `.gitignore` rules for protecting environment files and generated build files. | Used guidance to check `.env*`, `/node_modules`, `/.next/`, and `/dist/` rules. | Kept the existing `.env*` rule rather than replacing it with narrower patterns because it covers more environment-file variants. | Reviewed `.gitignore` contents and confirmed a clean working tree with `git status`. | Pending |
