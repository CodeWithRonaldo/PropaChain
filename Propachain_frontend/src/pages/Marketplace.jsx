import { Search, SlidersHorizontal, Map } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PropertyCard } from '../components/common/PropertyCard';
import { useState } from 'react';

// Mock Data
const ALL_PROPERTIES = [
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
    status: 'Rented'
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
    status: 'Available'
  },
  {
    id: 4,
    title: "Urban Loft with City View",
    location: "Arts District, Metro City",
    price: 650000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
    beds: 2,
    baths: 2,
    sqft: 1400,
    status: 'Available'
  },
  {
    id: 5,
    title: "Suburban Family Home",
    location: "Maple Grove, Suburbia",
    price: 480000,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800",
    beds: 4,
    baths: 2.5,
    sqft: 2800,
    status: 'Escrow'
  },
  {
    id: 6,
    title: "Mountain Retreat Cabin",
    location: "Alpine Heights, Mountain State",
    price: 720000,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    beds: 3,
    baths: 2,
    sqft: 1800,
    status: 'Available'
  }
];

export default function Marketplace() {
  const [filterType, setFilterType] = useState('all'); // all, buy, rent

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
          <p className="text-slate-500">Discover and trade real estate on MOVE.</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-slate-100 p-1 rounded-lg flex">
             <button 
               onClick={() => setFilterType('all')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
               All
             </button>
             <button 
               onClick={() => setFilterType('buy')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === 'buy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Buy
             </button>
             <button 
               onClick={() => setFilterType('rent')}
               className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === 'rent' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Rent
             </button>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 h-fit">
          <div className="flex items-center gap-2 text-slate-900 font-semibold pb-4 border-b border-slate-100">
            <SlidersHorizontal size={20} />
            Filters
          </div>
          
          <div className="space-y-4">
            <Input label="Search Location" placeholder="City, Zip..." icon={Search} />
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Min" type="number" />
                <Input placeholder="Max" type="number" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Property Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  House
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  Apartment
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
                  Condo
                </label>
              </div>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        {/* Property Grid */}
        <div className="flex-1">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ALL_PROPERTIES.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
             <Button variant="secondary">Load More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
