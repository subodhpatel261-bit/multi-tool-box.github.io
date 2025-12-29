
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-slate-800 mb-4">MultiTool Box</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Your all-in-one station for digital utilities. From quick image edits to complex developer formatting, we provide high-speed, secure, and free tools for everyone.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all">FB</a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-400 hover:text-white transition-all">TW</a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-600 hover:text-white transition-all">IG</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Categories</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Image Tools</a></li>
              <li><a href="#" className="hover:text-blue-600">SEO Tools</a></li>
              <li><a href="#" className="hover:text-blue-600">Calculators</a></li>
              <li><a href="#" className="hover:text-blue-600">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">Terms of Use</a></li>
              <li><a href="#" className="hover:text-blue-600">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} MultiTool Box. Built with ❤️ for the community.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
