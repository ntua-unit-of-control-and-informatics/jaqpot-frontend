'use client';

import Markdown from 'react-markdown';
import { ReactNode } from 'react';
import { Link } from '@nextui-org/link';

export default function MarkdownRenderer({
  children,
}: Readonly<{
  children: string | null | undefined;
}>) {
  return (
    <Markdown
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
          return <h1 className="text-bold mb-4 text-3xl">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-bold mb-3 text-2xl">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-bold mb-2 text-xl">{children}</h3>;
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
      }}
    >
      {children}
    </Markdown>
  );
}
