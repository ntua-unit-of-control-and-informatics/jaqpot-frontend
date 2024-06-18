// app/page.tsx
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export default function Home() {
  redirect('/dashboard');
}
