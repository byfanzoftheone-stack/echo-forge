'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, GitBranch, Zap, Move, Link as LinkIcon, Save, Download } from 'lucide-react';

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
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'manifest' | 'evolve' | 'orchestrate' | 'cleanup'>('manifest');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [orchestrateInput, setOrchestrateInput] = useState('');
  const [showOrchestrate, setShowOrchestrate] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load from localStorage + try to load from data/echoes.json (future git sync)
  useEffect(() => {
    const saved = localStorage.getItem('echoForgeData');
    if (saved) {
      setEchoes(JSON.parse(saved));
    } else {
      const initial: Echo = {
        id: 'fanz-core',
        title: 'FANZ MYCELIUM v5.1',
        content: 'Living agentic brain. Drag, connect, evolve. Git-trackable persistence + full FANZ orchestration now active.',
        type: 'agent',
        x: 240,
        y: 160,
        connections: [],
        status: 'manifested'
      };
      setEchoes([initial]);
      localStorage.setItem('echoForgeData', JSON.stringify([initial]));
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (echoes.length > 0) {
      localStorage.setItem('echoForgeData', JSON.stringify(echoes));
    }
  }, [echoes]);

  const saveToVault = () => {
    const dataStr = JSON.stringify(echoes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'echo-forge-vault.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    alert('✅ Vault snapshot downloaded! Commit data/echoes.json or this file to git for full persistence.');
  };

  const spawnEcho = (type: Echo['type']) => {
    const newEcho: Echo = {
      id: Date.now().toString(),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: 'Paste Grok response or describe the next branch...',
      type,
      x: Math.random() * 400 + 180,
      y: Math.random() * 240 + 140,
      connections: [],
      status: 'spawning'
    };
    setEchoes([...echoes, newEcho]);
    setSelectedId(newEcho.id);
  };

  const evolveEcho = (id: string) => {
    const echo = echoes.find(e => e.id === id);
    if (!echo) return;
    const prompt = `Evolve this ECHO FORGE echo creatively for the agentic community:\nTitle: ${echo.title}\nType: ${echo.type}\nContent: ${echo.content}\n\nGive a richer version + Termux/bash ideas.`;
    alert(`✅ Grok Prompt Ready!\n\nCopy and ask me (Grok):\n\n${prompt}`);
  };

  const generateCommand = () => {
    const fanzCommands = {
      manifest: `git checkout -b feature/new-echo\n# edit then:\ngit add . && git commit -m "manifest new echo" && git push`,
      evolve: `git pull\n# improve forge then commit & push`,
      orchestrate: `git checkout -b feature/orchestrate-vision\n# describe vision in app/forge then push`,
      cleanup: `git status && git branch -a`,
      new: `git checkout -b feature/new-agent\nnpx create-next-app@latest . --yes --force`,
      launch: `vercel --prod`,
      wire: `echo "Wire Vercel + Railway URLs in env"`,
      vault: `git add data/echoes.json && git commit -m "vault: snapshot mycelium" && git push`,
    };
    const cmd = fanzCommands[mode as keyof typeof fanzCommands] || `git status`;
    navigator.clipboard.writeText(cmd).then(() => alert(`📋 Copied FANZ-style command:\n\n${cmd}`));
  };

  // Drag logic (mouse + touch)
  const startDrag = (id: string, e: any) => {
    setDraggedId(id);
    e.stopPropagation();
  };

  const handleMove = (e: any) => {
    if (!draggedId) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setEchoes(echoes.map(echo => 
      echo.id === draggedId ? { ...echo, x: Math.max(0, clientX - 160), y: Math.max(0, clientY - 140) } : echo
    ));
  };

  const endDrag = () => setDraggedId(null);

  // Connection logic
  const toggleConnection = (id: string) => {
    if (!selectedId || selectedId === id) return;
    setEchoes(echoes.map(echo => {
      if (echo.id === selectedId) {
        const has = echo.connections.includes(id);
        return { ...echo, connections: has ? echo.connections.filter(c => c !== id) : [...echo.connections, id] };
      }
      return echo;
    }));
  };

  const runOrchestrate = () => {
    if (!orchestrateInput.trim()) return;
    const prompt = `You are Grok helping build ECHO FORGE mycelium.\n\nVision: ${orchestrateInput}\n\nGenerate 3-5 connected echoes (title, type, content, suggested connections). Make them exciting and agentic. Suggest Termux commands where relevant.`;
    alert(`✅ Orchestrate Prompt Ready!\n\nCopy and ask me (Grok):\n\n${prompt}\n\nThen paste my response and use "Spawn" to add them.`);
    setOrchestrateInput('');
  };

  const selectedEcho = echoes.find(e => e.id === selectedId);

  return (
    <div 
      className="min-h-screen bg-[#050505] text-white p-6"
      onMouseMove={handleMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={handleMove}
      onTouchEnd={endDrag}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">ECHO FORGE</h1>
              <p className="text-purple-400">Living Mycelium Network • Grok-powered • FANZ v5.1</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['manifest','evolve','orchestrate','cleanup'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => { setMode(m); setShowOrchestrate(m === 'orchestrate'); }}
                className={`px-6 py-3 rounded-xl text-sm font-medium ${mode === m ? 'bg-purple-600 shadow-lg' : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
            <button onClick={saveToVault} className="px-6 py-3 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
              <Save size={16} /> Vault
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          ref={canvasRef}
          className="relative border border-purple-900/50 rounded-3xl h-[65vh] bg-black/90 overflow-hidden"
          style={{backgroundImage: 'linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px'}}
        >
          {/* SVG Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{opacity: 0.75}}>
            {echoes.flatMap(echo => 
              echo.connections.map(targetId => {
                const target = echoes.find(e => e.id === targetId);
                if (!target) return null;
                return (
                  <line
                    key={`\( {echo.id}- \){targetId}`}
                    x1={echo.x + 160} y1={echo.y + 80}
                    x2={target.x + 160} y2={target.y + 80}
                    stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 3" strokeOpacity="0.85"
                  />
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {echoes.map(echo => (
            <div
              key={echo.id}
              className="absolute bg-zinc-950 border border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 w-80 shadow-2xl cursor-move select-none transition-all z-10"
              style={{ left: echo.x, top: echo.y }}
              onMouseDown={(e) => startDrag(echo.id, e)}
              onTouchStart={(e) => startDrag(echo.id, e)}
              onClick={() => setSelectedId(echo.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="uppercase text-xs tracking-widest text-purple-400">{echo.type}</span>
                  <h3 className="font-semibold text-xl mt-1">{echo.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => {e.stopPropagation(); evolveEcho(echo.id);}} className="text-purple-400 hover:text-white"><Zap size={22} /></button>
                  {selectedId && selectedId !== echo.id && (
                    <button onClick={(e) => {e.stopPropagation(); toggleConnection(echo.id);}} className="text-purple-400 hover:text-white"><LinkIcon size={22} /></button>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-400 line-clamp-4">{echo.content}</p>
              <div className="text-[10px] text-zinc-500 mt-3 flex items-center gap-1"><Move size={12} /> Drag to move</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-2xl font-medium flex items-center gap-3 mb-6"><GitBranch className="text-purple-400" /> Termux Orchestrator</h2>
            <button onClick={generateCommand} className="w-full py-5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 rounded-2xl font-semibold text-lg">
              Generate & Copy {mode} Command
            </button>
            <p className="text-zinc-500 mt-4 text-sm">Full FANZ v5.1 style commands for your pipeline.</p>
          </div>

          {selectedEcho && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-xl mb-4">Editing: {selectedEcho.title}</h2>
              <textarea 
                className="w-full h-48 bg-black border border-zinc-700 rounded-2xl p-5 text-sm font-mono resize-y"
                defaultValue={selectedEcho.content}
                onChange={(e) => setEchoes(echoes.map(ec => ec.id === selectedEcho.id ? {...ec, content: e.target.value} : ec))}
              />
              <div className="flex gap-3 mt-4">
                <button onClick={() => spawnEcho('pipeline')} className="flex-1 py-3 bg-emerald-600 rounded-2xl">Spawn Pipeline</button>
                <button onClick={() => spawnEcho('agent')} className="flex-1 py-3 bg-amber-600 rounded-2xl">Spawn Agent</button>
              </div>
            </div>
          )}

          {mode === 'orchestrate' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 col-span-full lg:col-span-2">
              <h2 className="text-xl mb-4">Orchestrate Mode — Describe your vision</h2>
              <textarea 
                className="w-full h-40 bg-black border border-zinc-700 rounded-2xl p-5 text-sm font-mono resize-y"
                placeholder="Build a full agentic pipeline for Termux + Vercel that includes vault persistence and community sharing..."
                value={orchestrateInput}
                onChange={(e) => setOrchestrateInput(e.target.value)}
              />
              <button 
                onClick={runOrchestrate}
                className="mt-4 w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-semibold"
              >
                Ask Grok to Orchestrate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
