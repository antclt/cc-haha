import hljs from 'highlight.js'

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function highlightCodeLines(code: string, language?: string): string[] {
  return code.split('\n').map((line) => highlightCodeLine(line, language))
}

/** Returns true if the language is known to hljs and should be highlighted */
export function isHighlightable(language?: string): boolean {
  return !!language && !!hljs.getLanguage(language)
}

function highlightCodeLine(line: string, language?: string): string {
  const safeLine = line.length > 0 ? line : ' '

  try {
    // Only highlight when language is explicitly specified and known.
    // Do NOT use highlightAuto — it misdetects plain text (file trees,
    // command output, etc.) as code and applies wrong colors.
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(safeLine, { language, ignoreIllegals: true }).value
    }
    return escapeHtml(safeLine)
  } catch {
    return escapeHtml(safeLine)
  }
}
