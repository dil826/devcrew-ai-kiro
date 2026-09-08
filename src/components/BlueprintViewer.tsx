'use client';

import React, { useState } from 'react';
import { Blueprint } from '../types/blueprint';
import { blueprintToMarkdown } from '../data/mockData';

interface BlueprintViewerProps {
  blueprint: Blueprint | null;
  onDownload?: () => void;
  className?: string;
}

// ─── Tab configuration ────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'Product Manager', label: 'Requirements' },
  { id: 'Requirements Analyst', label: 'Analysis' },
  { id: 'Software Architect', label: 'Architecture' },
  { id: 'Database Designer', label: 'Database' },
  { id: 'Testing Engineer', label: 'Testing' },
  { id: 'Deployment Planner', label: 'Deployment' },
] as const;

type TabId = typeof TABS[number]['id'];

// ─── Simple Markdown renderer ─────────────────────────────────────────────────
// Handles headings (h1-h3), bold, inline code, code blocks, and lists without
// any external dependency.

function MarkdownBlock({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    // Code block
    if (line.startsWith('```')) {
      const blockLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        blockLines.push(lines[i] ?? '');
        i++;
      }
      elements.push(
        <pre key={key++} className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto my-3 border border-border">
          <code>{blockLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(<h3 key={key++} className="text-base font-bold text-foreground mt-5 mb-2">{renderInline(line.slice(3))}</h3>);
      i++; continue;
    }
    // H3
    if (line.startsWith('### ')) {
      elements.push(<h4 key={key++} className="text-sm font-semibold text-foreground mt-4 mb-1">{renderInline(line.slice(4))}</h4>);
      i++; continue;
    }

    // Table row
    if (line.startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && (lines[i] ?? '').startsWith('|')) {
        const currentLine = lines[i] ?? '';
        if (!currentLine.match(/^\|[-| ]+\|$/)) {
          const parts = currentLine.split('|');
          rows.push(
            parts
              .filter((_cell, ci) => ci > 0 && ci < parts.length - 1)
              .map((c) => c.trim()),
          );
        }
        i++;
      }
      if (rows.length > 0) {
        const headerRow = rows[0] ?? [];
        elements.push(
          <div key={key++} className="overflow-x-auto my-3">
            <table className="w-full text-xs border-collapse border border-border">
              <thead>
                <tr>
                  {headerRow.map((cell, ci) => (
                    <th key={ci} className="border border-border bg-muted px-3 py-2 text-left font-semibold text-foreground">{renderInline(cell)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, ri) => (
                  <tr key={ri} className="even:bg-muted/30">
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-border px-3 py-2 text-muted-foreground">{renderInline(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && (lines[i] ?? '').match(/^[-*] /)) {
        const currentLine = lines[i] ?? '';
        items.push(<li key={i} className="text-sm text-muted-foreground">{renderInline(currentLine.slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={key++} className="list-disc list-inside space-y-1 my-2 pl-1">{items}</ul>);
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && (lines[i] ?? '').match(/^\d+\. /)) {
        const currentLine = lines[i] ?? '';
        items.push(<li key={i} className="text-sm text-muted-foreground">{renderInline(currentLine.replace(/^\d+\. /, ''))}</li>);
        i++;
      }
      elements.push(<ol key={key++} className="list-decimal list-inside space-y-1 my-2 pl-1">{items}</ol>);
      continue;
    }

    // Horizontal rule
    if (line === '---') {
      elements.push(<hr key={key++} className="border-border my-4" />);
      i++; continue;
    }

    // Empty line → spacer
    if (line.trim() === '') {
      i++; continue;
    }

    // Paragraph
    elements.push(
      <p key={key++} className="text-sm text-muted-foreground leading-relaxed my-1.5">{renderInline(line)}</p>
    );
    i++;
  }

  return <div className="space-y-1">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Split on **bold**, *italic*, and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="font-mono text-xs bg-muted px-1 py-0.5 rounded border border-border text-foreground">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4" aria-hidden="true">
        <svg className="h-7 w-7 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">No blueprint yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Fill in your software idea and click <strong>Start Analysis</strong> to generate your development blueprint.
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlueprintViewer({ blueprint, onDownload, className = '' }: BlueprintViewerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!blueprint) {
    return (
      <div className={`bg-card border border-border rounded-lg ${className}`}>
        <EmptyState />
      </div>
    );
  }

  const handleDownload = () => {
    const md = blueprintToMarkdown(blueprint);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devcrew-blueprint-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  const activeSection = blueprint.sections.find((s) => s.agent === activeTab);

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">Development Blueprint</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {blueprint.productType} · {blueprint.complexityLevel} ·{' '}
            {blueprint.createdAt.toLocaleDateString()}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground
            hover:bg-primary/90 active:scale-[0.97] transition-all
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          aria-label="Download blueprint as Markdown"
        >
          <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Download
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="overflow-x-auto border-b border-border">
        <div role="tablist" aria-label="Blueprint sections" className="flex min-w-max">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`tab-panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset
                  ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div id={`tab-panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="p-6">
        {activeTab === 'overview' ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Project Idea</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{blueprint.softwareIdea}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Product Type', value: blueprint.productType },
                { label: 'Complexity', value: blueprint.complexityLevel },
                { label: 'Sections', value: `${blueprint.sections.length} agents` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/50 border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Blueprint Sections</h3>
              <div className="space-y-2">
                {blueprint.sections.map((section, idx) => (
                  <button
                    key={section.agent}
                    type="button"
                    onClick={() => setActiveTab(section.agent as TabId)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left
                      hover:bg-accent hover:border-primary/30 transition-colors
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-5">{idx + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{section.title}</p>
                        <p className="text-xs text-muted-foreground">{section.agent}</p>
                      </div>
                    </div>
                    <svg aria-hidden="true" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : activeSection ? (
          <div className="space-y-5">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">{activeSection.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Analysis by {activeSection.agent}</p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                <svg aria-hidden="true" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Complete
              </span>
            </div>

            {/* Key points */}
            {activeSection.keyPoints.length > 0 && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Key Recommendations</p>
                <ul className="space-y-1.5">
                  {activeSection.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                      {kp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content */}
            <MarkdownBlock content={activeSection.content} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No content available for this section.</p>
        )}
      </div>
    </div>
  );
}
