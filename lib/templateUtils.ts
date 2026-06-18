// Email template helpers — renders {{var}} placeholders in a template's subject
// and body against a values map, and extracts the unique variable names a
// template references (used for the email/CRM template tooling).

import type { EmailTemplate } from './data'

export function renderTemplate(
  tmpl: Pick<EmailTemplate, 'subject' | 'bodyHtml'>,
  vars: Record<string, string>
): { subject: string; bodyHtml: string } {
  const replace = (s: string) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, k: string) => vars[k] ?? `{{${k}}}`)
  return { subject: replace(tmpl.subject), bodyHtml: replace(tmpl.bodyHtml) }
}

export function extractTemplateVars(bodyHtml: string): string[] {
  const matches = [...bodyHtml.matchAll(/\{\{(\w+)\}\}/g)]
  return [...new Set(matches.map((m) => m[1]))]
}
