'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SoftwareIdeaForm from '../src/components/SoftwareIdeaForm';
import AgentStatusMonitor from '../src/components/AgentStatusMonitor';
import BlueprintViewer from '../src/components/BlueprintViewer';
import ProjectHistory from '../src/components/ProjectHistory';
import { AgentStatus } from '../src/types/agent';
import { Blueprint } from '../src/types/blueprint';
import { ProjectSummary } from '../src/types/blueprint';
import { AnalysisRequest } from '../src/types/api';
import {
  AGENT_NAMES,
  createInitialAgents,
  generateDemoBlueprint,
  loadProjectsFromStorage,
  saveProjectToStorage,
  deleteProjectFromStorage,
  clearAllProjectsFromStorage,
  toProjectSummary,
} from '../src/data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnalysisState = 'idle' | 'running' | 'done' | 'failed';

// ─── Simulation helpers ───────────────────────────────────────────────────────

const AGENT_DELAY_MS = 900; // delay between each agent completing

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function Home() {
  // Form / analysis state
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [agents, setAgents] = useState<AgentStatus[]>(createInitialAgents());
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const abortRef = React.useRef(false);

  // History state
  const [history, setHistory] = useState<ProjectSummary[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = loadProjectsFromStorage();
    setHistory(stored.map(toProjectSummary));
  }, []);

  // ── Run the demo analysis workflow ──────────────────────────────────────────
  const runAnalysis = useCallback(async (request: AnalysisRequest) => {
    abortRef.current = false;
    setAnalysisState('running');
    setBlueprint(null);

    // Initialise all agents to Waiting
    setAgents(createInitialAgents());

    for (let i = 0; i < AGENT_NAMES.length; i++) {
      if (abortRef.current) break;

      const agentName = AGENT_NAMES[i];

      // Set current agent to Working
      setAgents((prev) =>
        prev.map((a) =>
          a.name === agentName
            ? { ...a, status: 'Working', startTime: new Date() }
            : a,
        ),
      );

      await sleep(AGENT_DELAY_MS);
      if (abortRef.current) break;

      // Set current agent to Completed
      setAgents((prev) =>
        prev.map((a) =>
          a.name === agentName
            ? { ...a, status: 'Completed', completionTime: new Date() }
            : a,
        ),
      );
    }

    if (abortRef.current) {
      setAnalysisState('idle');
      return;
    }

    // Generate demo blueprint
    const bp = generateDemoBlueprint(
      request.softwareIdea,
      request.productType,
      request.complexityLevel,
    );

    setBlueprint(bp);
    setAnalysisState('done');

    // Persist to localStorage
    saveProjectToStorage(
      bp.id,
      request.softwareIdea,
      request.productType,
      request.complexityLevel,
      bp,
    );

    // Refresh history list
    setHistory(loadProjectsFromStorage().map(toProjectSummary));
  }, []);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => {
    abortRef.current = true;
    setAnalysisState('idle');
    setAgents(createInitialAgents());
    setBlueprint(null);
  };

  // ── Load a project from history ────────────────────────────────────────────
  const handleSelectProject = useCallback((id: string) => {
    const stored = loadProjectsFromStorage();
    const found = stored.find((p) => p.id === id);
    if (!found) return;

    // Restore full agent completed status
    const completedAgents: AgentStatus[] = AGENT_NAMES.map((name) => ({
      name,
      status: 'Completed' as const,
      completionTime: found.createdAt,
    }));

    setAgents(completedAgents);
    setBlueprint(found.blueprint);
    setAnalysisState('done');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Delete a project ───────────────────────────────────────────────────────
  const handleDeleteProject = useCallback((id: string) => {
    deleteProjectFromStorage(id);
    setHistory(loadProjectsFromStorage().map(toProjectSummary));
    // If currently viewing the deleted project, clear the view
    if (blueprint && blueprint.id === id) {
      handleReset();
    }
  }, [blueprint]);

  // ── Clear all history ──────────────────────────────────────────────────────
  const handleClearHistory = useCallback(() => {
    clearAllProjectsFromStorage();
    setHistory([]);
  }, []);

  const isRunning = analysisState === 'running';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <span className="text-base font-bold text-foreground">DevCrew AI</span>
                <span className="hidden sm:inline text-xs text-muted-foreground ml-2">Multi-Agent Software Planning</span>
              </div>
            </div>

            {/* Header actions */}
            {analysisState !== 'idle' && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground
                  hover:bg-accent hover:text-foreground transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Reset and start a new project"
              >
                <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                New Project
              </button>
            )}
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Hero ── */}
        <div className="text-center space-y-3 py-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Transform Ideas into Development Blueprints
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Our six AI specialists analyse your software idea and generate a comprehensive plan covering
            product vision, requirements, architecture, database design, testing, and deployment.
          </p>
        </div>

        {/* ── Feature pills ── */}
        <div className="flex flex-wrap justify-center gap-2" aria-label="Key features">
          {[
            { emoji: '🤖', label: '6 AI Agents' },
            { emoji: '⚡', label: 'Real-time Progress' },
            { emoji: '📋', label: 'Full Blueprint' },
            { emoji: '⬇️', label: 'Markdown Export' },
          ].map(({ emoji, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
              <span aria-hidden="true">{emoji}</span>
              {label}
            </span>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <SoftwareIdeaForm
              onSubmit={runAnalysis}
              isLoading={isRunning}
            />
            <ProjectHistory
              projects={history}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onClearHistory={handleClearHistory}
            />
          </div>

          {/* Right column */}
          <AgentStatusMonitor agents={agents} />
        </div>

        {/* ── Blueprint results ── */}
        <BlueprintViewer blueprint={blueprint} />

        {/* ── Status banner ── */}
        {analysisState === 'done' && blueprint && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-3"
          >
            <div className="flex items-center gap-2 text-emerald-800 text-sm font-medium">
              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Blueprint generated and saved to history!
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline underline-offset-2
                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
            >
              Start new project
            </button>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-16 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center space-y-1">
          <p className="text-sm font-medium text-foreground">DevCrew AI — Multi-Agent Software Planning Platform</p>
          <p className="text-xs text-muted-foreground">
            Powered by six AI specialists — Product Manager · Requirements Analyst · Software Architect ·
            Database Designer · Testing Engineer · Deployment Planner
          </p>
        </div>
      </footer>
    </div>
  );
}
