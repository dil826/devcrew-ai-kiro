/**
 * Demonstration data for the DevCrew AI frontend MVP.
 * All content is static — no Gemini API calls are made.
 */

import { Blueprint, BlueprintSection, ProjectSummary } from '../types/blueprint';
import { AgentStatus } from '../types/agent';

// ─── Agent names ────────────────────────────────────────────────────────────

export const AGENT_NAMES = [
  'Product Manager',
  'Requirements Analyst',
  'Software Architect',
  'Database Designer',
  'Testing Engineer',
  'Deployment Planner',
] as const;

// ─── Initial (idle) agent list ───────────────────────────────────────────────

export function createInitialAgents(): AgentStatus[] {
  return AGENT_NAMES.map((name) => ({ name, status: 'Waiting' as const }));
}

// ─── Demo blueprint generator ────────────────────────────────────────────────

export function generateDemoBlueprint(
  softwareIdea: string,
  productType: string,
  complexityLevel: string,
): Blueprint {
  const id = `demo-${Date.now()}`;
  const now = new Date();
  const idea = softwareIdea.slice(0, 120);

  const sections: BlueprintSection[] = [
    {
      agent: 'Product Manager',
      title: 'Product Vision & User Stories',
      content: `## Project Summary

**Idea**: ${idea}

This ${complexityLevel} targets users who need a reliable ${productType.toLowerCase()} solution. The core value proposition is simplifying complex workflows and delivering results faster than existing alternatives.

## Target Users
- **Primary**: Professionals and teams who deal with this problem daily
- **Secondary**: Individuals exploring personal productivity improvements
- **Tertiary**: Organizations looking to scale efficient processes

## Core Features (${complexityLevel})
${complexityLevel === 'Prototype'
  ? '- Basic input/output interface\n- Core workflow with minimal friction\n- Simple data display\n- Manual export of results'
  : '- Full user-facing UI with guided onboarding\n- Core workflow with smart defaults\n- Dashboard with real-time feedback\n- Export to multiple formats\n- Notification system for key events'}

## User Stories
1. **As a user**, I want to get started quickly so I can see results without a steep learning curve.
2. **As a team lead**, I want to invite collaborators so my whole team benefits from the tool.
3. **As a power user**, I want to customize the workflow so it matches my exact process.
4. **As a mobile user**, I want a responsive interface so I can work from any device.

## Success Metrics
- Activation rate > 60 % within 7 days of signup
- Task completion rate > 85 %
- User satisfaction (NPS) > 40
- < 3 steps to complete the primary action`,
      keyPoints: [
        `Targeting ${complexityLevel === 'Prototype' ? 'early adopters validating the core idea' : 'early majority ready for a polished product'}`,
        'One-click primary action is critical for adoption',
        'Mobile responsiveness must be first-class, not an afterthought',
        'Onboarding flow should deliver first value within 60 seconds',
      ],
      generatedAt: now,
    },
    {
      agent: 'Requirements Analyst',
      title: 'Functional & Non-Functional Requirements',
      content: `## Functional Requirements

### Core Features
- **FR-001** — Users can create, read, update, and delete primary data entities *(Priority: Critical)*
- **FR-002** — The system validates all user input before processing *(Priority: Critical)*
- **FR-003** — The system provides real-time feedback during long-running operations *(Priority: High)*
- **FR-004** — Users can search and filter across all data *(Priority: High)*
- **FR-005** — Users can export their data in at least one portable format *(Priority: Medium)*

### User Management
- **FR-006** — ${complexityLevel === 'MVP' ? 'Users register with email/password' : 'No auth — single anonymous session per device'}
- **FR-007** — System remembers user preferences across sessions

### Integration
- **FR-008** — All external API calls are made server-side to protect credentials

## Non-Functional Requirements

### Performance
- **NFR-001** — Initial page load < 2 s on a 4G connection
- **NFR-002** — Key interactions respond within 200 ms
- **NFR-003** — ${complexityLevel === 'MVP' ? 'Support 100 concurrent users' : 'Support 10 concurrent users for prototype validation'}

### Security
- **NFR-004** — HTTPS only; no sensitive data in URL params
- **NFR-005** — Server-side API keys; never exposed to the client
- **NFR-006** — Input sanitisation on all text fields

### Usability
- **NFR-007** — WCAG 2.1 AA compliance
- **NFR-008** — Fully keyboard-navigable interface
- **NFR-009** — Responsive from 320 px (mobile) to 1920 px (desktop)

### Reliability
- **NFR-010** — Graceful error messages for every failure mode
- **NFR-011** — Local-storage fallback when remote persistence is unavailable`,
      keyPoints: [
        'Input validation (FR-002) prevents malformed data from reaching the backend',
        'Real-time feedback (FR-003) is essential for analysis-style features',
        'Server-side API keys (NFR-005) are non-negotiable from day one',
        `Performance budget: < 2 s load, < 200 ms interaction`,
      ],
      generatedAt: now,
    },
    {
      agent: 'Software Architect',
      title: 'Architecture & Technology Stack',
      content: `## Recommended Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 + TypeScript | Server-side rendering, App Router, type safety |
| Styling | Tailwind CSS v4 | Utility-first, no runtime overhead |
| State | React useState / useReducer | Sufficient for ${complexityLevel === 'Prototype' ? 'prototype scale' : 'MVP scale; add Zustand if complexity grows'} |
| Backend | Next.js API Routes | Collocated with frontend; no separate server needed |
| AI | Google Gemini via \`@google/generative-ai\` | Multi-modal, high context window |
| Storage | Browser localStorage | Meets MVP requirements; no backend DB needed |
| Deployment | Vercel | Zero-config Next.js deployment |

## System Architecture

\`\`\`
Browser
  └─ Next.js App Router (app/)
       ├─ page.tsx           ← Client component — manages global state
       ├─ layout.tsx         ← Root layout, fonts, metadata
       └─ api/
            └─ analyze/
                 └─ route.ts ← Server Action — Gemini calls live here
\`\`\`

## Component Architecture

\`\`\`
page.tsx (state: form values, agents, blueprint, history)
  ├─ SoftwareIdeaForm      ← inputs, validation, submission
  ├─ AgentStatusMonitor    ← live status cards for 6 agents
  ├─ BlueprintViewer       ← tabbed results display
  └─ ProjectHistory        ← localStorage-backed history
\`\`\`

## Key Design Decisions
- **Sequential agent execution**: Each agent receives the previous agent's output as context
- **Optimistic UI**: Status cards update immediately; no polling required for demo
- **localStorage schema**: Store up to 10 completed projects; auto-prune oldest on overflow`,
      keyPoints: [
        'All Gemini calls must go through the API route — never from the browser',
        'Component state flows down via props; callbacks flow up',
        'localStorage is keyed by project ID; always JSON-serialise dates as ISO strings',
        'Tailwind v4 @theme tokens replace the need for a separate design-token file',
      ],
      generatedAt: now,
    },
    {
      agent: 'Database Designer',
      title: 'Data Models & Storage Design',
      content: `## Data Architecture

Since the ${complexityLevel} uses browser localStorage (no external DB), this section defines the client-side data schema.

## Core Entities

### Project (StoredProject)
\`\`\`typescript
{
  id: string;                  // e.g. "proj_1720000000000"
  softwareIdea: string;        // raw user input
  productType: ProductType;
  complexityLevel: 'Prototype' | 'MVP';
  createdAt: string;           // ISO-8601
  agentStatuses: AgentStatus[];
  blueprint: Blueprint;
}
\`\`\`

### Blueprint
\`\`\`typescript
{
  id: string;
  softwareIdea: string;
  productType: ProductType;
  complexityLevel: ComplexityLevel;
  createdAt: Date;
  updatedAt: Date;
  sections: BlueprintSection[];  // one per agent
  metadata: {
    totalProcessingTime: number;
    agentCount: number;
    wordCount: number;
  };
}
\`\`\`

### BlueprintSection
\`\`\`typescript
{
  agent: string;       // e.g. "Product Manager"
  title: string;
  content: string;     // Markdown
  keyPoints: string[];
  generatedAt: Date;
}
\`\`\`

## localStorage Layout

| Key | Value |
|---|---|
| \`devcrew-projects\` | \`StoredProject[]\` (max 10) |
| \`devcrew-settings\` | \`UserSettings\` |

## Storage Operations
1. **Save**: Prepend new project; if length > 10, pop oldest.
2. **Load**: Parse JSON; rehydrate Date strings to Date objects.
3. **Delete**: Filter by ID and save remainder.
4. **Clear**: Remove key entirely.

## Data Integrity
- Validate structure on load; discard corrupt entries silently.
- Always clone before mutating (avoid reference bugs with React state).`,
      keyPoints: [
        'Always serialise Date objects as ISO strings before JSON.stringify',
        'Rehydrate ISO strings back to Date on JSON.parse',
        'Prune to 10 projects on every save to stay within 5 MB localStorage limit',
        'Deep-clone loaded data before putting it in React state',
      ],
      generatedAt: now,
    },
    {
      agent: 'Testing Engineer',
      title: 'Testing Strategy & Test Plan',
      content: `## Testing Approach

### Testing Pyramid for ${complexityLevel}

| Level | Coverage Goal | Tools |
|---|---|---|
| Unit (logic & utils) | 80 % | Jest |
| Component | Key user paths | React Testing Library |
| Integration (API) | Happy path + errors | Jest + msw |
| E2E (critical flows) | Signup → Blueprint | Playwright |

## Priority Test Cases

### SoftwareIdeaForm
- [ ] Empty submission shows "Software idea is required" error
- [ ] < 20-character input shows minimum-length error
- [ ] > 2000-character input shows maximum-length error
- [ ] Clicking an example populates the textarea
- [ ] Selecting product type enables the Start Analysis button
- [ ] Selecting complexity updates the radio state correctly

### AgentStatusMonitor
- [ ] All 6 cards render in Waiting state initially
- [ ] Working state shows spinner animation
- [ ] Completed state shows green check icon
- [ ] Failed state shows red ✕ and error message
- [ ] Progress bar reflects number of completed agents

### BlueprintViewer
- [ ] Empty state renders "No blueprint yet" placeholder
- [ ] Each tab click displays the correct agent section
- [ ] Download button triggers file download with correct filename
- [ ] Key-points panel renders when keyPoints.length > 0

### ProjectHistory
- [ ] Empty state renders "No projects yet" message
- [ ] Clicking a project card calls onSelectProject(id)
- [ ] Delete button removes only the selected project
- [ ] Clear All button (after confirmation) empties the list

## Accessibility Test Checklist
- All interactive elements reachable by keyboard (Tab / Enter / Space)
- All images and icon-only buttons have aria-label
- Form fields have associated <label> elements
- Focus ring is visible on all interactive elements
- Colour contrast ≥ 4.5:1 for body text`,
      keyPoints: [
        'Unit test validation logic first — it is the most reusable',
        'E2E test the full Start Analysis → Blueprint workflow',
        'Accessibility tests should run in CI via axe-core',
        '`data-testid` attributes on key elements simplify selector stability',
      ],
      generatedAt: now,
    },
    {
      agent: 'Deployment Planner',
      title: 'Deployment & Infrastructure Plan',
      content: `## Deployment Strategy

### Platform: Vercel (Recommended)

**Why Vercel?**
- Zero-config Next.js deployment
- Automatic preview deployments per PR
- Edge Network CDN included
- Environment variables managed via dashboard

## Deployment Checklist

### Environment Variables
\`\`\`bash
# Required (server-side only)
GEMINI_API_KEY=your_key_here

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

### Vercel Setup
1. Connect GitHub repository to Vercel
2. Set \`GEMINI_API_KEY\` in Project → Settings → Environment Variables
3. Deploy — Vercel auto-detects Next.js and configures the build

### Build Configuration
\`\`\`json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
\`\`\`

## CI/CD Pipeline (GitHub Actions)

\`\`\`yaml
on: [push, pull_request]
jobs:
  quality:
    steps:
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --run
  build:
    needs: quality
    steps:
      - run: npm run build
\`\`\`

## Monitoring & Observability
- **Error tracking**: Vercel's built-in error logs for MVP
- **Performance**: Vercel Speed Insights (free tier)
- **Uptime**: UptimeRobot free tier for < 50 monitors

## Scaling Considerations
- API Routes are serverless — auto-scale with traffic
- Gemini API rate limits: implement exponential back-off before launch
- localStorage is sufficient for MVP; add Supabase if multi-device sync is needed`,
      keyPoints: [
        'Never commit GEMINI_API_KEY to the repository — use environment variables',
        'Enable Vercel preview deployments for every PR',
        'Add rate-limit handling before going public to avoid Gemini quota errors',
        'localStorage-only storage means zero infrastructure cost for the MVP',
      ],
      generatedAt: now,
    },
  ];

  return {
    id,
    softwareIdea,
    productType: productType as Blueprint['productType'],
    complexityLevel: complexityLevel as Blueprint['complexityLevel'],
    createdAt: now,
    updatedAt: now,
    sections,
    metadata: {
      totalProcessingTime: 12000,
      agentCount: 6,
      wordCount: sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0),
    },
  };
}

// ─── Blueprint → Markdown ────────────────────────────────────────────────────

export function blueprintToMarkdown(blueprint: Blueprint): string {
  const lines: string[] = [
    `# DevCrew AI Blueprint`,
    ``,
    `**Project**: ${blueprint.softwareIdea}`,
    `**Type**: ${blueprint.productType}`,
    `**Complexity**: ${blueprint.complexityLevel}`,
    `**Generated**: ${blueprint.createdAt.toISOString()}`,
    ``,
    `---`,
    ``,
  ];

  blueprint.sections.forEach((section, i) => {
    lines.push(`## ${i + 1}. ${section.title}`);
    lines.push(`*Generated by ${section.agent}*`);
    lines.push(``);
    if (section.keyPoints.length > 0) {
      lines.push(`### Key Points`);
      section.keyPoints.forEach((kp) => lines.push(`- ${kp}`));
      lines.push(``);
    }
    lines.push(section.content);
    lines.push(``);
    lines.push(`---`);
    lines.push(``);
  });

  lines.push(`*Blueprint generated by DevCrew AI — ${new Date().toLocaleDateString()}*`);
  return lines.join('\n');
}

// ─── localStorage helpers ────────────────────────────────────────────────────

const STORAGE_KEY = 'devcrew-projects';
const MAX_PROJECTS = 10;

export interface StoredProjectSlim {
  id: string;
  softwareIdea: string;
  productType: string;
  complexityLevel: string;
  createdAt: string;
  blueprint: Blueprint & { createdAt: string; updatedAt: string; sections: Array<BlueprintSection & { generatedAt: string }> };
}

function deserialiseBlueprint(raw: StoredProjectSlim['blueprint']): Blueprint {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    sections: raw.sections.map((s) => ({ ...s, generatedAt: new Date(s.generatedAt) })),
  };
}

export function loadProjectsFromStorage(): Array<{ id: string; softwareIdea: string; productType: string; complexityLevel: string; createdAt: Date; blueprint: Blueprint }> {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredProjectSlim[] = JSON.parse(raw);
    return parsed.map((p) => ({
      id: p.id,
      softwareIdea: p.softwareIdea,
      productType: p.productType,
      complexityLevel: p.complexityLevel,
      createdAt: new Date(p.createdAt),
      blueprint: deserialiseBlueprint(p.blueprint),
    }));
  } catch {
    return [];
  }
}

export function saveProjectToStorage(
  id: string,
  softwareIdea: string,
  productType: string,
  complexityLevel: string,
  blueprint: Blueprint,
): void {
  try {
    if (typeof window === 'undefined') return;
    const existing = loadProjectsFromStorage();
    const filtered = existing.filter((p) => p.id !== id);
    const toSave = [{ id, softwareIdea, productType, complexityLevel, createdAt: new Date().toISOString(), blueprint }, ...filtered].slice(0, MAX_PROJECTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // localStorage quota exceeded — silently skip
  }
}

export function deleteProjectFromStorage(id: string): void {
  try {
    if (typeof window === 'undefined') return;
    const existing = loadProjectsFromStorage();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function clearAllProjectsFromStorage(): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Project summary shape used in ProjectHistory
export function toProjectSummary(p: ReturnType<typeof loadProjectsFromStorage>[number]): ProjectSummary {
  return {
    id: p.id,
    title: p.softwareIdea.slice(0, 60) + (p.softwareIdea.length > 60 ? '…' : ''),
    productType: p.productType as ProjectSummary['productType'],
    complexityLevel: p.complexityLevel as ProjectSummary['complexityLevel'],
    createdAt: p.createdAt,
    preview: p.softwareIdea.slice(0, 150),
    status: 'completed',
  };
}
