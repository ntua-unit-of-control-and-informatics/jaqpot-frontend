import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Jaqpot',
  description: 'From model upload to prediction, all in one place',
};

export default function Dashboard() {
  return (
    <div>
      <h1>Hello from models</h1>
    </div>
  );
}
