
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';

interface HeaderProps {
  onSearch: (val: string) => void;
  searchQuery: string;
  onReset: () => void;
  onCategorySelect: (cat: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, searchQuery, onReset, onCategorySelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between gap-8">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          onClick={onReset}
        >
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl group-hover:scale-110 transition-all shadow-lg shadow-blue-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <span className="text-2xl font-[1000] tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            MultiTool Box
          </span>
        </div>

        {/* Website Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-500">
          <div className="relative group py-2">
            <button className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
              Categories
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-4">
              <div className="grid grid-cols-1 gap-1">
                {CATEGORIES.slice(1).map(cat => (
                  <button 
                    key={cat}
                    onClick={() => onCategorySelect(cat)}
                    className="text-left px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-blue-600 font-bold transition-all text-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <a href="#" className="hover:text-blue-600 transition-colors">Enterprise</a>
          <a href="#" className="hover:text-blue-600 transition-colors">API</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Blog</a>
        </nav>

        {/* Action Area */}
        <div className="flex items-center gap-4 flex-grow max-w-sm justify-end">
          <div className="hidden md:flex relative group w-full">
            <input 
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-2xl outline-none transition-all text-sm font-medium"
            />
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <button className="hidden sm:flex bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-200 flex-shrink-0">
            Sign In
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 p-4 space-y-4 animate-in slide-in-from-top-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 6).map(cat => (
              <button 
                key={cat} 
                onClick={() => { onCategorySelect(cat); setIsMenuOpen(false); }}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600"
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700">Enterprise</button>
            <button className="p-3 bg-slate-900 text-white rounded-xl text-sm font-bold">Sign In</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
