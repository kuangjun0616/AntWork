/**
 * Markdown 渲染组件
 * 使用 react-markdown 渲染 Markdown 内容
 * 注意：已禁用 rehypeRaw 以防止 XSS 攻击
 */

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import type { HTMLAttributes } from 'react';

/**
 * 验证 URL 是否安全
 * 只允许 http、https 协议
 */
function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

interface ComponentProps extends HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export default function MDContent({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <h1 className="mt-4 text-xl font-semibold text-ink-900" {...props} />
        ),
        h2: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <h2 className="mt-4 text-lg font-semibold text-ink-900" {...props} />
        ),
        h3: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <h3 className="mt-3 text-base font-semibold text-ink-800" {...props} />
        ),
        p: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <p className="mt-2 text-base leading-relaxed text-ink-700" {...props} />
        ),
        ul: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <ul className="mt-2 ml-4 grid list-disc gap-1" {...props} />
        ),
        ol: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <ol className="mt-2 ml-4 grid list-decimal gap-1" {...props} />
        ),
        li: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <li className="min-w-0 text-ink-700" {...props} />
        ),
        strong: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <strong className="text-ink-900 font-semibold" {...props} />
        ),
        em: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <em className="text-ink-800" {...props} />
        ),
        pre: ({ className, ...props }: Omit<ComponentProps, 'ref'>) => (
          <pre
            className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap rounded-xl bg-surface-tertiary p-3 text-sm text-ink-700"
            {...props}
          />
        ),
        code: ({ className, children, ...rest }: Omit<ComponentProps & { children?: React.ReactNode }, 'ref'>) => {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !match && !String(children).includes("\n");

          return isInline ? (
            <code className="rounded bg-surface-tertiary px-1.5 py-0.5 text-accent font-mono text-base" {...rest}>
              {children}
            </code>
          ) : (
            <code className={`${className || ''} font-mono`} {...rest}>
              {children}
            </code>
          );
        },
        a: ({ className, href, children, ...props }: any) => {
          // 验证 URL 是否安全，阻止 javascript:、data: 等危险协议
          const safeHref = href && isValidUrl(href) ? href : undefined;
          return (
            <a
              className="text-accent hover:text-accent-hover underline"
              target="_blank"
              rel="noopener noreferrer"
              href={safeHref}
              {...props}
            >
              {children}
            </a>
          );
        },
        img: ({ className, src, alt, ...props }: any) => {
          // 验证图片源 URL 是否安全
          const safeSrc = src && isValidUrl(src) ? src : undefined;
          return (
            <img
              className="rounded-lg max-w-full h-auto my-2"
              src={safeSrc}
              alt={alt}
              {...props}
            />
          );
        },
      }}
    >
      {String(text ?? "")}
    </ReactMarkdown>
  );
}
