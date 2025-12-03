import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { generateTheme } from './services/geminiService';
import { Theme, DEFAULT_THEME } from './types';
import { Sparkles, Loader2, Camera, Volume2 } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [score, setScore] = useState(0);
  const [debugInfo, setDebugInfo] = useState("Initializing...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateTheme = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const newTheme = await generateTheme(prompt);
      setTheme(newTheme);
      setIsModalOpen(false);
      setPrompt("");
    } catch (error) {
      console.error(error);
      alert("Failed to generate theme. Please check your API Key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Game Layer */}
      <GameCanvas 
        theme={theme} 
        onScoreUpdate={setScore} 
        setDebugInfo={setDebugInfo} 
      />

      {/* HUD Layer */}
      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start z-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-md flex items-center gap-2">
            <span style={{color: theme.snakeHeadColor}}>●</span> 
            {theme.name}
          </h1>
          <div className="flex gap-2">
            <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white/70 border border-white/10 flex items-center gap-2">
                <Camera size={12} />
                {debugInfo}
            </div>
            <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white/70 border border-white/10 flex items-center gap-2">
                <Volume2 size={12} />
                TTS Enabled
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 pointer-events-auto">
          <div className="text-4xl font-black drop-shadow-lg tabular-nums">
            {score}
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-sm">New Theme</span>
          </button>
        </div>
      </div>

      {/* Instructions Overlay (Bottom) */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center pointer-events-none z-10">
        <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex flex-col items-center gap-2 max-w-md text-center">
            <p className="text-sm text-white/90 font-medium">
                Eat the food to hear the <span className="text-yellow-400">Cantonese</span> pronunciation!
            </p>
            <p className="text-xs text-white/60">
                Point finger to guide snake. Turn up your volume.
            </p>
        </div>
      </div>

      {/* Theme Generator Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-400" />
                Learn Cantonese with AI
            </h2>
            
            <p className="text-slate-400 text-sm mb-4">
                Enter a topic (e.g., "Family", "Numbers", "Street Food") and Gemini will generate a custom snake game with vocabulary words to learn!
            </p>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Topic e.g., 'Tropical Fruit'..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none mb-4 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateTheme()}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateTheme}
                disabled={isGenerating || !prompt}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : null}
                {isGenerating ? "Generating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;