import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Swapped invalid icons for Brain, Network, and Activity
import { Search, Loader2, Mic, Brain, Network, Activity } from 'lucide-react'; 
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import ResultCard from '../components/ResultCard';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setAiAnswer(null);
    setResults([]);
    
    try {
      const response = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.data.success) {
        setAiAnswer(response.data.aiSummary);
        setResults(response.data.data || []);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setAiAnswer("The neural engine encountered an anomaly. Please check the raw sources below.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-display relative overflow-x-hidden">
      
      {/* Orbital / Geometric Background Element */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${hasSearched ? 'opacity-5 fixed top-[-20%]' : 'opacity-10'}`}>
        <div className="relative w-[600px] h-[600px]">
          <div className="orbital-path w-full h-full animate-[spin_20s_linear_infinite]"></div>
          <div className="orbital-path w-[80%] h-[80%] top-[10%] left-[10%] animate-[spin_15s_linear_infinite_reverse]"></div>
          <div className="orbital-path w-[60%] h-[60%] top-[20%] left-[20%] animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-4 bg-primary rounded-full glow-primary-strong"></div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center relative px-6 w-full max-w-7xl mx-auto pt-10 pb-24 z-10">
        
        {/* Dynamic Header Section */}
        <motion.div 
          animate={{ 
            paddingTop: hasSearched ? "0px" : "10vh",
            scale: hasSearched ? 0.95 : 1,
            opacity: 1
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl flex flex-col items-center text-center"
        >
          {!hasSearched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Core System Online
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight text-white">
                Search the <span className="text-primary underline decoration-primary/30 underline-offset-8">Future.</span>
              </h2>
            </motion.div>
          )}

          {/* Search Input Component */}
          <form onSubmit={handleSearch} className="w-full relative group z-20">
            <div className={`absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/10 rounded-xl blur opacity-25 group-focus-within:opacity-60 transition duration-1000 group-hover:duration-200 ${hasSearched ? 'opacity-10' : ''}`}></div>
            <div className="relative flex items-center bg-black border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-all shadow-2xl">
              <div className="pl-6 text-primary">
                <Search size={24} />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 py-6 px-6 text-xl font-light outline-none"
                placeholder="Query the decentralized grid..." 
              />
              <div className="pr-4 flex gap-2 items-center">
                <button type="button" className="p-3 text-primary/60 hover:text-primary transition-colors hidden sm:block">
                  <Mic size={20} />
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-background-dark px-6 py-3 rounded-lg font-bold text-sm hover:scale-105 transition-transform active:scale-95 disabled:opacity-70 disabled:hover:scale-100 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'ANALYZE'}
                </button>
              </div>
            </div>
          </form>

          {/* Trending Nodes - Only visible before search */}
          <AnimatePresence>
            {!hasSearched && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 flex flex-wrap justify-center gap-3"
              >
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest w-full mb-2">Trending Nodes</span>
                <button onClick={() => setSearchQuery('Node.js backend optimization')} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 text-sm hover:text-primary hover:border-primary/20 transition-all">#NodeJS_Backend</button>
                <button onClick={() => setSearchQuery('MERN stack architecture')} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 text-sm hover:text-primary hover:border-primary/20 transition-all">#MERN_Stack</button>
                <button onClick={() => setSearchQuery('Java DSA tree traversal')} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 text-sm hover:text-primary hover:border-primary/20 transition-all">#Java_DSA</button>
                <button onClick={() => setSearchQuery('Spring Boot microservices')} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 text-sm hover:text-primary hover:border-primary/20 transition-all">#SpringBoot</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Layout */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12"
            >
              
              {/* Left Column: AI Neural Insight */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 sticky top-24 shadow-[0_0_30px_rgba(6,249,6,0.03)] backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-6 border-b border-primary/10 pb-4">
                    <Brain className="text-primary" size={24} /> {/* FIX: Changed to Brain */}
                    <h3 className="font-bold tracking-widest uppercase text-primary">Neural Insight</h3>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 opacity-70">
                      <Loader2 className="animate-spin text-primary mb-4" size={32} />
                      <p className="text-xs text-primary/60 font-mono animate-pulse uppercase tracking-widest">Synthesizing Datastream...</p>
                    </div>
                  ) : (
                    <div className="prose prose-sm prose-invert prose-pre:bg-black/50 prose-pre:border prose-pre:border-primary/20 prose-a:text-primary hover:prose-a:text-green-400 prose-headings:text-slate-100 max-w-none text-slate-300 font-light leading-relaxed">
                      {aiAnswer ? (
                        <ReactMarkdown>{aiAnswer}</ReactMarkdown>
                      ) : (
                        <p className="italic text-slate-500">Awaiting query parameters...</p>
                      )}
                    </div>
                  )}
                  
                  {/* Fake processing bar for aesthetic */}
                  {!isLoading && aiAnswer && (
                    <div className="mt-6 pt-4 border-t border-primary/10">
                       <div className="flex items-center gap-2 mb-2">
                        <Activity className="text-primary/60" size={14} /> {/* FIX: Changed to Activity */}
                        <span className="text-[10px] uppercase tracking-widest text-primary/60">Synthesis Complete</span>
                       </div>
                       <div className="w-full bg-primary/10 h-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full w-full shadow-[0_0_8px_#06f906]"></div>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Search Results */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                   <Network className="text-slate-400" size={20} /> {/* FIX: Changed to Network */}
                   <h3 className="font-bold tracking-widest uppercase text-slate-100">Extracted Nodes</h3>
                   <span className="ml-auto text-xs text-primary/60 font-mono italic">
                      {results.length > 0 ? `[${results.length} fragments retrieved]` : '[Scanning...]'}
                   </span>
                </div>

                {isLoading && (
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 rounded-xl border border-white/5 bg-white/[0.02] animate-pulse"></div>
                    ))}
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {results.map((result, idx) => (
                      <ResultCard key={idx} result={result} index={idx} />
                    ))}
                  </div>
                )}

                {!isLoading && results.length === 0 && !aiAnswer && (
                   <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                     <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">data_alert</span>
                     <p className="text-slate-500 text-sm">No valid data fragments located in the current sector.</p>
                   </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;