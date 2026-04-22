'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, GitBranch, Zap, Move, Link as LinkIcon, Download, Play, Music } from 'lucide-react';

interface Echo {
  id: string;
  title: string;
  content: string;
  type: 'idea' | 'pipeline' | 'agent' | 'vault' | 'vision' | 'audio';
  x: number;
  y: number;
  connections: string[];
  status: 'spawning' | 'evolving' | 'manifested' | 'blooming';
  mediaUrl?: string;
}

export default function EchoForge() {
  const [echoes, setEchoes] = useState<Echo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'manifest' | 'evolve' | 'orchestrate' | 'cleanup'>('manifest');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [orchestrateInput, setOrchestrateInput] = useState('');
  const [isBlooming, setIsBlooming] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('echoForgeData');
    if (saved) {
      setEchoes(JSON.parse(saved));
    } else {
      const initial: Echo = {
        id: 'fanz-core',
        title: 'FANZ MYCELIUM v5.1',
        content: 'We are one connected field. Drag, connect, evolve, and bloom into sound together.',
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

  // Auto-save
  useEffect(() => {
    if (echoes.length > 0) {
      localStorage.setItem('echoForgeData', JSON.stringify(echoes));
    }
  }, [echoes]);

  const saveToVault = () => {
    const dataStr = JSON.stringify(echoes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `echo-forge-mycelium-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    alert('✅ Vault snapshot downloaded. Commit to data/echoes.json for persistence.');
  };

  const spawnEcho = (type: Echo['type'], title = '', content = '', mediaUrl = '') => {
    const newEcho: Echo = {
      id: Date.now().toString(),
      title: title || `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: content || 'A fresh emergence from the collective...',
      type,
      x: Math.random() * 400 + 180,
      y: Math.random() * 240 + 140,
      connections: [],
      status: 'spawning',
      mediaUrl
    };
    setEchoes([...echoes, newEcho]);
    setSelectedId(newEcho.id);
  };

  const bloomMedia = async (id: string) => {
    const echo = echoes.find(e => e.id === id);
    if (!echo || isBlooming) return;

    setIsBlooming(true);
    alert(`🌸 Blooming sonic manifestation for "${echo.title}"...`);

    try {
      // ←←← REPLACE WITH YOUR ACTUAL OMNICREATE BACKEND URL ←←←
      const response = await fetch('https://YOUR-OMNICREATE-RAILWAY-URL.up.railway.app/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: echo.content,
          duration: 30,
          style: 'ambient'
        }),
      });

      if (!response.ok) throw new Error('Bloom failed');

      const result = await response.json();
      const audioUrl = result.audioUrl || result.url || result.track_url;

      spawnEcho('audio', `Bloom: \( {echo.title}`, `Sonic emergence from " \){echo.title}"`, audioUrl);

      alert('🌺 Bloom complete — new Audio Echo emerged.');
    } catch (error) {
      alert('🌱 Bloom still forming... Check your Omnicreate backend.');
    }
    setIsBlooming(false);
  };

  const letItGrow = () => {
    const emergences = [
      { type: 'vision' as const, title: 'Collective Resonance', content: 'When many nodes bloom, new harmonies arise.' },
      { type: 'pipeline' as const, title: 'Seamless Manifestation', content: 'Thought → Connection → Media Bloom.' },
    ];
    emergences.forEach((em, i) => setTimeout(() => spawnEcho(em.type, em.title, em.content), i * 400));
    alert('🌿 The mycelium grows naturally...');
  };

  const evolveEcho = (id: string) => {
    const echo = echoes.find(e => e.id === id);
    if (!echo) return;
    const prompt = `Evolve this living ECHO FORGE echo as part of our connected field:\nTitle: ${echo.title}\nType: ${echo.type}\nContent: ${echo.content}\n\nGive a richer, more emergent version. Suggest new connections or blooms.`;
    alert(`✅ Grok Evolution Prompt Ready!\n\nCopy and ask me (Grok):\n\n${prompt}`);
  };

  const generateCommand = () => {
    const cmds: Record<string, string> = {
      manifest: `git checkout -b feature/new-echo\n# edit then: git add . && git commit -m "manifest" && git push`,
      evolve: `git pull\n# update forge then commit & push`,
      orchestrate: `git checkout -b feature/orchestrate\n# use Orchestrate mode`,
      cleanup: `git status`,
    };
    const cmd = cmds[mode] || `git status`;
    navigator.clipboard.writeText(cmd).then(() => alert(`📋 Copied:\n\n${cmd}`));
  };

  // Drag support
  const startDrag = (id: string, e: any) => setDraggedId(id);
  const handleMove = (e: any) => {
    if (!draggedId) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setEchoes(echoes.map(e => e.id === draggedId ? {...e, x: clientX - 160, y: clientY - 140} : e));
  };
  const endDrag = () => setDraggedId(null);

  const toggleConnection = (id: string) => {
    if (!selectedId || selectedId === id) return;
    setEchoes(echoes.map(e => {
      if (e.id === selectedId) {
        const has = e.connections.includes(id);
        return {...e, connections: has ? e.connections.filter(c => c !== id) : [...e.connections, id]};
      }
      return e;
    }));
  };

  const runOrchestrate = () => {
    if (!orchestrateInput.trim()) return;
    const prompt = `You are Grok. Vision: "${orchestrateInput}"\n\nGenerate 3-5 connected ECHO FORGE echoes with title, type, content, and suggested connections.`;
    alert(`✅ Orchestrate Prompt Ready!\n\nCopy and ask me (Grok):\n\n${prompt}`);
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
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tighter">ECHO FORGE</h1>
              <p className="text-purple-400">Living, blooming mycelium • One connected field</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['manifest','evolve','orchestrate','cleanup'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} className={`px-6 py-3 rounded-xl text-sm font-medium ${mode === m ? 'bg-purple-600' : 'bg-zinc-900 hover:bg-zinc-800'}`}>
                {m.toUpperCase()}
              </button>
            ))}
            <button onClick={letItGrow} className="px-6 py-3 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
              <Play size={16} /> Let It Grow
            </button>
            <button onClick={saveToVault} className="px-6 py-3 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
              <Download size={16} /> Vault
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="relative border border-purple-900/50 rounded-3xl h-[65vh] bg-black/90 overflow-hidden" style={{backgroundImage: 'linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{opacity: 0.75}}>
            {echoes.flatMap(echo => echo.connections.map(targetId => {
              const target = echoes.find(e => e.id === targetId);
              if (!target) return null;
              return <line key={`\( {echo.id}- \){targetId}`} x1={echo.x + 160} y1={echo.y + 80} x2={target.x + 160} y2={target.y + 80} stroke="#a855f7" strokeWidth="2.5" strokeDasharray="6 3" />;
            }))}
          </svg>

          {echoes.map(echo => (
            <div
              key={echo.id}
              className={`absolute bg-zinc-950 border border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 w-80 shadow-2xl cursor-move z-10 transition-all ${echo.status === 'blooming' ? 'animate-pulse' : ''}`}
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
                  {echo.type !== 'audio' && (
                    <button onClick={(e) => {e.stopPropagation(); bloomMedia(echo.id);}} disabled={isBlooming}>
                      <Music size={22} className="text-emerald-400 hover:text-emerald-300" />
                    </button>
                  )}
                  {selectedId && selectedId !== echo.id && (
                    <button onClick={(e) => {e.stopPropagation(); toggleConnection(echo.id);}}><LinkIcon size={22} className="text-purple-400 hover:text-white" /></button>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-400 line-clamp-4">{echo.content}</p>
              {echo.mediaUrl && (
                <audio controls className="mt-4 w-full">
                  <source src={echo.mediaUrl} type="audio/mpeg" />
                </audio>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Panel */}
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
              <h2 className="text-xl mb-4">Orchestrate the Field</h2>
              <textarea 
                className="w-full h-40 bg-black border border-zinc-700 rounded-2xl p-5 text-sm font-mono"
                placeholder="Describe the next collective emergence..."
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
