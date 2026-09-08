'use client';

import { AgentStatus, AgentStatusType, AGENT_SEQUENCE } from '../types/agent';

interface AgentStatusMonitorProps {
  agents: AgentStatus[];
  className?: string;
}

// ─── Status icon ──────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: AgentStatusType }) {
  if (status === 'Working') {
    return (
      <span
        className="inline-block h-4 w-4 rounded-full border-2 border-[var(--agent-working)]/30 border-t-[var(--agent-working)] animate-spin"
        aria-hidden="true"
      />
    );
  }
  if (status === 'Completed') {
    return (
      <svg aria-hidden="true" className="h-4 w-4 text-[var(--agent-completed)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    );
  }
  if (status === 'Failed') {
    return (
      <svg aria-hidden="true" className="h-4 w-4 text-[var(--agent-failed)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  // Waiting
  return (
    <span className="inline-block h-3 w-3 rounded-full border-2 border-[var(--agent-waiting)] opacity-60" aria-hidden="true" />
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function statusLabel(status: AgentStatusType): string {
  return status;
}

function statusBadgeClass(status: AgentStatusType): string {
  const base = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium';
  switch (status) {
    case 'Waiting': return `${base} bg-amber-50 text-amber-700 border border-amber-200`;
    case 'Working': return `${base} bg-blue-50 text-blue-700 border border-blue-200`;
    case 'Completed': return `${base} bg-emerald-50 text-emerald-700 border border-emerald-200`;
    case 'Failed': return `${base} bg-red-50 text-red-700 border border-red-200`;
  }
}

// ─── Agent role descriptions ──────────────────────────────────────────────────

const AGENT_ROLES: Record<string, string> = {
  'Product Manager': 'Product vision & user stories',
  'Requirements Analyst': 'Functional & non-functional requirements',
  'Software Architect': 'Architecture & tech stack',
  'Database Designer': 'Data models & storage design',
  'Testing Engineer': 'Testing strategy & test plan',
  'Deployment Planner': 'Deployment & infrastructure',
};

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ agents }: { agents: AgentStatus[] }) {
  const completed = agents.filter((a) => a.status === 'Completed').length;
  const total = AGENT_SEQUENCE.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Overall progress</span>
        <span>{completed}/{total} agents completed</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Analysis progress"
        className="w-full h-2 rounded-full bg-border overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AgentStatusMonitor({ agents, className = '' }: AgentStatusMonitorProps) {
  // Merge the provided agent statuses with the full sequence so that all 6
  // cards always render, even when agents array is empty or partial.
  const agentMap = new Map(agents.map((a) => [a.name, a]));
  const allAgents: AgentStatus[] = AGENT_SEQUENCE.map(
    (name) => agentMap.get(name) ?? { name, status: 'Waiting' },
  );

  return (
    <section aria-label="AI agent status" className={`bg-card border border-border rounded-lg p-6 space-y-6 ${className}`}>
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">AI Agent Status</h2>
        <p className="text-sm text-muted-foreground">
          Six specialist agents analyse your idea sequentially, each building on the previous output.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allAgents.map((agent, idx) => (
          <article
            key={agent.name}
            aria-label={`${agent.name}: ${statusLabel(agent.status)}`}
            className={`rounded-lg border-2 p-4 transition-all duration-300 space-y-2
              ${agent.status === 'Working' ? 'border-blue-300 bg-blue-50/50 shadow-sm shadow-blue-100' : ''}
              ${agent.status === 'Completed' ? 'border-emerald-200 bg-emerald-50/40' : ''}
              ${agent.status === 'Failed' ? 'border-red-300 bg-red-50/50' : ''}
              ${agent.status === 'Waiting' ? 'border-border bg-card' : ''}
            `}
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-muted-foreground">#{idx + 1}</span>
                  <span className="text-sm font-semibold text-foreground truncate">{agent.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{AGENT_ROLES[agent.name] ?? ''}</p>
              </div>
              <StatusIcon status={agent.status} />
            </div>

            {/* Badge */}
            <div>
              <span className={statusBadgeClass(agent.status)}>{statusLabel(agent.status)}</span>
            </div>

            {/* Error message */}
            {agent.status === 'Failed' && agent.error && (
              <p className="text-xs text-red-700 bg-red-100 rounded px-2 py-1">{agent.error}</p>
            )}

            {/* Timing */}
            {agent.status === 'Completed' && agent.completionTime && (
              <p className="text-xs text-muted-foreground">
                Done at {new Date(agent.completionTime).toLocaleTimeString()}
              </p>
            )}
          </article>
        ))}
      </div>

      <ProgressBar agents={allAgents} />
    </section>
  );
}
