import { useState } from 'react';
import { Copy, Check, Wallet, Building2, History as HistoryIcon, User } from 'lucide-react';
import Jazzicon from 'react-jazzicon';
import { useMovementWallet } from '../hooks/useMovementWallet';
import { Button } from '../components/common/Button';
import { PropertyCard } from '../components/common/PropertyCard';
import { TransactionCard } from '../components/common/TransactionCard';
import { PROPERTIES_DATA } from '../utils/mockData';

export default function Profile() {
  const { walletAddress } = useMovementWallet();
  console.log("Wallet address in profile:", walletAddress);
  const [activeTab, setActiveTab] = useState('listings');
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Wallet size={40} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Wallet Not Connected</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Please connect your wallet to view your profile, listings, and transaction history.
        </p>
      </div>
    );
  }

  // Mock Data for the profile
  const MY_LISTINGS = Object.values(PROPERTIES_DATA); // Using all mock properties as "my listings" for demo
  const MY_TRANSACTIONS = [
    { id: 1, type: 'buy', propertyTitle: 'Luxury Penthouse', amount: 35000, date: 'Mar 10, 2025', status: 'completed' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-slate-100 overflow-hidden">
             <Jazzicon diameter={128} seed={parseInt(walletAddress.slice(2, 10), 16)} />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">User {walletAddress.slice(0, 6)}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 font-mono text-sm">
                {walletAddress}
              </span>
              <button 
                onClick={handleCopyAddress}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                title="Copy Address"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-6 py-3 bg-slate-900 rounded-2xl text-white min-w-[160px]">
                <p className="text-sm text-slate-400 mb-1">Total Balance</p>
                <div className="flex items-end gap-2">
                   <h3 className="text-2xl font-bold">2,450</h3>
                   <span className="text-sm font-medium text-slate-500 mb-1">MOVE</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl min-w-[140px]">
                <p className="text-sm text-slate-500 mb-1">Properties</p>
                <h3 className="text-2xl font-bold text-slate-900">3</h3>
              </div>
              <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl min-w-[140px]">
                <p className="text-sm text-slate-500 mb-1">Total Income</p>
                <h3 className="text-2xl font-bold text-slate-900">450 <span className="text-xs text-slate-400 font-normal">MOVE</span></h3>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="w-full md:w-auto">Edit Profile</Button>
            <Button variant="ghost" className="w-full md:w-auto text-red-500 hover:bg-red-50 hover:text-red-600">Report Issue</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 space-y-1">
            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'listings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Building2 size={18} /> My Properties
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'history' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <HistoryIcon size={18} /> Transaction History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'settings' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <User size={18} /> Account Settings
            </button>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">My Properties</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {MY_LISTINGS.map(p => (
                   <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
              <div className="space-y-4">
                {MY_TRANSACTIONS.map(tx => (
                  <TransactionCard key={tx.id} transaction={tx} />
                ))}
                {MY_TRANSACTIONS.length === 0 && (
                   <div className="text-center py-12 text-slate-500">No transactions found.</div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
               Settings module coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
