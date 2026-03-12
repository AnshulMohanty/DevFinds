import { useState, useContext } from 'react';
import { ThumbsUp, MessageSquare, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ResultCard = ({ result, index, onOpenAuth, nodeType = 'high' }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useContext(AuthContext);

  // Dynamic styling based on node type
  const isHigh = nodeType === 'high';
  const indicatorColor = isHigh ? 'bg-primary' : 'bg-blue-500';
  const hoverBorder = isHigh ? 'hover:border-primary/50' : 'hover:border-blue-500/50';
  const shadowGlow = isHigh ? 'shadow-[0_0_10px_rgba(6,249,6,0.5)]' : 'shadow-[0_0_10px_rgba(59,130,246,0.5)]';
  const textColor = isHigh ? 'group-hover:text-primary' : 'group-hover:text-blue-400';

  const handleCardClick = async () => {
    if (result.url) {
      if (user) {
        api.post('/search/click', { 
          url: result.url,
          title: result.title,
          source: result.source 
        }).catch(() => {});
      }
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation(); 
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await api.post('/bookmarks', {
        title: result.title, url: result.url, source: result.source
      });
      if (response.data.success) {
        setIsSaved(response.data.bookmarked);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: "easeOut" }}
      onClick={handleCardClick}
      className={`group relative bg-black/40 border border-white/5 rounded-xl p-5 hover:bg-black/60 transition-all cursor-pointer backdrop-blur-md ${hoverBorder}`}
    >
      {/* The Dynamic Target Reticle Line */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-md ${indicatorColor} ${shadowGlow}`}></div>

      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2 flex-1 pl-2">
          
          <div className="flex items-center justify-between">
             <span className={`text-[10px] font-mono tracking-widest lowercase opacity-70 ${isHigh ? 'text-primary' : 'text-blue-400'}`}>
               {result.source} {result.author && `// ${result.author}`}
             </span>
             <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors" />
          </div>

          <h2 className={`text-base font-bold text-slate-100 transition-colors leading-tight mt-1 line-clamp-2 ${textColor}`}>
            {result.title}
          </h2>

          <div className="flex gap-4 mt-3 text-[9px] font-bold uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
               <ThumbsUp size={12} className={isHigh ? "text-primary/60" : "text-blue-400/60"} /> 
               {result.score || 0}
            </span>
            <span className="flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
               <MessageSquare size={12} className={isHigh ? "text-primary/60" : "text-blue-400/60"} /> 
               {result.comments || 0}
            </span>
          </div>
        </div>

        <button 
          onClick={handleBookmark}
          disabled={isSaving && !!user}
          className={`p-2 border rounded-lg transition-all flex-shrink-0 mt-1 ${
            isSaved && user
              ? `bg-${isHigh ? 'primary' : 'blue-500'}/20 border-${isHigh ? 'primary' : 'blue-500'} text-${isHigh ? 'primary' : 'blue-400'} ${shadowGlow}` 
              : 'bg-black/40 border-white/10 text-slate-500 hover:text-white hover:border-white/40'
          }`}
          title="Save Node"
        >
          <Bookmark size={16} className={isSaved && user ? `fill-${isHigh ? 'primary' : 'blue-500'}` : ""} />
        </button>
      </div>
    </motion.article>
  );
};

export default ResultCard;