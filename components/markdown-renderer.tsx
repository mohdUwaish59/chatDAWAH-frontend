import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-primary mt-6 mb-4 pb-2 border-b-2 border-primary/20">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-primary mt-5 mb-3 pb-2 border-b border-primary/20">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-primary mt-4 mb-2">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold text-primary mt-3 mb-2">
            {children}
          </h4>
        ),
        
        // Paragraphs
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed text-foreground">
            {children}
          </p>
        ),
        
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 ml-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 ml-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-foreground leading-relaxed">
            {children}
          </li>
        ),
        
        // Code blocks
        code: ({ className, children }) => {
          const isInline = !className
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-sm border border-primary/20">
                {children}
              </code>
            )
          }
          return (
            <code className="block p-4 rounded-lg bg-muted/50 text-foreground font-mono text-sm overflow-x-auto border border-primary/20 my-3">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="mb-4 overflow-x-auto">
            {children}
          </pre>
        ),
        
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-accent pl-4 py-2 my-4 bg-accent/5 italic text-muted-foreground rounded-r">
            {children}
          </blockquote>
        ),
        
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent underline decoration-primary/30 hover:decoration-accent transition-colors font-medium"
          >
            {children}
          </a>
        ),
        
        // Strong/Bold
        strong: ({ children }) => (
          <strong className="font-bold text-primary">
            {children}
          </strong>
        ),
        
        // Emphasis/Italic
        em: ({ children }) => (
          <em className="italic text-foreground">
            {children}
          </em>
        ),
        
        // Horizontal Rule
        hr: () => (
          <hr className="my-6 border-t-2 border-primary/20" />
        ),
        
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-2 border-primary/20 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-primary/10">
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-primary/10">
            {children}
          </tbody>
        ),
        tr: ({ children }) => (
          <tr className="hover:bg-primary/5 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left font-semibold text-primary border border-primary/20">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-foreground border border-primary/10">
            {children}
          </td>
        ),
        
        // Strikethrough
        del: ({ children }) => (
          <del className="line-through text-muted-foreground">
            {children}
          </del>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
