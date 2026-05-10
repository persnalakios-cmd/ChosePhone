import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useWalletStore } from '../hooks/use-wallet';
import { Check, AlertCircle, ShoppingBag, ArrowLeft, Battery, Cpu, Camera, Smartphone, Wifi } from 'lucide-react';
import { motion } from 'motion/react';
import { BrandLogo } from '../components/BrandLogo';
import { PhoneModelViewer } from '../components/PhoneModelViewer';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { balance, user, fetchWallet } = useWalletStore();
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // checkout form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    }
  });

  const parsedSpecs = product?.specs ? JSON.parse(product.specs) : {};

  const handlePurchase = async () => {
    if (!user) return setError('User not authenticated');
    if (balance < product.price_pkr) return setError('Insufficient wallet balance');
    if (!buyerName || !buyerEmail || !buyerPhone || !buyerAddress) return setError('Please fill all buyer details');

    setPurchasing(true);
    setError('');
    
    try {
      const res = await fetch(`/api/purchase/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, buyerName, buyerEmail, buyerPhone, buyerAddress })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setSuccess(true);
      await fetchWallet(); // Refresh balance
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (e: any) {
      setError(e.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (isLoading) return <div className="h-[50vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-[1024px] mx-auto px-6 py-8">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Product Images / 3D Display area */}
        <motion.div 
          className="sticky top-28 aspect-[4/5] bg-white rounded-[3rem] p-2 lg:p-4 border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative group transition-transform duration-500 hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-slate-100 pointer-events-none"></div>
          <div className="w-full h-full relative z-10 rounded-[2.5rem] overflow-hidden">
            <PhoneModelViewer brand={product.brand} model={product.model} />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm z-20 pointer-events-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interactive 3D Viewer</span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </motion.div>

        {/* Product Details & Checkout */}
        <div className="flex flex-col">
          <p className="text-xs text-blue-600 uppercase tracking-widest font-bold mb-3">{product.brand}</p>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            {product.model}
          </h1>
          
          <div className="flex items-end gap-4 mb-8 pb-8 border-b border-slate-200">
            <span className="text-3xl lg:text-4xl font-black text-slate-900">
              Rs. {product.price_pkr.toLocaleString()}
            </span>
            <span className={`text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-1 lg:mb-1.5 ${product.stock_count > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.stock_count > 0 ? `In Stock (${product.stock_count})` : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-8">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4">Key Specifications</h3>
            
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
               {parsedSpecs.display && (
                 <div className="bg-white p-3 lg:p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                     <Smartphone className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Display</p>
                     <p className="text-xs lg:text-sm font-bold text-slate-900">{parsedSpecs.display}</p>
                   </div>
                 </div>
               )}
               {parsedSpecs.chipset && (
                 <div className="bg-white p-3 lg:p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                     <Cpu className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Chipset</p>
                     <p className="text-xs lg:text-sm font-bold text-slate-900">{parsedSpecs.chipset}</p>
                   </div>
                 </div>
               )}
               {parsedSpecs.camera && (
                 <div className="bg-white p-3 lg:p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                     <Camera className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Camera</p>
                     <p className="text-xs lg:text-sm font-bold text-slate-900">{parsedSpecs.camera}</p>
                   </div>
                 </div>
               )}
               {parsedSpecs.battery && (
                 <div className="bg-white p-3 lg:p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                     <Battery className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Battery</p>
                     <p className="text-xs lg:text-sm font-bold text-slate-900">{parsedSpecs.battery}</p>
                   </div>
                 </div>
               )}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 lg:p-8 rounded-[32px] shadow-xl shadow-slate-900/20 relative overflow-hidden">
             {/* Decorative glow in checkout card */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
             
             <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-6 relative z-10">Checkout</h3>
             
             <div className="flex items-center justify-between mb-8 relative z-10">
               <div>
                  <p className="text-xs text-slate-300 font-bold mb-1">Your Wallet Balance</p>
                  <p className="text-2xl font-black">Rs. {balance.toLocaleString()}</p>
               </div>
               {balance < product.price_pkr && (
                 <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                   <AlertCircle className="w-3.5 h-3.5" /> Insufficient
                 </div>
               )}
             </div>

             {!success && (
               <div className="space-y-4 mb-8 relative z-10">
                 <h4 className="text-sm font-bold text-slate-200">Delivery Details</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="Full Name" value={buyerName} onChange={e => setBuyerName(e.target.value)} className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                   <input type="email" placeholder="Email" value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                 </div>
                 <input type="tel" placeholder="Phone Number" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                 <textarea placeholder="Delivery Address" value={buyerAddress} onChange={e => setBuyerAddress(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24"></textarea>
               </div>
             )}

             {error && <p className="text-red-400 text-[11px] uppercase tracking-wider mb-4 font-bold relative z-10">{error}</p>}

             {success ? (
               <div className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center justify-center gap-2 font-bold relative z-10">
                 <Check className="w-5 h-5" /> Purchase Successful!
               </div>
             ) : (
               <button
                 onClick={handlePurchase}
                 disabled={purchasing || product.stock_count <= 0 || balance < product.price_pkr}
                 className="w-full bg-white text-slate-900 h-14 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-50 disabled:opacity-80 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-all relative z-10"
               >
                 {purchasing ? (
                   <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <>
                     <ShoppingBag className="w-5 h-5" /> Buy Now
                   </>
                 )}
               </button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
