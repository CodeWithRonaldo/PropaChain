import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { PropertyCard } from '../components/common/PropertyCard';
import { Footer } from '../components/layout/Footer';
import { useState } from 'react';
import WalletModal from '../components/wallet/WalletModal';
import { useMovementWallet } from '../hooks/useMovementWallet';

// Mock Data
const FEATURED_PROPERTIES = [
  {
    id: 1,
    title: "Luxury Penthouse in Downtown",
    location: "Downtown, Metro City",
    price: 1500000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    beds: 3,
    baths: 2,
    sqft: 2200,
    status: 'Available'
  },
  {
    id: 2,
    title: "Modern Beachfront Villa",
    location: "Coastal Bay, Sunshine State",
    price: 2800000,
    image: "https://images.unsplash.com/photo-1600596542815-6000255adeba?auto=format&fit=crop&q=80&w=800",
    beds: 5,
    baths: 4,
    sqft: 4500,
    status: 'Escrow'
  },
  {
    id: 3,
    title: "Eco-Friendly Smart Home",
    location: "Green Valley, Eco District",
    price: 950000,
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&q=80&w=800",
    beds: 4,
    baths: 3,
    sqft: 3100,
    status: 'Rented'
  }
];

export default function LandingPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { walletAddress } = useMovementWallet();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-32 pb-20 lg:pt-48 lg:pb-32">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-accent text-sm font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Live on Movement Mainnet
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            The Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-emerald-400">Real Estate Trading</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12">
            Buy, rent, and trade properties with zero fees. 
            Powered by Movement blockchain for instant solidity and security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/app/marketplace">
              <Button size="lg" className="w-full sm:w-auto text-lg shadow-accent/25">
                Explore Marketplace <ArrowRight className="ml-2" />
              </Button>
            </Link>
            {!walletAddress ? (
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto text-lg border-slate-700 bg-slate-800 text-white hover:bg-slate-700 hover:border-slate-600"
                onClick={() => setShowWalletModal(true)}
              >
                Connect Wallet
              </Button>
            ) : (
              <Link to="/app">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg border-emerald-500/50 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/30"
                >
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Instant Transactions</h3>
              <p className="text-slate-500">Zero-fee transactions finalized in seconds using the MOVE Tangle.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Smart Escrow</h3>
              <p className="text-slate-500">Automated trustless escrow services for secure property exchange.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Global Access</h3>
              <p className="text-slate-500">Trade real estate globally without intermediaries or borders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties using Carousel Layout */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Properties</h2>
              <p className="text-slate-500">Exclusive listings available for immediate purchase.</p>
            </div>
            <Link to="/app/marketplace" className="text-primary font-medium hover:text-accent transition-colors flex items-center">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROPERTIES.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      <WalletModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
    </div>
  );
}
