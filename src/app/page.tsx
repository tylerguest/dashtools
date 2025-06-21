import Header from '@/components/Header';
import Workspace from '@/components/Workspace';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="bg-zinc-900 border-b border-zinc-700 px-4 py-2">
        <h1 className="text-zinc-200 text-lg font-medium">WebTools</h1>
      </header>
      <main className="flex-1 flex">
        <Workspace />
      </main>
    </div>
  );
}
