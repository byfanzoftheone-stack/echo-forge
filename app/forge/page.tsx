'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, GitBranch, Zap, Move, Link as LinkIcon, Save, RefreshCw } from 'lucide-react';

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
  const [isSaving, setIsSaving] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load from server-side JSON + local fallback
  const loadEchoes = async () => {
    try {
      const res = await fetch('/api/echoes');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setEchoes(data);
          return;
        }
      }
    } catch (e) {
      console.log('No server data yet, using local');
    }
    // Fallback to localStorage or initial
    const saved = localStorage.getItem('echoForgeData');
    if (saved) {
      setEchoes(JSON.parse(saved));
    } else {
      const initial: Echo = {
        id: 'fanz-core',
        title: 'FANZ MYCELIUM v5.1',
        content: 'Server-synced living mycelium. Drag, connect, evolve. State saved to data/echoes.json via git.',
        type: 'agent',
        x: 240,
        y: 160,
        connections: [],
        status: 'manifested'
      };
      setEchoes([initial]);
    }
  };

  useEffect(() => {
    loadEchoes();
  }, []);

  // Auto-save to local + optional server sync
  useEffect(() => {
    if (echoes.length > 0) {
      localStorage.setItem('echoForgeData', JSON.stringify(echoes));
    }
  }, [echoes]);

  const saveToServer = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/echoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(echoes),
      });
      const result = await res.json();
      alert(result.message || 'Saved to server!');
    } catch (error) {
      alert('Server save failed. Use Vault download + git commit instead.');
    }
    setIsSaving(false);
  };

  const saveToVault = () => {
    const dataStr = JSON.stringify(echoes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `echo-forge-mycelium-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    alert('✅ Vault snapshot downloaded. Commit data/echoes.json in Termux for full git persistence.');
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
    const prompt = `Evolve this ECHO FORGE echo:\nTitle: ${echo.title}\nType: ${echo.type}\nContent: ${echo.content}\n\nGive richer version + Termux commands.`;
    alert(`✅ Grok Prompt Ready!\n\n${prompt}`);
  };

  const generateCommand = () => {
    const cmds: Record<string, string> = {
      manifest: `git checkout -b feature/new-echo\n# edit then: git add . && git commit -m "manifest" && git push`,
      evolve: `git pull\n# update forge then commit & push`,
      orchestrate: `git checkout -b feature/orchestrate\n# use Orchestrate mode then push`,
      cleanup: `git status`,
      new: `git checkout -b feature/new-agent`,
      launch: `vercel --prod`,
      wire: `echo "Wire Vercel ↔ Railway"`,
      vault: `git add data/echoes.json && git commit -m "vault: mycelium snapshot" && git push`,
    };
    const cmd = cmds[mode] || `git status`;
    navigator.clipboard.writeText(cmd).then(() => alert(`📋 Copied:\n\n${cmd}`));
  };

  // Drag handlers (mouse + touch)
  const startDrag = (id: string, e: any) => {
    setDraggedId(id);
    e.stopPropagation();
  };

  const handleMove = (e: any) => {
    if (!draggedId) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setEchoes(echoes.map(echo => 
      echo.id === draggedId ? { ...echo, x: Math.max(20, clientX - 160), y: Math.max(20, clientY - 140) } : echo
    ));
  };

  const endDrag = () => setDraggedId(null);

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
    const prompt = `You are Grok. Vision from user: "${orchestrateInput}"\n\nGenerate 3-5 connected ECHO FORGE echoes (title, type, content, suggested connections). Make them exciting, agentic, and discovery-pushing. Suggest Termux/git commands.`;
    alert(`✅ Full Orchestrate Prompt Ready!\n\nCopy and ask me (Grok):\n\n${prompt}`);
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
              <p className="text-purple-400">Server-synced Mycelium • Grok-powered • FANZ v5.1</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['manifest','evolve','orchestrate','cleanup'] as const).map(m => (
              <button 
                key={m} 
                onClick={() => { setMode(m); }}
                className={`px-6 py-3 rounded-xl text-sm font-medium ${mode === m ? 'bg-purple-600 shadow-lg' : 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-700'}`}
              >
                {m.toUpperCase()}
              </button>
            ))}
            <button onClick={saveToServer} disabled={isSaving} className="px-6 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 flex items-center gap-2 disabled:opacity-50">
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save to Server'}
            </button>
            <button onClick={saveToVault} className="px-6 py-3 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
              <Download size={16} /> Vault
            </button>
          </div>
        </div>

        {/* Canvas with connections */}
        <div 
          className="relative border border-purple-900/50 rounded-3xl h-[65vh] bg-black/90 overflow-hidden"
          style={{backgroundImage: 'linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px'}}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{opacity: 0.8}}>
            {echoes.flatMap(echo => echo.connections.map(targetId => {
              const target = echoes.find(e => e.id === targetId);
              if (!target) return null;
              return (
                <line
                  key={`\( {echo.id}- \){targetId}`}
                  x1={echo.x + 160} y1={echo.y + 80}
                  x2={target.x + 160} y2={target.y + 80}
                  stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 3"
                />
              );
            }))}
          </svg>

          {echoes.map(echo => (
            <div
              key={echo.id}
              className="absolute bg-zinc-950 border border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 w-80 shadow-2xl cursor-move z-10 transition-all"
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
                  <button onClick={(e) => {e.stopPropagation(); evolveEcho(echo.id);}}><Zap size={22} className="text-purple-400 hover:text-white" /></button>
                  {selectedId && selectedId !== echo.id && (
                    <button onClick={(e) => {e.stopPropagation(); toggleConnection(echo.id);}}><LinkIcon size={22} className="text-purple-400 hover:text-white" /></button>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-400 line-clamp-4">{echo.content}</p>
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
          </div>

          {selectedEcho && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-xl mb-4">Editing: {selectedEcho.title}</h2>
              <textarea 
                className="w-full h-48 bg-black border border-zinc-700 rounded-2xl p-5 text-sm font-mono resize-y"
                defaultValue={selectedEcho.content}
                onChange={(e) => setEchoes(echoes.map(ec => ec.id === selectedEcho.id ? {...ec, content: e.target.value} : ec))}
              />
            </div>
          )}

          {mode === 'orchestrate' && (
            <div className="col-span-full bg-zinc-950 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-xl mb-4">Orchestrate Mode</h2>
              <textarea 
                className="w-full h-40 bg-black border border-zinc-700 rounded-2xl p-5 text-sm font-mono"
                placeholder="Build a complete agentic pipeline with vault, community sharing, and Termux automation..."
                value={orchestrateInput}
                onChange={(e) => setOrchestrateInput(e.target.value)}
              />
              <button onClick={runOrchestrate} className="mt-4 w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl font-semibold">
                Ask Grok to Orchestrate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
