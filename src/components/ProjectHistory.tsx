'use client';

import React from 'react';
import { ProjectSummary } from '../types/blueprint';

interface ProjectHistoryProps {
  projects: ProjectSummary[];
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onClearHistory: () => void;
  className?: string;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3" aria-hidden="true">
        <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground mb-1">No saved projects yet</p>
      <p className="text-xs text-muted-foreground max-w-[18rem]">
        Completed blueprints are saved here automatically so you can revisit them later.
      </p>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function ComplexityBadge({ level }: { level: string }) {
  const cls = level === 'MVP'
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : 'bg-amber-100 text-amber-700 border-amber-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-medium ${cls}`}>
      {level}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProjectHistory({
  projects,
  onSelectProject,
  onDeleteProject,
  onClearHistory,
  className = '',
}: ProjectHistoryProps) {
  const [confirmClear, setConfirmClear] = React.useState(false);

  const handleClearRequest = () => setConfirmClear(true);
  const handleClearConfirm = () => { onClearHistory(); setConfirmClear(false); };
  const handleClearCancel = () => setConfirmClear(false);

  return (
    <section aria-label="Project history" className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <svg aria-hidden="true" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-sm font-semibold text-foreground">
            Project History
          </h2>
          {projects.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-muted border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
              {projects.length}
            </span>
          )}
        </div>

        {projects.length > 0 && (
          confirmClear ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Clear all?</span>
              <button
                type="button"
                onClick={handleClearConfirm}
                className="text-xs font-medium text-destructive hover:text-destructive/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={handleClearCancel}
                className="text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClearRequest}
              aria-label="Clear all project history"
              className="text-xs text-muted-foreground hover:text-destructive transition-colors
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              Clear all
            </button>
          )
        )}
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyHistory />
      ) : (
        <ul role="list" className="divide-y divide-border">
          {projects.map((project) => (
            <li key={project.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelectProject(project.id)}
                aria-label={`Open project: ${project.title}`}
                className="w-full text-left px-5 py-4 hover:bg-accent transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Title row */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{project.title}</span>
                      <ComplexityBadge level={project.complexityLevel} />
                    </div>
                    {/* Preview */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-1.5">{project.preview}</p>
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{project.productType}</span>
                      <span>·</span>
                      <span>{project.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <svg aria-hidden="true" className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
              {/* Delete button — absolutely positioned so it doesn't break the list-item button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                aria-label={`Delete project: ${project.title}`}
                className="absolute top-3 right-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100
                  p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10
                  transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
