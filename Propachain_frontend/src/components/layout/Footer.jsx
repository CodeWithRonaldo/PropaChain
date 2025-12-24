import { Hexagon, Twitter, Github, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Hexagon className="text-accent" fill="currentColor" size={24} />
              <span className="text-xl font-bold text-white">PropATradeX</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              The future of real estate trading on the Movement blockchain. Zero fees, instant settlement.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PropATradeX. All rights reserved. Built on MOVE.
        </div>
      </div>
    </footer>
  );
};
