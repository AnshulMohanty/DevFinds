import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, ArrowRight, MessageSquare, ThumbsUp, ExternalLink, Bookmark } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Hits your federated search endpoint
      const response = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data.data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-white font-display overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>

      {/* Main Container */}
      <main className="container mx-auto px-4 relative z-10">
        
        {/* HERO SECTION: Shrinks when results appear */}
        <motion.div 
          animate={{ paddingTop: hasSearched ? "40px" : "120px" }}
          className="flex flex-col items-center justify-center text-center transition-all duration-500"
        >
          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                v2.0 is now live
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                One Search. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">
                  Every Dev Resource.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-text-muted mb-12 max-w-2xl mx-auto">
                Federated search across StackOverflow, Reddit, and Dev.to in a single interface.
              </p>
            </motion.div>
          )}

          {/* CENTRAL SEARCH BAR */}
          <form 
            onSubmit={handleSearch}
            className={`w-full max-w-3xl relative group transition-all duration-500 ${hasSearched ? 'mb-12' : ''}`}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-green-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-card-dark rounded-xl p-2 shadow-2xl border border-white/10">
              <div className="pl-4 pr-3 text-text-muted">
                <Search size={22} />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 focus:ring-0 text-white placeholder:text-text-muted text-lg py-3 outline-none"
                placeholder="Search error codes, libraries, or concepts..."
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-background-dark font-bold px-6 py-3 rounded-lg transition-all flex items-center gap-2"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* RESULTS GRID */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto pb-20"
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold text-white">
                  Results for <span className="text-primary">"{searchQuery}"</span>
                </h2>
                <span className="text-sm text-text-muted">{results.length} results found</span>
              </div>

              <div className="grid gap-6">
                {results.map((result, idx) => (
                  <motion.article 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group p-6 rounded-xl border border-border-dark bg-card-dark hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            result.source === 'reddit' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {result.source}
                          </span>
                          <span className="text-xs text-text-muted">•</span>
                          <span className="text-xs text-text-muted">Direct from API</span>
                        </div>
                        <h3 className="text-xl font-semibold text-primary group-hover:underline cursor-pointer mb-3 leading-snug">
                          {result.title}
                        </h3>
                        <p className="text-slate-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {result.content || "Click to view full content and code snippets from the source."}
                        </p>
                        <div className="flex items-center gap-6 text-text-muted text-xs">
                          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <ThumbsUp size={14} /> {result.score || 0}
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <MessageSquare size={14} /> {result.comments || 0}
                          </span>
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-primary hover:underline ml-auto"
                          >
                            View Source <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                      <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-white/5">
                        <Bookmark size={20} />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;