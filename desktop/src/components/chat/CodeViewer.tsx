import { useMemo, useState } from 'react'
import hljs from 'highlight.js'
import { CopyButton } from '../shared/CopyButton'

type Props = {
  code: string
  language?: string
  maxLines?: number
  showLineNumbers?: boolean
}

export function CodeViewer({ code, language, maxLines = 20, showLineNumbers = true }: Props) {
  const [expanded, setExpanded] = useState(false)

  const lines = code.split('\n')
  const isTruncated = !expanded && lines.length > maxLines
  const visibleCode = isTruncated ? lines.slice(0, maxLines).join('\n') : code

  // Only highlight when language is explicitly known.
  // Do NOT use highlightAuto — it misdetects plain text as code.
  const hasLanguage = !!language && !!hljs.getLanguage(language)
  const effectiveShowLineNumbers = showLineNumbers && hasLanguage

  const highlightedLines = useMemo(() => {
    return visibleCode.split('\n').map((line) => {
      try {
        if (hasLanguage) {
          return hljs.highlight(line || ' ', { language: language!, ignoreIllegals: true }).value
        }
        return escapeHtml(line || ' ')
      } catch {
        return escapeHtml(line)
      }
    })
  }, [hasLanguage, language, visibleCode])

  const startLine = 1

  const languageLabel = language || 'code'

  const visibleLines = visibleCode.split('\n')

  const lineCountLabel = `${lines.length} ${lines.length === 1 ? 'line' : 'lines'}`

  const showExpandToggle = lines.length > maxLines

  return (
    <div className="overflow-hidden rounded-lg border border-[#d0d7de] bg-[#f6f8fa] text-[#24292f]">
      <div className="flex items-center justify-between border-b border-[#d0d7de] bg-white px-3 py-1.5 text-[11px] text-[#57606a]">
        <div className="flex items-center gap-3">
          <span className="font-semibold uppercase tracking-[0.14em] text-[#57606a]">{languageLabel}</span>
          <span>{lineCountLabel}</span>
        </div>
        <CopyButton
          text={code}
          className="rounded-md border border-[#d0d7de] bg-white px-2 py-1 text-[11px] text-[#57606a] transition-colors hover:bg-[#f3f4f6] hover:text-[#24292f]"
        />
      </div>

      <div className="max-h-[420px] overflow-auto">
        <div className="min-w-full font-[var(--font-mono)] text-[12px] leading-[1.3]">
          {visibleLines.map((line, index) => (
            effectiveShowLineNumbers ? (
              <div
                key={`${startLine + index}-${line}`}
                className="grid grid-cols-[3rem,minmax(0,1fr)] gap-0 hover:bg-[#f6f8fa]/50"
              >
                <span className="select-none border-r border-[#eaeef2] bg-[#fafbfc] px-2 py-px text-right text-[11px] text-[#8b949e]">
                  {startLine + index}
                </span>
                <span
                  className="overflow-hidden bg-white px-3 py-px whitespace-pre-wrap break-words text-[#24292f]"
                  dangerouslySetInnerHTML={{ __html: highlightedLines[index] ?? escapeHtml(line) }}
                />
              </div>
            ) : (
              <div
                key={`${startLine + index}-${line}`}
                className="hover:bg-[#f6f8fa]/50"
              >
                <span
                  className="block bg-white px-3 py-px whitespace-pre-wrap break-words text-[#24292f]"
                  dangerouslySetInnerHTML={{ __html: highlightedLines[index] ?? escapeHtml(line) }}
                />
              </div>
            )
          ))}
        </div>
      </div>

      {showExpandToggle && (
        <button
          onClick={() => setExpanded((value) => !value)}
          className="w-full border-t border-[#d0d7de] bg-[#f6f8fa] py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#57606a] transition-colors hover:bg-[#eaeef2] hover:text-[#24292f]"
        >
          {expanded ? 'Collapse' : `Show ${lines.length - maxLines} more lines`}
        </button>
      )}
    </div>
  )
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
