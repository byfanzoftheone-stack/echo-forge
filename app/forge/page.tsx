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
      content: 'Autonomous ecosystem → Grok-powered imagination mycelium. No API keys or Claude credits needed. Built for Termux + git + Vercel creators pushing discovery.',
      type: 'agent',
      x: 220,
      y: 180,
      connections: [],
      status: 'manifested'
    }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'manifest' | 'evolve' | 'orchestrate' | 'cleanup'>('manifest');

  const spawnEcho = (type: Echo['type']) => {
    const newEcho: Echo = {
      id: Date.now().toString(),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: 'Paste Grok response or describe your vision here...',
      type,
      x: Math.random() * 500 + 120,
      y: Math.random() * 300 + 100,
      connections: [],
      status: 'spawning'
    };
    setEchoes([...echoes, newEcho]);
    setSelectedId(newEcho.id);
  };

  const evolveEcho = (id: string) => {
    const echo = echoes.find(e => e.id === id);
    if (!echo) return;
    const prompt = `Evolve this ECHO FORGE echo creatively for the agentic community:\n\nTitle: ${echo.title}\nType: ${echo.type}\nContent: ${echo.content}\n\nGive a richer version + suggested Termux/bash commands if relevant. Make it exciting and push discovery.`;
    alert(`✅ Grok Prompt Ready!\n\nCopy this and ask me (Grok):\n\n${prompt}`);
  };

  const generateCommand = () => {
    const cmds = {
      manifest: `git checkout -b feature/new-echo\n# edit files then:\ngit add . && git commit -m "manifest new echo" && git push`,
      evolve: `git pull\n# update the forge then commit & push`,
      orchestrate: `Describe your vision — I'll help orchestrate multiple echoes`,
      cleanup: `git status`
    };
    const cmd = cmds[mode];
    navigator.clipboard.writeText(cmd).then(() => alert(`📋 Copied for Termux:\n\n${cmd}`));
  };

  const selected = echoes.find(e => e.id === selectedId);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">ECHO FORGE</h1>
              <p className="text-purple-400">Grok-powered imagination mycelium • FANZ v5.1 evolution</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['manifest','evolve','orchestrate','cleanup'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => setMode(m)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${mode === m ? 'bg-purple-600 shadow-lg' : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* The Canvas */}
        <div className="relative border border-purple-900/50 rounded-3xl h-[65vh] bg-black/90 overflow-hidden" style={{backgroundImage: 'linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
          {echoes.map(echo => (
            <div
              key={echo.id}
              className="absolute bg-zinc-950 border border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 w-80 shadow-2xl cursor-pointer transition-all hover:scale-[1.02]"
              style={{ left: echo.x, top: echo.y }}
              onClick={() => setSelectedId(echo.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="uppercase text-xs tracking-widest text-purple-400 font-mono">{echo.type}</span>
                  <h3 className="font-semibold text-xl mt-1">{echo.title}</h3>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); evolveEcho(echo.id); }}
                  className="text-purple-400 hover:text-white p-1"
                >
                  <Zap size={24} />
                </button>
              </div>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed line-clamp-4">{echo.content}</p>
            </div>
          ))}
        </div>

        {/* Bottom Panel */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-medium flex items-center gap-3 mb-6">
              <GitBranch className="text-purple-400" /> Termux Orchestrator
            </h2>
            <button 
              onClick={generateCommand}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 rounded-2xl font-semibold text-lg"
            >
              Generate & Copy {mode} Command
            </button>
            <p className="text-zinc-500 mt-4 text-sm">Designed for your git-only Termux pipeline.</p>
          </div>

          {selected && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-xl mb-4">Editing: {selected.title}</h2>
              <textarea 
                className="w-full h-48 bg-black border border-zinc-700 rounded-2xl p-5 text-sm font-mono resize-y"
                defaultValue={selected.content}
                onChange={(e) => setEchoes(echoes.map(ec => ec.id === selected.id ? {...ec, content: e.target.value} : ec))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
