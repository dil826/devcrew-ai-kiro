'use client';

import React, { useId } from 'react';
import { PRODUCT_TYPES, EXAMPLE_SOFTWARE_IDEAS, MAX_SOFTWARE_IDEA_LENGTH } from '../types/constants';
import { ProductType, ComplexityLevel } from '../types/common';
import { AnalysisRequest } from '../types/api';

// ─── Validation ──────────────────────────────────────────────────────────────

const MIN_IDEA_LENGTH = 20;

function validateIdea(idea: string): string {
  if (!idea.trim()) return 'Please describe your software idea.';
  if (idea.trim().length < MIN_IDEA_LENGTH) return `Please provide at least ${MIN_IDEA_LENGTH} characters.`;
  if (idea.length > MAX_SOFTWARE_IDEA_LENGTH) return `Must be under ${MAX_SOFTWARE_IDEA_LENGTH} characters.`;
  return '';
}

function validateProductType(pt: string): string {
  if (!pt) return 'Please select a product type.';
  return '';
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface SoftwareIdeaFormProps {
  onSubmit: (data: AnalysisRequest) => Promise<void>;
  isLoading: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SoftwareIdeaForm({ onSubmit, isLoading }: SoftwareIdeaFormProps) {
  const formId = useId();
  const ideaId = `${formId}-idea`;
  const productTypeId = `${formId}-productType`;

  const [idea, setIdea] = React.useState('');
  const [productType, setProductType] = React.useState<ProductType | ''>('');
  const [complexity, setComplexity] = React.useState<ComplexityLevel>('MVP');
  const [submitted, setSubmitted] = React.useState(false);

  const ideaError = submitted ? validateIdea(idea) : '';
  const productTypeError = submitted ? validateProductType(productType) : '';
  const isValid = !validateIdea(idea) && !validateProductType(productType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isValid) return;
    await onSubmit({ softwareIdea: idea.trim(), productType: productType as ProductType, complexityLevel: complexity });
  };

  const useExample = (example: string) => {
    setIdea(example);
    if (submitted) {
      // Re-validate
      setSubmitted(true);
    }
  };

  const charCount = idea.length;
  const WARNING_THRESHOLD = 2700;
  const isNearLimit = charCount >= WARNING_THRESHOLD;
  const isAtLimit = charCount >= MAX_SOFTWARE_IDEA_LENGTH;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Software idea analysis form"
      className="bg-card border border-border rounded-lg p-6 space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Describe Your Software Idea</h2>
        <p className="text-sm text-muted-foreground">
          Our six AI specialists will analyse your idea and build a comprehensive development blueprint.
        </p>
      </div>

      {/* ── Textarea ── */}
      <div className="space-y-1">
        <label htmlFor={ideaId} className="block text-sm font-medium text-foreground">
          Software Idea <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <textarea
          id={ideaId}
          rows={8}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. A task management app for small teams with real-time collaboration, file attachments, and deadline tracking…"
          maxLength={MAX_SOFTWARE_IDEA_LENGTH}
          aria-required="true"
          aria-invalid={!!ideaError}
          aria-describedby={`${ideaId}-counter${ideaError ? ` ${ideaId}-error` : ` ${ideaId}-hint`}`}
          className={`w-full rounded-md border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
            ${ideaError ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
        />
        <div className="flex justify-between items-start gap-2">
          <div>
            {ideaError
              ? <p id={`${ideaId}-error`} role="alert" className="text-xs text-destructive font-medium">{ideaError}</p>
              : <p id={`${ideaId}-hint`} className="text-xs text-muted-foreground">Min {MIN_IDEA_LENGTH} chars required</p>
            }
          </div>
          <span
            id={`${ideaId}-counter`}
            aria-live="polite"
            aria-atomic="true"
            className={`text-xs flex-shrink-0 tabular-nums ${
              isAtLimit
                ? 'text-destructive font-semibold'
                : isNearLimit
                ? 'text-amber-600 font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {charCount.toLocaleString()} / {MAX_SOFTWARE_IDEA_LENGTH.toLocaleString()} characters
          </span>
        </div>
      </div>

      {/* ── Example ideas ── */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Example ideas</p>
        <ul className="space-y-1" role="list">
          {(EXAMPLE_SOFTWARE_IDEAS as readonly string[]).map((ex, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => useExample(ex)}
                disabled={isLoading}
                className="text-left text-sm text-primary hover:text-primary/80 hover:underline
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded
                  disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed w-full"
              >
                "{ex}"
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Product type ── */}
      <div className="space-y-1">
        <label htmlFor={productTypeId} className="block text-sm font-medium text-foreground">
          Product Type <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <select
          id={productTypeId}
          value={productType}
          onChange={(e) => setProductType(e.target.value as ProductType | '')}
          disabled={isLoading}
          aria-required="true"
          aria-invalid={!!productTypeError}
          aria-describedby={productTypeError ? `${productTypeId}-error` : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm bg-background text-foreground
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
            ${productTypeError ? 'border-destructive' : 'border-input'}`}
        >
          <option value="">Select a product type…</option>
          {PRODUCT_TYPES.map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>
        {productTypeError && (
          <p id={`${productTypeId}-error`} role="alert" className="text-xs text-destructive font-medium">{productTypeError}</p>
        )}
      </div>

      {/* ── Complexity level ── */}
      <fieldset>
        <legend className="text-sm font-medium text-foreground mb-2">
          Complexity Level <span aria-hidden="true" className="text-destructive">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {(['Prototype', 'MVP'] as ComplexityLevel[]).map((level) => {
            const description = level === 'Prototype'
              ? 'Basic concept to validate the idea quickly'
              : 'Market-ready features for real users';
            return (
              <label
                key={level}
                className={`relative flex flex-col gap-1 cursor-pointer rounded-lg border-2 p-3 transition-colors
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  ${complexity === level
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent'
                  }`}
              >
                <input
                  type="radio"
                  name="complexity"
                  value={level}
                  checked={complexity === level}
                  onChange={() => setComplexity(level)}
                  disabled={isLoading}
                  className="sr-only"
                  aria-describedby={`complexity-${level}-desc`}
                />
                <span className="text-sm font-semibold text-foreground">{level}</span>
                <span id={`complexity-${level}-desc`} className="text-xs leading-snug">{description}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isLoading}
        aria-disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold
          transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1
          ${isLoading
            ? 'bg-primary/60 text-primary-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]'
          }`}
      >
        {isLoading ? (
          <>
            <span
              className="inline-block h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"
              aria-hidden="true"
            />
            Analysing…
          </>
        ) : (
          'Start Analysis'
        )}
      </button>
    </form>
  );
}
