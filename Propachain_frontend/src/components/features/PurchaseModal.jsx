import { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle, ArrowRight, Loader2, FileText, Download } from 'lucide-react';
import { Button } from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = {
  REVIEW: 0,
  ESCROW: 1,
  PAYMENT: 2,
  SUCCESS: 3
};

export const PurchaseModal = ({ isOpen, onClose, property }) => {
  const [step, setStep] = useState(STEPS.REVIEW);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(STEPS.REVIEW);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleCreateEscrow = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep(STEPS.ESCROW);
    }, 1500);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    // Simulate Blockchain Transaction
    setTimeout(() => {
      setStep(STEPS.PAYMENT);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(STEPS.SUCCESS);
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">
            {step === STEPS.SUCCESS ? 'Purchase Successful' : 'Complete Purchase'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary' : 'bg-slate-100'}`} 
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === STEPS.REVIEW && (
              <motion.div 
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <img src={property.images[0]} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold text-slate-900">{property.title}</h3>
                    <p className="text-sm text-slate-500">{property.location}</p>
                    <p className="text-primary font-bold mt-1">${property.price.toLocaleString()} MOVE</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Property Price</span>
                    <span>${property.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (0%)</span>
                    <span className="text-emerald-500">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee (MOVE)</span>
                    <span>~ $0.00</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-base">
                    <span>Total</span>
                    <span>${property.price.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4" 
                  onClick={handleCreateEscrow}
                  isLoading={isProcessing}
                >
                  Create Escrow Contract
                </Button>
              </motion.div>
            )}

            {step === STEPS.ESCROW && (
              <motion.div 
                key="escrow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Escrow Contract Created</h3>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                  Smart contract deployed at <span className="font-mono bg-slate-100 px-1 rounded">0x3f...e2a</span>. 
                  Waiting for your confirmation to proceed.
                </p>
                <Button 
                  className="w-full" 
                  onClick={handleConfirmPayment}
                >
                  Sign & Pay <ArrowRight className="ml-2" size={16} />
                </Button>
              </motion.div>
            )}
            
            {(step === STEPS.PAYMENT) && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-8"
              >
                 <Loader2 size={48} className="animate-spin text-primary mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-slate-900">Processing Transaction</h3>
                 <p className="text-slate-500 text-sm">Validating on Movement Network...</p>
              </motion.div>
            )}

            {step === STEPS.SUCCESS && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Purchase Complete!</h3>
                <p className="text-slate-500 mb-6">You are now the owner of this property.</p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="text-slate-400" size={20} />
                    <span className="font-semibold text-slate-700">Receipt NFT Minted</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-8">
                    An NFT representing your ownership receipt has been minted to your wallet.
                  </p>
                </div>

                <div className="space-y-3">
                   <Button variant="secondary" className="w-full">
                     <Download size={16} className="mr-2" /> Download Deed
                   </Button>
                   <Button className="w-full" onClick={onClose}>
                     Go to Dashboard
                   </Button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </motion.div>
      
    </div>
  );
};
