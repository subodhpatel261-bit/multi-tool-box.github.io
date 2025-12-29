
import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  variant?: 'normal' | 'compact';
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick, variant = 'normal' }) => {
  if (variant === 'compact') {
    return (
      <div 
        onClick={onClick}
        className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group text-center flex flex-col items-center ring-1 ring-slate-100"
      >
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {tool.icon}
        </div>
        <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors truncate w-full px-2">
          {tool.name}
        </h4>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white p-7 rounded-[2rem] cursor-pointer border border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-200/40 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start gap-5 group ring-1 ring-slate-200 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl"></div>
      
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all duration-500 shadow-sm relative z-10">
        {tool.icon}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-[1000] text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">
          {tool.name}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium">
          {tool.description}
        </p>
      </div>
      
      <div className="mt-auto pt-6 flex items-center justify-between w-full relative z-10 border-t border-slate-50">
        <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-[0.15em] group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {tool.category}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all transform group-hover:translate-x-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
