import { useState } from 'react';
import { ThumbsUp, MessageSquare, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const ResultCard = ({ result, index }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Send click signal to backend for analytics
  const handleCardClick = async () => {
    if (result.url) {
      api.post('/search/click', { 
        url: result.url,
        title: result.title,
        source: result.source 
      }).catch(() => {});
      
      window.open(result.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Bookmark toggler
  const handleBookmark = async (e) => {
    e.stopPropagation(); 
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const response = await api.post('/bookmarks', {
        title: result.title,
        url: result.url,
        source: result.source
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, ease: "easeOut" }}
      onClick={handleCardClick}
      className="group relative bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer backdrop-blur-sm"
    >
      {/* The Neon Hover Line from your mockups */}
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-md shadow-[0_0_10px_rgba(6,249,6,0.5)]"></div>

      <div className="flex justify-between items-start gap-6">
        <div className="flex flex-col gap-2 flex-1 pl-2">
          
          {/* Top Meta: Source & Author */}
          <div className="flex items-center justify-between">
             <span className="text-xs font-mono text-primary/70 tracking-widest lowercase">
               {result.source} {result.author && `// ${result.author}`}
             </span>
             <ExternalLink size={14} className="text-slate-600 group-hover:text-primary/50 transition-colors" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors leading-tight mt-1">
            {result.title}
          </h2>

          {/* Snippet Context */}
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mt-1">
            {result.content || "Explore this node to extract code implementations and technical discussions."}
          </p>

          {/* Bottom Meta: Stats */}
          <div className="flex gap-5 mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <span className="flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
               <ThumbsUp size={12} className="text-primary/60" /> 
               {result.score || 0} Score
            </span>
            <span className="flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
               <MessageSquare size={12} className="text-primary/60" /> 
               {result.comments || 0} Replies
            </span>
            {result.publishedAt && (
              <span className="flex items-center gap-1.5 group-hover:text-slate-300 transition-colors">
                 <Clock size={12} className="text-primary/60" /> 
                 {new Date(result.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Trigger: Bookmark */}
        <button 
          onClick={handleBookmark}
          disabled={isSaving}
          className={`p-2.5 border rounded-lg transition-all flex-shrink-0 mt-1 ${
            isSaved 
              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(6,249,6,0.3)]' 
              : 'bg-black/40 border-white/10 text-slate-500 hover:text-primary hover:border-primary/40'
          }`}
          title="Save to Encrypted Vault"
        >
          <Bookmark size={18} className={isSaved ? "fill-primary" : ""} />
        </button>
      </div>
    </motion.article>
  );
};

export default ResultCard;