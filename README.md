# Venturelens — AI-Powered VC & Startup Intelligence Engine

[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Venturelens** is an automated venture capital analytics platform engineered for investors, incubators, and startup founders. It leverages deterministic rule engines, structured AI explainers, and real-time knowledge graphs to calculate startup defensibility, market alignment, unit economics, and investment risk profiles.

---

## Core Capabilities

- **Multi-Engine Evaluation Pipeline**: Combines scoring engines, consistency verifiers, rule engines, and structured AI extractors.
- **Interactive Investment Wizard**: Step-by-step evaluation workflow for startup pitch decks, financials, and team profiles.
- **Knowledge Graph Synthesis**: Maps founder expertise, market TAM/SAM, competitive moats, and valuation metrics.
- **Comprehensive Reporting Dashboard**: Generates investor-grade PDF/UI evaluation reports with risk radar charts and actionable recommendations.
- **Supabase Row-Level Security**: Enterprise-grade persistence layer enforcing strict access control policies.

---

## System Architecture

```mermaid
flowchart TD
    User[Investor / Founder UI] -->|Input Deck & Financials| Wizard[Analysis Wizard]
    Wizard -->|POST /api/analyze| API[Next.js API Engine]
    
    subgraph Core Engines
        API --> RuleEng[Rule Engine]
        API --> ScoreEng[Scoring Engine]
        API --> ConsistEng[Consistency Engine]
        API --> KG[Knowledge Graph Engine]
        API --> AIExpl[AI Explainer Module]
    end

    RuleEng & ScoreEng & ConsistEng & KG & AIExpl -->|Consolidated Report| Report[Investment Memo Generator]
    Report -->|Persist Metadata| DB[(Supabase Postgres)]
    Report -->|Render Visual Analysis| Dashboard[Analytics Dashboard]
```

---

## Repository Structure

```
Venturelens/
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   ├── lib/
│   │   └── engines/        # Deterministic scoring, rule & AI explainer engines
│   ├── stores/             # Zustand state management
│   ├── types/              # TypeScript interface definitions & schemas
│   └── utils/
│       └── supabase/       # Supabase client, server, and middleware helpers
├── supabase/               # PostgreSQL schema & security migrations
├── public/                 # Static assets & vectors
├── LICENSE                 # MIT License
├── package.json            # Node project configuration
└── .github/workflows/ci.yml # GitHub Actions CI workflow
```

---

## Quick Start

### 1. Installation

```bash
git clone https://github.com/dathasaiswaroopgudimella-png/Venturelens.git
cd Venturelens
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Start Development Server

```bash
npm run dev
```
Open `http://localhost:3000` to access the application interface.

---

## License

This repository is distributed under the [MIT License](LICENSE).
