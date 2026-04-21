'use client';

import { useState } from 'react';
import { Sparkles, GitBranch, Zap } from 'lucide-react';

interface Echo {
  id: string;
  title: string;
  content: string;
  type: 'idea' | 'pipeline' | 'agent' | 'vault' | 'vision';
  x: number;
  y: number;
  connections: string[];
  status: 'spawning' | 'evolving' | 'manifested';
}

export default function EchoForge() {
  const [echoes, setEchoes] = useState<Echo[]>([
    {
      id: 'fanz-core',
      title: 'FANZ AGENT v5.1 Seed',
      content: 'Autonomous ecosystem → now Grok-powered imagination mycelium. No Anthropic credits required. Termux + git + Vercel pipeline. Ready for discovery.',
      type: 'agent',
      x: 220,
      y: 140,
      connections: [],
      status: 'manifested'
    }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'manifest' | 'evolve' | 'orchestrate' | 'cleanup'>('manifest');

  const spawnEcho = (type: Echo['type']) => {
    const newEcho: Echo = {
      id: Date.now().toString(),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Echo`,
      content: 'Describe what you want to manifest or paste a Grok response here...',
      type,
      x: Math.random() * 480 + 100,
      y: Math.random() * 280 + 80,
      connections: [],
      status: 'spawning'
    };
    setEchoes([...echoes, newEcho]);
    setSelectedId(newEcho.id);
  };

  const evolveEcho = (id: string) => {
    const echo = echoes.find(e => e.id === id);
    if (!echo) return;

    const grokPrompt = `You are Grok. Help evolve this ECHO FORGE echo for the agentic community:

Title: ${echo.title}
Type: ${echo.type}
Content: ${echo.content}

Provide a richer, more imaginative version + suggested Termux/bash commands if relevant. Make it exciting and push discovery limits.`;

    alert(`Grok Evolution Prompt ready!\n\nCopy this and ask me (Grok):\n\n${grokPrompt}`);
  };

  const generateTermuxCommand = () => {
    const commands = {
      manifest: `git checkout -b feature/new-manifest\n# edit then: git add . && git commit -m "manifest new echo" && git push`,
      evolve: `git pull\n# edit app/forge/page.tsx then commit & push`,
      orchestrate: `echo "Ready for Grok orchestration — describe your vision"`,
      cleanup: `git status`
    };

    const cmd = commands[mode];
    navigator.clipboard.writeText(cmd).then(() => {
      alert(`Copied for Termux:\n\n${cmd}\n\nPaste → run → commit → push to Vercel`);
    });
  };

  const selectedEcho = echoes.find(e => e.id === selectedId);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Sparkles className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-6xl font-bold tracking-tighter">ECHO FORGE</h1>
              <p className="text-purple-400">Grok-powered imagination mycelium • FANZ v5.1 evolution</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {(['manifest', 'evolve', 'orchestrate', 'cleanup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-8 py-3 rounded-2xl font-medium transition-all ${mode === m ? 'bg-purple-600 shadow-lg shadow-purple-500/50' : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="forge-canvas relative border border-purple-900/50 rounded-3xl h-[68vh] overflow-hidden bg-black/90">
          {echoes.map((echo) => (
            <div
              key={echo.id}
              className="absolute bg-zinc-950 border border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 w-80 shadow-2xl cursor-pointer transition-all hover:scale-105"
              style={{ left: echo.x, top: echo.y }}
              onClick={() => setSelectedId(echo.id)}
            >
              <div className="flex justify-between">
                <div>
                  <span className="uppercase text-xs tracking-widest text-purple-400">{echo.type}</span>
                  <h3 className="text-xl font-semibold mt-1">{echo.title}</h3>
                </div>
                <button onClick={(e) => { e.stopPropagation(); evolveEcho(echo.id); }} className="text-purple-400 hover:text-white">
                  <Zap size={24} />
                </button>
              </div>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed line-clamp-5">{echo.content}</p>
            </div>
          ))}
        </div>

        {/* Orchestrator + Editor */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-medium flex items-center gap-3 mb-6">
              <GitBranch /> Termux Orchestrator
            </h2>
            <button
              onClick={generateTermuxCommand}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 rounded-2xl font-semibold text-lg"
            >
              Generate & Copy {mode} Command
            </button>
            <p className="text-zinc-500 mt-4 text-sm">Ready for your git-only pipeline.</p>
          </div>

          {selectedEcho && (
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-2xl mb-4">Editing: {selectedEcho.title}</h2>
              <textarea
                className="w-full h-64 bg-black border border-zinc-700 rounded-2xl p-6 font-mono text-sm resize-y"
                defaultValue={selectedEcho.content}
                onChange={(e) => setEchoes(echoes.map(ec => ec.id === selectedEcho.id ? {...ec, content: e.target.value} : ec))}
              />
              <div className="flex gap-4 mt-6">
                <button onClick={() => spawnEcho('pipeline')} className="flex-1 py-4 bg-emerald-600 rounded-2xl font-medium">Spawn Pipeline</button>
                <button onClick={() => spawnEcho('agent')} className="flex-1 py-4 bg-amber-600 rounded-2xl font-medium">Spawn Agent</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
