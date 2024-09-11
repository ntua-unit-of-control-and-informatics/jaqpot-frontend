'use client';

import Markdown from 'react-markdown';
import { Link } from '@nextui-org/link';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({
  children,
}: Readonly<{
  children: string | null | undefined;
}>) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
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
        ol({ children }) {
          return <ol className="list-inside list-decimal">{children}</ol>;
        },
        ul({ children }) {
          return <ul className="list-inside list-disc">{children}</ul>;
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
      }}
    >
      {children}
    </Markdown>
  );
}
