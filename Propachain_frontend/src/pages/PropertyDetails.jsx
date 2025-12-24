import { useParams } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Share2, Heart, FileText, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { PurchaseModal } from '../components/features/PurchaseModal';
import { PROPERTIES_DATA } from '../utils/mockData';
import { useState } from 'react';

export default function PropertyDetails() {
  const { id } = useParams();
  const property = PROPERTIES_DATA[1]; // Mocking using ID 1 for now as we don't have full data store
  const [activeImage, setActiveImage] = useState(0);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  if (!property) return <div>Property not found</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-slate-500">
            <MapPin size={18} className="mr-1" />
            {property.location}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-white"><Share2 size={18} /></Button>
          <Button variant="secondary" className="bg-white"><Heart size={18} /></Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Gallery & Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm">
              <img 
                src={property.images[activeImage]} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {property.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Property Features</h3>
            <div className="grid grid-cols-3 gap-6 mb-6">
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-slate-50 rounded-xl text-slate-500"><Bed size={24} /></div>
                 <div>
                   <p className="text-sm text-slate-500">Bedrooms</p>
                   <p className="font-semibold text-slate-900">{property.beds}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-slate-50 rounded-xl text-slate-500"><Bath size={24} /></div>
                 <div>
                   <p className="text-sm text-slate-500">Bathrooms</p>
                   <p className="font-semibold text-slate-900">{property.baths}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <div className="p-3 bg-slate-50 rounded-xl text-slate-500"><Square size={24} /></div>
                 <div>
                   <p className="text-sm text-slate-500">Square Area</p>
                   <p className="font-semibold text-slate-900">{property.sqft} sqft</p>
                 </div>
               </div>
            </div>
            <h4 className="font-medium text-slate-900 mb-2">Description</h4>
            <p className="text-slate-600 leading-relaxed mb-6">
              {property.description}
            </p>
            
            <h4 className="font-medium text-slate-900 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Property Documents (IPFS)</h3>
            <div className="space-y-3">
              {property.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700">{doc.name}</p>
                      <p className="text-xs text-slate-400">{doc.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Action Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 sticky top-24">
            <div className="flex justify-between items-center mb-6">
               <StatusBadge status={property.status} />
               <span className="text-xs font-mono text-slate-400">ID: #{property.id.toString().padStart(4, '0')}</span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-slate-500 mb-1">Buy Price</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">${property.price.toLocaleString()}</span>
                <span className="text-sm font-medium text-slate-400 mb-1">MOVE</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button 
                className="w-full text-lg h-12"
                onClick={() => setIsPurchaseModalOpen(true)}
              >
                Buy Property Now
              </Button>
              <Button variant="secondary" className="w-full text-lg h-12">
                Rent for ${property.rentPrice}/mo
              </Button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-start gap-3">
                 <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                 <div>
                   <p className="text-sm font-semibold text-slate-900">Protected by Escrow</p>
                   <p className="text-xs text-slate-500 mt-1">
                     Funds are held in a smart contract until all conditions are met and ownership is transferred.
                   </p>
                 </div>
               </div>
            </div>

             {/* Example Countdown for Rental (Hidden if not relevant, showing for demo) */}
             <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3 text-slate-900 font-medium">
                  <Clock size={16} /> Auction / Rental Ends
                </div>
                <CountdownTimer targetDate={new Date(Date.now() + 86400000 * 3)} className="justify-between" />
             </div>
          </div>
        </div>
      </div>
      
      <PurchaseModal 
        isOpen={isPurchaseModalOpen} 
        onClose={() => setIsPurchaseModalOpen(false)}
        property={property}
      />
    </div>
  );
}
