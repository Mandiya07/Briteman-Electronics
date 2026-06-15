import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, ArrowLeft, Search, BookmarkCheck, Share2, Sparkles, User } from 'lucide-react';
import { BlogArticle } from '../types';

interface BlogCenterProps {
  blogs: BlogArticle[];
}

export default function BlogCenter({ blogs }: BlogCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  const categories = ['All', 'Student Technology Advice', 'Computer Maintenance Tips', 'Printer Guides'];

  const filteredBlogs = blogs.filter(b => {
    return selectedCategory === 'All' || b.category === selectedCategory;
  });

  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out this helpful guide from Briteman Electronics: "${title}"`);
      alert('Link to guide copied successfully! Share it on WhatsApp.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      
      {/* Title */}
      <div className="mb-10 text-left flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center space-x-1 bg-primary/10 px-3 py-1 rounded-full text-xs font-semibold text-primary dark:text-blue-400 mb-2">
            <Sparkles className="h-4 w-4" />
            <span>Tech Resource Center</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Briteman Guides & Buying Resource Center
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Read our helpful reviews concerning printer ink-tank models, load-shedding battery UPS backups, and laptop configurations suitable for Eswatini colleges.
          </p>
        </div>

        {activeArticle && (
          <button
            id="back-to-guides-btn"
            onClick={() => setActiveArticle(null)}
            className="flex items-center space-x-1 text-xs text-primary hover:text-accent font-bold bg-white dark:bg-slate-800 border p-2.5 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Guides directory</span>
          </button>
        )}
      </div>

      {activeArticle ? (
        /* Full Article reading view */
        <div id="active-article-view" className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <span className="text-xs bg-primary/10 text-primary dark:text-accent font-bold px-2.5 py-1 rounded uppercase tracking-wider block w-fit">
              {activeArticle.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 dark:text-white leading-tight font-display">
              {activeArticle.title}
            </h1>
            
            <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{activeArticle.date}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{activeArticle.readTime}</span>
              </span>
              <span className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Briteman Staff Writer</span>
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100">
            <img src={activeArticle.image} alt="" className="h-full w-full object-cover" />
          </div>

          {/* Render article contents formatted */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
            {activeArticle.content.split('\n\n').map((para, i) => {
              if (para.startsWith('###')) {
                return <h3 key={i} className="text-lg font-bold text-slate-900 dark:text-white pt-4">{para.replace('###', '').trim()}</h3>;
              }
              if (para.startsWith('*')) {
                return (
                  <ul key={i} className="list-disc pl-5 space-y-1">
                    {para.split('\n').map((li, j) => (
                      <li key={j}>{li.replace('*', '').trim()}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{para}</p>;
            })}
          </div>

          <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center text-xs">
            <button
              id="article-back-btn-bottom"
              onClick={() => setActiveArticle(null)}
              className="text-slate-500 hover:text-primary font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Guides Directory</span>
            </button>
            <button
              id="article-share-btn"
              onClick={() => handleShare(activeArticle.title)}
              className="text-primary hover:text-accent font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      ) : (
        /* Guides directory view */
        <div className="space-y-6">
          
          {/* Quick Filters category row */}
          <div className="flex flex-wrap gap-2 pb-2 border-b dark:border-slate-850">
            {categories.map(cat => (
              <button
                id={`blog-cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-4 py-2 rounded-xl border transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-white font-semibold border-primary'
                    : 'bg-white dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredBlogs.map((b) => (
              <div
                id={`blog-card-${b.id}`}
                key={b.id}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100">
                    <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-[9px] px-2.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                      {b.category.split(' ')[0]}
                    </span>
                  </div>

                  <div className="p-5 space-y-2 text-left">
                    <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                      <span>{b.date}</span>
                      <span>•</span>
                      <span>{b.readTime}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-base hover:text-primary transition line-clamp-2 leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex justify-between items-center border-t dark:border-slate-850">
                  <button
                    id={`blog-read-btn-${b.id}`}
                    onClick={() => setActiveArticle(b)}
                    className="text-xs text-primary dark:text-blue-300 hover:text-accent font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    id={`blog-share-btn-${b.id}`}
                    onClick={() => handleShare(b.title)}
                    className="text-slate-400 hover:text-slate-600 transition"
                    title="Share Guide"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
