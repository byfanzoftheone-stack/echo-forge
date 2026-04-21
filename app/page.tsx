import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">ECHO FORGE</h1>
        <p className="text-xl text-zinc-400 mb-10">The living imagination engine for agentic creators. Grok-powered • Termux-native • No API key limits.</p>
        <Link 
          href="/forge"
          className="inline-block px-12 py-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-3xl text-2xl font-medium transition-all active:scale-95"
        >
          Enter the Forge →
        </Link>
      </div>
    </div>
  );
}
