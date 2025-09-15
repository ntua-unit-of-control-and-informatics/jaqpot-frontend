'use client';

import Markdown from 'react-markdown';
import { Link } from "@heroui/link";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function MarkdownRenderer({
  children,
}: Readonly<{
  children: string | null | undefined;
}>) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      className="max-w-full whitespace-normal"
      components={{
        a(props: any) {
          return (
            <Link href={props.href} isExternal>
              {props.children}
            </Link>
          );
        },
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        h1({ children }) {
          return (
            <h1 className="mb-4 text-3xl font-bold sm:tracking-tight">
              {children}
            </h1>
          );
        },
        h2({ children }) {
          return (
            <h2 className="mb-3 text-2xl font-bold sm:tracking-tight">
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return (
            <h3 className="mb-2 text-xl font-bold sm:tracking-tight">
              {children}
            </h3>
          );
        },
        hr({ children }) {
          return <hr className="my-3" />;
        },
        br({ children }) {
          return <div className="my-2 block" />;
        },
        ol({ children }) {
          return <ol className="ms-4 list-inside list-decimal">{children}</ol>;
        },
        ul({ children }) {
          return <ul className="ms-4 list-inside list-disc">{children}</ul>;
        },
        li({ children }) {
          return <li className="mb-2 list-item list-inside">{children}</li>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="relative border-s-4 border-gray-800 bg-slate-200 pl-2 ps-4 sm:ps-6">
              {children}
            </blockquote>
          );
        },
        table({ children }) {
          return (
            <table className="table table-auto border-collapse divide-y divide-gray-200 text-sm dark:divide-neutral-700">
              {children}
            </table>
          );
        },
        thead({ children }) {
          return <thead className="table-header-group">{children}</thead>;
        },
        th({ children }) {
          return (
            <th className="px-6 py-3 text-start text-xs font-medium uppercase text-gray-500 dark:text-neutral-500">
              {children}
            </th>
          );
        },
        tbody({ children }) {
          return (
            <tbody className="table-row-group divide-y divide-gray-200 dark:divide-neutral-700">
              {children}
            </tbody>
          );
        },
        tr({ children }) {
          return <tr className="table-row">{children}</tr>;
        },
        td({ children }) {
          return (
            <td className="table-cell px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
              {children}
            </td>
          );
        },
        pre({ children }) {
          return <pre className="whitespace-pre-line">{children}</pre>;
        },
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              PreTag="div"
              // eslint-disable-next-line react/no-children-prop
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={materialDark}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}
