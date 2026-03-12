import { useState, useContext, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Zap, Brain, ShieldCheck, Compass, Share2, Check, Code2, Users, FileText, Cpu, Lock, FastForward } from 'lucide-react'; 
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import ResultCard from '../components/ResultCard';
import { AuthContext } from '../context/AuthContext';
import Trie from '../utils/Trie';

// Initialize and populate the Trie with dev terms
const searchEngineTrie = new Trie();
const commonQueries = [
  "React Context API vs Redux", "Node.js Event Loop architecture", "Next.js App Router data fetching",
  "MongoDB Aggregation pipeline", "CSS Flexbox layout tutorial", "JavaScript Closures explained",
  "Docker containerization basics", "TypeScript interfaces vs types", "Git merge vs rebase", "JWT authentication flow"
];
commonQueries.forEach(q => searchEngineTrie.insert(q));

const Home = ({ onOpenAuth, setRemainingCredits, historyQuery, clearHistoryQuery }) => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [aiAnswer, setAiAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isProMode, setIsProMode] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Listen for Sidebar "Neural Net" click to reset
  useEffect(() => {
    const handleReset = () => {
      setHasSearched(false);
      setSearchQuery('');
      setResults([]);
      setAiAnswer(null);
    };
    window.addEventListener('resetSearchEngine', handleReset);
    return () => window.removeEventListener('resetSearchEngine', handleReset);
  }, []);

  useEffect(() => {
    if (historyQuery) {
      setSearchQuery(historyQuery);
      executeSearch(historyQuery);
      clearHistoryQuery();
    }
  }, [historyQuery]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 1) {
      setSuggestions(searchEngineTrie.suggest(val));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    executeSearch(suggestion);
  };

  const handleShare = () => {
    if (!aiAnswer) return;
    navigator.clipboard.writeText(`DevFinds Intelligence:\n\n${aiAnswer}`);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setSuggestions([]);
    executeSearch(searchQuery);
  };

  const executeSearch = async (query) => {
    if (!query.trim()) return;
    if (isProMode && !user) { onOpenAuth(); return; }

    setIsLoading(true); setHasSearched(true); setAiAnswer(null); setResults([]);
    // Learn new queries dynamically
    searchEngineTrie.insert(query);

    try {
      const response = await api.get(`/search?q=${encodeURIComponent(query)}&proMode=${isProMode}`);
      if (response.data.success) {
        setAiAnswer(response.data.aiSummary);
        setResults(response.data.data || []);
        if (response.data.remainingCredits !== undefined) setRemainingCredits(response.data.remainingCredits);
      }
    } catch (err) {
      if (err.response?.data?.error === 'CREDITS_EXHAUSTED') {
        setRemainingCredits(0);
        setAiAnswer("⚡ **Grid access depleted.** Please initialize your session.");
        onOpenAuth(); 
      } else {
        setAiAnswer("Anomaly detected in datastream.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // CATEGORIZATION LOGIC (Max 5 per column)
  const officialDocs = results.filter(r => ['react.dev', 'nextjs.org', 'developer.mozilla.org', 'docs.', 'nodejs.org'].some(d => r.source.toLowerCase().includes(d))).slice(0, 5);
  const communityNodes = results.filter(r => ['stackoverflow', 'github'].some(d => r.source.toLowerCase().includes(d))).slice(0, 5);
  // Articles are anything not in the first two
  const articleNodes = results.filter(r => 
    !['react.dev', 'nextjs.org', 'developer.mozilla.org', 'docs.', 'nodejs.org', 'stackoverflow', 'github'].some(d => r.source.toLowerCase().includes(d))
  ).slice(0, 5);

  return (
    <div className="min-h-screen text-slate-100 font-display relative overflow-x-hidden">
      <main className="flex-1 flex flex-col items-center relative px-4 md:px-8 w-full max-w-[1600px] mx-auto pt-10 pb-24 z-10">
        
        <motion.div animate={{ paddingTop: hasSearched ? "0px" : "10vh", scale: hasSearched ? 0.95 : 1 }} className="w-full max-w-4xl flex flex-col items-center text-center transition-all duration-700">
          
          {!hasSearched && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center w-full">
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
                Synthesize <br/> <span className="text-primary underline decoration-primary/30 underline-offset-8">Developer Intelligence.</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mb-10 text-lg">Bypass the noise. The Neural Engine scans official docs, StackOverflow, and code repositories to deliver synthesized answers in milliseconds.</p>
            </motion.div>
          )}

          <div className="w-full relative group z-30">
            <div className={`absolute -inset-1 rounded-2xl blur-lg transition-all duration-700 ${isProMode ? 'bg-gradient-to-r from-primary to-emerald-500 opacity-40 animate-pulse' : 'bg-primary/20 opacity-0 group-focus-within:opacity-40'}`}></div>
            <form onSubmit={handleSearch} className={`relative flex items-center bg-black/90 backdrop-blur-2xl rounded-2xl overflow-hidden border transition-all shadow-2xl p-1.5 ${isProMode ? 'border-primary' : 'border-white/10 group-focus-within:border-primary/50'}`}>
              <div className="pl-5 text-primary"><Search size={24} /></div>
              <input 
                value={searchQuery} 
                onChange={handleInputChange} 
                className="w-full bg-transparent border-none focus:ring-0 text-white py-4 px-6 text-xl font-light outline-none" 
                placeholder="Initialize protocol..." 
              />
              <div className="pr-3 flex gap-3 items-center">
                <button type="button" onClick={() => setIsProMode(!isProMode)} className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${isProMode ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(6,249,6,0.3)]' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                  <Zap size={16} className={isProMode ? "fill-black" : ""} /> {isProMode ? 'PRO' : 'BASE'}
                </button>
                <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-[0_0_15px_rgba(6,249,6,0.2)]">
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'ANALYZE'}
                </button>
              </div>
            </form>

            {/* TRIE AUTOCOMPLETE DROPDOWN */}
            <AnimatePresence>
              {suggestions.length > 0 && !hasSearched && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 w-full mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-40">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSuggestionClick(s)} className="w-full text-left px-6 py-3 text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3 border-b border-white/5 last:border-0">
                      <Search size={14} className="opacity-50" /> {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!hasSearched && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="w-full mt-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Trending Global Queries</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['React Context API', 'Node.js Event Loop', 'Next.js Routing', 'MongoDB Aggregation'].map((pill) => (
                  <button key={pill} onClick={() => handleSuggestionClick(pill)} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-slate-300 hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all">
                    {pill}
                  </button>
                ))}
              </div>

              {/* Real Feature Callouts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
                <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <Cpu className="text-primary mb-4" size={24} />
                  <h3 className="text-white font-bold mb-2">AI Synthesis</h3>
                  <p className="text-sm text-slate-400">Powered by Gemini 2.0 Flash to extract root causes directly from official documentation.</p>
                </div>
                <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <FastForward className="text-primary mb-4" size={24} />
                  <h3 className="text-white font-bold mb-2">Redis Caching</h3>
                  <p className="text-sm text-slate-400">Sub-millisecond retrieval times for frequently asked questions across the network.</p>
                </div>
                <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <Lock className="text-primary mb-4" size={24} />
                  <h3 className="text-white font-bold mb-2">Encrypted Vault</h3>
                  <p className="text-sm text-slate-400">Save and organize crucial code snippets and StackOverflow answers to your private DB.</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* SEARCH RESULTS VIEW */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12 items-start">
              
              {/* Left Column: Official Docs */}
              <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
                <div className="flex items-center gap-2 mb-2 border-b border-primary/20 pb-2 text-primary uppercase text-xs font-bold tracking-widest">
                  <FileText size={16} /> Official Docs
                </div>
                {officialDocs.map((result, idx) => <ResultCard key={`off-${idx}`} result={result} index={idx} onOpenAuth={onOpenAuth} nodeType="official" />)}
                {officialDocs.length === 0 && !isLoading && <p className="text-xs text-slate-500 italic">No official docs found.</p>}
              </div>

              {/* Center Column: AI Synthesis & Community */}
              <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
                <div className={`bg-black/60 backdrop-blur-2xl border rounded-2xl p-8 shadow-2xl relative ${isProMode ? 'border-primary/50 shadow-[0_0_30px_rgba(6,249,6,0.1)]' : 'border-white/10'}`}>
                  <div className="flex items-center justify-between mb-6 border-b pb-4 border-white/10">
                    <div className="flex items-center gap-3">
                      <Brain className={isProMode ? "text-primary" : "text-white"} size={24} /> 
                      <h3 className="font-bold tracking-[0.2em] uppercase">{isProMode ? 'Staff Engineer Protocol' : 'Neural Insight'}</h3>
                    </div>
                    {aiAnswer && (
                      <button onClick={handleShare} className="text-slate-500 hover:text-primary transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        {isShared ? <><Check size={14} /> Copied</> : <><Share2 size={14} /> Broadcast</>}
                      </button>
                    )}
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed">
                    {aiAnswer ? <ReactMarkdown>{aiAnswer}</ReactMarkdown> : <p className="italic text-slate-500 flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Synthesizing data streams...</p>}
                  </div>
                </div>

                {/* Community Nodes directly under AI */}
                {communityNodes.length > 0 && (
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-2 mb-2 border-b border-blue-500/20 pb-2 text-blue-500 uppercase text-xs font-bold tracking-widest">
                      <Users size={16} /> Community Solutions
                    </div>
                    {communityNodes.map((result, idx) => <ResultCard key={`com-${idx}`} result={result} index={idx} onOpenAuth={onOpenAuth} nodeType="community" />)}
                  </div>
                )}
              </div>

              {/* Right Column: Articles & Exploratory */}
              <div className="lg:col-span-3 flex flex-col gap-4 order-3 lg:order-3">
                <div className="flex items-center gap-2 mb-2 border-b border-purple-500/20 pb-2 text-purple-500 uppercase text-xs font-bold tracking-widest">
                  <Compass size={16} /> Articles & Blogs
                </div>
                {articleNodes.map((result, idx) => <ResultCard key={`art-${idx}`} result={result} index={idx} onOpenAuth={onOpenAuth} nodeType="exploratory" />)}
                {articleNodes.length === 0 && !isLoading && <p className="text-xs text-slate-500 italic">No external articles found.</p>}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;