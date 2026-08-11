# Daddy Gonzo Math
This is a simple maths app designed for elementary school kids. Practice is organized by math concepts rather than individual users, so the same tabs can support everyone using the app.

The current tabs are:

- Add & Subtract
- Multiply & Divide
- Decimals, including no-carry and carry addition

Practice state is intentionally ephemeral. Scores, average time, settings, and cards live only in the current browser session and reset on a fresh load.

## Adding a concept

Concept tabs are maintained in [`app/flash_cards/concepts.ts`](app/flash_cards/concepts.ts). To add, remove, or reorder a tab, update the `concepts` registry and provide its default settings and card generator. New card types belong in [`app/flash_cards/card.tsx`](app/flash_cards/card.tsx) and should implement the shared `ICard` contract, including `clone()`.

## Roadmap

Future concepts may include powers, square roots, fractions, and classifying numbers as integers, rational numbers, or irrational numbers. These should follow the same registry and card patterns without introducing persistent state until there is a clear need for it.

# Development
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Use Node.js 20 for local development. The required version is recorded in [.nvmrc](.nvmrc).

Install dependencies and run the baseline checks with npm:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm audit --audit-level=high
```

The CI audit step reports high-severity findings without blocking this baseline while the required Next.js major-version migration is planned separately. Linting, typechecking, and production builds remain required checks.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment
This app is currently hosted using Github Pages at https://gonzigonz.github.io/daddy-gonzo-math/

It is deployed via a [Github Action](./.github/workflows/nextjs.yml) upon changes to the `main` git branch.

Maintenance changes should be made on a branch and submitted through a pull request. Use the workspace housekeeping skill for the recurring checks and workflow.
