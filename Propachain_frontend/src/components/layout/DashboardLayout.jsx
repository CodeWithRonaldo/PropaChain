import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Building2, Wallet, History, Menu, X, LogOut, User, UploadCloud } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Jazzicon from 'react-jazzicon';
import { useMovementWallet } from '../../hooks/useMovementWallet';
import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import WalletModal from '../wallet/WalletModal';
import { Button } from '../common/Button';

const cn = (...inputs) => twMerge(clsx(inputs));

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-primary text-white shadow-lg shadow-primary/20" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon size={20} className={cn(isActive ? "text-accent" : "text-slate-400 group-hover:text-primary")} />
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { walletAddress, disconnectWallet } = useMovementWallet();
  const { authenticated, logout: privyLogout } = usePrivy();
  const { connected, disconnect: nativeDisconnect } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isPrivyWallet = authenticated;
  // const isNativeWallet = connected && !authenticated; // Logic mirrored from header.jsx reference

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleDisconnect = async () => {
    try {
      // Logic handled via disconnectWallet wrapper in useMovementWallet really, 
      // but following user reference logic for explicit logout calls if needed.
      if (authenticated) {
        await privyLogout();
      } else if (connected) {
        await nativeDisconnect();
      }
      disconnectWallet(); // Ensure local state clear
      setShowDropdown(false);
      navigate("/");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <Link to="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PropATradeX
            </h1>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarLink to="/app" icon={Home}>Dashboard</SidebarLink>
          <SidebarLink to="/app/marketplace" icon={Building2}>Marketplace</SidebarLink>
          <SidebarLink to="/app/upload" icon={UploadCloud}>List Property</SidebarLink>
          <SidebarLink to="/app/profile" icon={User}>Profile</SidebarLink>
        </nav>

        <div className="p-4 border-t border-slate-100">
          {!walletAddress ? (
             <Button 
               className="w-full" 
               onClick={() => setShowWalletModal(true)}
             >
               Connect Wallet
             </Button>
          ) : (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative" ref={dropdownRef}>
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-white flex items-center justify-center">
                  <Jazzicon diameter={32} seed={parseInt(walletAddress.slice(2, 10), 16)} />
                </div>
                <div className="flex-1 overflow-hidden">
                   <p className="text-xs text-slate-500">Connected</p>
                   <p className="text-sm font-mono text-slate-700 truncate">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                </div>
              </div>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                   <button className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-600">
                     <User size={16} /> Profile
                   </button>
                   <button 
                     onClick={handleDisconnect}
                     className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center gap-2 text-sm border-t border-slate-50"
                   >
                     <LogOut size={16} /> Disconnect
                   </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 p-4 flex items-center justify-between">
         <h1 className="text-xl font-bold text-primary">PropATradeX</h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all">
        <Outlet />
      </main>

      <WalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
    </div>
  );
}
