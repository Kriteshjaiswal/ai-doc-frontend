import React, { useState } from 'react';
import { FiFileText, FiCopy, FiCheck } from 'react-icons/fi';

/**
 * Prettifies raw JSON keys (e.g. key_objectives -> 🎯 Key Objectives)
 */
function prettifyKey(key) {
  if (!key) return '';
  const clean = key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .trim();

  let emoji = '📌';
  if (clean.includes('title') || clean.includes('heading')) emoji = '📄';
  else if (clean.includes('objective') || clean.includes('goal')) emoji = '🎯';
  else if (clean.includes('finding') || clean.includes('highlight') || clean.includes('insight')) emoji = '💡';
  else if (clean.includes('risk') || clean.includes('liability') || clean.includes('warning')) emoji = '⚠️';
  else if (clean.includes('recommend') || clean.includes('action') || clean.includes('next step')) emoji = '🚀';
  else if (clean.includes('summary') || clean.includes('overview')) emoji = '📋';
  else if (clean.includes('date') || clean.includes('timeline') || clean.includes('deadline')) emoji = '📅';
  else if (clean.includes('metric') || clean.includes('figure') || clean.includes('financial') || clean.includes('data')) emoji = '📊';
  else if (clean.includes('question') || clean.includes('faq')) emoji = '❓';
  else if (clean.includes('answer') || clean.includes('solution')) emoji = '✅';

  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  return `${emoji} ${capitalized}`;
}

/**
 * Recursively converts a JSON object/array into clean, readable Markdown
 */
function convertJsonNodeToMarkdown(data, depth = 0) {
  if (data === null || data === undefined) return '';

  if (typeof data === 'string') return data;
  if (typeof data === 'number' || typeof data === 'boolean') return String(data);

  if (Array.isArray(data)) {
    if (data.length === 0) return '';

    // Array of strings/numbers
    if (data.every((item) => typeof item !== 'object' || item === null)) {
      return data
        .map((item) => {
          const str = String(item || '').trim();
          const colonIdx = str.indexOf(':');
          if (colonIdx > 2 && colonIdx < 50) {
            const head = str.substring(0, colonIdx).trim();
            const body = str.substring(colonIdx + 1).trim();
            return `- **${head}:** ${body}`;
          }
          return `- ${str}`;
        })
        .join('\n');
    }

    // Array of objects
    return data
      .map((item, idx) => {
        if (typeof item === 'object' && item !== null) {
          if (item.question && item.answer) {
            return `### 📇 Flashcard ${idx + 1}\n**Q:** ${item.question}\n\n**A:** ${item.answer}\n`;
          }
          if (item.title || item.name || item.task) {
            const header = item.title || item.name || item.task;
            const restKeys = Object.keys(item).filter((k) => !['title', 'name', 'task'].includes(k));
            const subLines = restKeys
              .map((k) => `  - **${prettifyKey(k).replace(/^[^a-zA-Z0-9]+/, '')}:** ${String(item[k])}`)
              .join('\n');
            return `- **${header}**\n${subLines}`;
          }
          const pairs = Object.entries(item)
            .map(([k, v]) => `  - **${prettifyKey(k).replace(/^[^a-zA-Z0-9]+/, '')}:** ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
            .join('\n');
          return `**Item ${idx + 1}:**\n${pairs}`;
        }
        return `- ${String(item)}`;
      })
      .join('\n\n');
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return '';

    const lines = [];
    if (data.title) {
      lines.push(`## ${data.title}\n`);
    }

    for (const key of keys) {
      if (key === 'title') continue;

      const val = data[key];
      if (val === null || val === undefined || val === '') continue;

      const headerTitle = prettifyKey(key);
      const headingPrefix = depth === 0 ? '###' : '####';

      if (typeof val === 'string') {
        lines.push(`${headingPrefix} ${headerTitle}\n${val}\n`);
      } else if (Array.isArray(val)) {
        lines.push(`${headingPrefix} ${headerTitle}\n${convertJsonNodeToMarkdown(val, depth + 1)}\n`);
      } else if (typeof val === 'object') {
        lines.push(`${headingPrefix} ${headerTitle}\n${convertJsonNodeToMarkdown(val, depth + 1)}\n`);
      } else {
        lines.push(`- **${headerTitle}:** ${String(val)}`);
      }
    }

    return lines.join('\n');
  }

  return String(data);
}

/**
 * Checks if raw text is valid JSON and automatically converts it to formatted Markdown
 */
export function formatJsonToMarkdown(text) {
  if (!text) return '';
  if (typeof text === 'object') {
    return convertJsonNodeToMarkdown(text);
  }

  const trimmed = String(text).trim();

  let unquoted = trimmed;
  if (unquoted.startsWith('```json')) unquoted = unquoted.substring(7);
  else if (unquoted.startsWith('```')) unquoted = unquoted.substring(3);
  if (unquoted.endsWith('```')) unquoted = unquoted.substring(0, unquoted.length - 3);
  unquoted = unquoted.trim();

  if ((unquoted.startsWith('{') && unquoted.endsWith('}')) || (unquoted.startsWith('[') && unquoted.endsWith(']'))) {
    try {
      const parsed = JSON.parse(unquoted);
      return convertJsonNodeToMarkdown(parsed);
    } catch {
      return text;
    }
  }

  return text;
}

/**
 * Dedicated Code Block with Language Badge & Copy to Clipboard
 */
export function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3.5 rounded-2xl overflow-hidden border border-slate-700/80 bg-[#0B0F19] text-slate-200 text-xs shadow-xl font-mono">
      <div className="flex items-center justify-between px-4 py-2 bg-[#141B2D] border-b border-slate-700/60 text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="uppercase font-bold tracking-wider text-indigo-400 ml-1.5">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer text-[11px] font-semibold"
          title="Copy to clipboard"
        >
          {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed text-slate-200 selection:bg-indigo-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content, onSelectPage }) {
  if (!content) return null;

  // Pre-process multiline code blocks first
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const sections = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      sections.push({ type: 'markdown', text: content.slice(lastIndex, match.index) });
    }
    sections.push({ type: 'code', language: match[1], code: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    sections.push({ type: 'markdown', text: content.slice(lastIndex) });
  }

  return (
    <div className="space-y-3 leading-relaxed text-slate-800 dark:text-slate-200">
      {sections.map((section, sIdx) => {
        if (section.type === 'code') {
          return <CodeBlock key={`code-${sIdx}`} language={section.language} code={section.code} />;
        }
        return <MarkdownTextSection key={`md-${sIdx}`} content={section.text} onSelectPage={onSelectPage} />;
      })}
    </div>
  );
}

function MarkdownTextSection({ content, onSelectPage }) {
  const normalizedContent = formatJsonToMarkdown(content);
  const lines = normalizedContent.split('\n');
  const elements = [];
  let currentList = [];
  let currentListType = null;
  let inTable = false;
  let tableRows = [];
  let currentBlockquote = [];

  const flushList = () => {
    if (currentList.length > 0) {
      if (currentListType === 'ol') {
        elements.push(
          <div key={`ol-${elements.length}`} className="space-y-2.5 my-3">
            {currentList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-[#141B2D]/70 border border-slate-200/60 dark:border-[#1E293B]"
              >
                <span className="w-6 h-6 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 border border-indigo-200/40 dark:border-indigo-900/40">
                  {idx + 1}
                </span>
                <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed min-w-0 flex-1 pt-0.5">
                  {renderInlineFormatting(item, onSelectPage)}
                </div>
              </div>
            ))}
          </div>
        );
      } else {
        elements.push(
          <div key={`ul-${elements.length}`} className="space-y-2 my-3">
            {currentList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50/60 dark:hover:bg-[#141B2D]/50 transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed min-w-0 flex-1">
                  {renderInlineFormatting(item, onSelectPage)}
                </div>
              </div>
            ))}
          </div>
        );
      }
      currentList = [];
      currentListType = null;
    }
  };

  const flushBlockquote = () => {
    if (currentBlockquote.length > 0) {
      elements.push(
        <div
          key={`bq-${elements.length}`}
          className="my-3 p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border-l-4 border-indigo-500 text-slate-700 dark:text-slate-300 text-xs sm:text-[13px] italic leading-relaxed"
        >
          {currentBlockquote.map((qLine, qi) => (
            <p key={qi} className="my-0.5">
              {renderInlineFormatting(qLine, onSelectPage)}
            </p>
          ))}
        </div>
      );
      currentBlockquote = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(1).filter((r) => !r.every((c) => c.match(/^[-:]+$/)));

      elements.push(
        <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-[#1E293B] shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-[#141B2D] border-b border-slate-200/80 dark:border-[#1E293B]">
                {headerRow.map((col, i) => (
                  <th key={i} className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                    {renderInlineFormatting(col, onSelectPage)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]">
              {dataRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50/50 dark:hover:bg-[#141B2D]/40 transition-colors">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-slate-600 dark:text-slate-300 font-medium">
                      {renderInlineFormatting(cell, onSelectPage)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      flushTable();
      flushBlockquote();
      continue;
    }

    if (line === '---' || line === '***' || line === '___') {
      flushList();
      flushTable();
      flushBlockquote();
      elements.push(
        <div key={`hr-${i}`} className="my-4 border-t border-slate-200/80 dark:border-[#1E293B]" />
      );
      continue;
    }

    if (line.startsWith('>')) {
      flushList();
      flushTable();
      const quoteText = line.replace(/^>\s*/, '');
      currentBlockquote.push(quoteText);
      continue;
    } else {
      flushBlockquote();
    }

    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      inTable = true;
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headerMatch) {
      flushList();
      flushTable();
      const level = headerMatch[1].length;
      const title = headerMatch[2];

      elements.push(
        <div key={`header-${i}`} className="pt-3 pb-1 first:pt-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" />
            <h4
              className={`font-extrabold text-slate-900 dark:text-white tracking-tight ${
                level <= 2 ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
              }`}
            >
              {renderInlineFormatting(title, onSelectPage)}
            </h4>
          </div>
        </div>
      );
      continue;
    }

    const olMatch = line.match(/^(\d+)[\.\)]\s+(.+)$/);
    if (olMatch) {
      if (currentListType && currentListType !== 'ol') flushList();
      currentListType = 'ol';
      currentList.push(olMatch[2]);
      continue;
    }

    const ulMatch = line.match(/^[-*•]\s+(.+)$/);
    if (ulMatch) {
      if (currentListType && currentListType !== 'ul') flushList();
      currentListType = 'ul';
      currentList.push(ulMatch[1]);
      continue;
    }

    flushList();
    flushTable();

    elements.push(
      <p
        key={`p-${i}`}
        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
      >
        {renderInlineFormatting(line, onSelectPage)}
      </p>
    );
  }

  flushList();
  flushTable();
  flushBlockquote();

  return <div className="space-y-2.5">{elements}</div>;
}

/**
 * Robust inline formatter for Markdown tokens and page citations
 */
function renderInlineFormatting(text, onSelectPage) {
  if (!text) return null;

  const tokenRegex = /(`?\[?📄?\s*(?:Pages?|p\.)\s*\d+(?:\s*[-–,]\s*\d+)*\]?`?|\*\*.*?\*\*|`.*?`|\*.*?\*)/gi;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    const citationMatch = part.match(/(?:Pages?|p\.)\s*(\d+)(?:\s*[-–]\s*(\d+))?/i);
    if (citationMatch && (part.toLowerCase().includes('page') || part.toLowerCase().includes('p.'))) {
      const startPage = parseInt(citationMatch[1], 10);
      const endPage = citationMatch[2] ? parseInt(citationMatch[2], 10) : null;
      const label = endPage ? `Pages ${startPage}–${endPage}` : `Page ${startPage}`;

      return (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPage?.(startPage)}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 my-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[11px] border border-indigo-200/60 dark:border-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer select-none"
          title={`Click to view ${label} in Document Preview`}
        >
          <FiFileText className="text-[10px]" />
          <span>{label}</span>
        </button>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-slate-900 dark:text-white">
          {inner}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const code = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#141B2D] text-indigo-600 dark:text-indigo-400 font-mono text-[11px] border border-slate-200/70 dark:border-[#1E293B]"
        >
          {code}
        </code>
      );
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2 && !part.startsWith('**')) {
      const inner = part.slice(1, -1);
      return (
        <em key={idx} className="italic text-slate-700 dark:text-slate-300">
          {inner}
        </em>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}
