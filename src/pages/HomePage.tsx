import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../components/ProductCard';
import { Search, Activity, Cpu } from 'lucide-react';

const BRANDS = ["All", "Apple", "Samsung", "Xiaomi", "Google", "Tecno", "Infinix", "iTel"];

export function HomePage() {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('All');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', search, brand],
    queryFn: async () => {
      const res = await fetch(`/api/products?search=${search}&brand=${brand}`);
      return res.json();
    }
  });

  return (
    <div className="max-w-[1024px] mx-auto px-6 pt-8 pb-12 flex flex-col gap-6 w-full flex-1">
      
      {/* Search Bar */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search models, brands, or specs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border-none shadow-sm rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 ring-1 ring-slate-200 transition-all font-medium text-slate-900"
        />
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Hero Phone Section */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden min-h-[380px]">
          <div className="z-10 w-full md:w-1/2 mb-8 md:mb-0">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Featured Collection</span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-6 leading-tight">
              Premium <br/><span className="text-slate-400">Smartphones</span>
            </h1>
            <p className="text-slate-500 mt-4 max-w-xs text-sm">
              The ultimate database for premium performance hardware. Explore specifications and purchase with trust.
            </p>
          </div>
          
          <div className="relative w-full md:absolute md:right-[-20px] md:top-1/2 md:-translate-y-1/2 md:w-[340px] h-[300px] md:h-[480px] perspective-[1000px] flex justify-center md:block">
             <div className="w-[240px] md:w-full h-full bg-slate-800 rounded-[40px] md:rounded-[48px] border-[8px] md:border-[10px] border-slate-900 shadow-2xl relative" style={{ transform: "rotateY(-15deg) rotateX(10deg)" }}>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 md:h-6 bg-slate-900 rounded-b-2xl"></div>
               <div className="mt-10 md:mt-12 mx-3 md:mx-4 relative z-10">
                  <div className="h-32 md:h-40 w-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl opacity-80"></div>
                  <div className="mt-3 md:mt-4 flex gap-2">
                     <div className="h-16 md:h-20 flex-1 bg-slate-700 rounded-xl"></div>
                     <div className="h-16 md:h-20 flex-1 bg-slate-700 rounded-xl"></div>
                  </div>
               </div>
               <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 w-10 md:w-12 h-1 bg-slate-700 rounded-full"></div>
             </div>
          </div>
        </div>

        {/* Side Stats */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-slate-900 rounded-[32px] p-6 lg:p-8 text-white flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-bold text-lg leading-tight opacity-70">Market<br/>Analytics</h2>
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Total Models</p>
                <p className="text-xl lg:text-2xl font-black">100+</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Active Users</p>
                <p className="text-xl lg:text-2xl font-black">8.4k</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-blue-600 rounded-[32px] p-6 lg:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase opacity-80 mb-2">Top Standard</p>
              <h3 className="text-2xl font-bold mb-4">Latest Tech</h3>
              <div className="flex flex-wrap items-center gap-2 mt-auto">
                <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-medium">120Hz Displays</span>
                <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full font-medium">5G Ready</span>
              </div>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
              <Cpu className="w-40 h-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Selector Bar */}
      <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Manufacturers</h5>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BRANDS.map(b => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`rounded-2xl border flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                brand === b 
                  ? 'border-blue-500 shadow-sm shadow-blue-100 bg-blue-50/50' 
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              {/* Optional tiny icon placeholder */}
              <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center ${brand === b ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <div className={`w-3 h-3 rounded-full ${brand === b ? 'bg-blue-500' : 'bg-slate-300'}`} />
              </div>
              <span className={`text-xs font-black uppercase tracking-wider ${brand === b ? 'text-blue-600' : 'text-slate-700'}`}>{b}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid Area Section Header */}
      <div className="flex items-center justify-between px-2 pt-4">
        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Inventory</h5>
      </div>

      {/* Product Grid */}
      <div className="mt-2 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white animate-pulse rounded-3xl aspect-[3/4] w-full border border-slate-100 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
