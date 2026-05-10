/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useWalletStore } from './hooks/use-wallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Wallet, LayoutDashboard } from 'lucide-react';

const queryClient = new QueryClient();

import { HomePage } from './pages/HomePage';
const ProductPage = lazy(() => import('./pages/ProductPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function Layout({ children }: { children: React.ReactNode }) {
  const { balance, fetchWallet } = useWalletStore();

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 flex flex-col overflow-x-hidden">
      <header className="px-6 py-6 border-b border-slate-100 bg-slate-50 sticky top-0 z-50">
        <div className="max-w-[1024px] mx-auto flex items-center justify-between gap-4 w-full">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-5 h-5 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 hidden sm:block">CHOSE<span className="text-blue-600">PHONE</span></span>
          </Link>
          
          <nav className="flex items-center gap-3">
            <Link to="/admin" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest hidden sm:flex mr-4 bg-white/50 px-4 py-2 rounded-xl">
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>

            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Wallet Balance</p>
                <p className="text-sm font-bold text-slate-900 leading-none">Rs. {balance.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="sm:hidden font-bold text-sm text-slate-900">
                Rs. {balance.toLocaleString()}
              </div>
            </div>
            <div className="w-11 h-11 bg-slate-200 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 hidden sm:block">
              <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-24 flex flex-col">
        {children}
      </main>
      
      <footer className="mt-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-medium border-t border-slate-200 bg-slate-50 max-w-[1024px] mx-auto w-full gap-4 text-center sm:text-left">
        <div className="flex gap-6 uppercase tracking-widest">
          <span>Real-time Stock Tracking: ACTIVE</span>
          <span className="hidden sm:inline">Exchange Rate: 1 USD = 280.45 PKR</span>
        </div>
        <div>
          © 2024 CHOSEPHONE PLATFORM • PREMIUM PERFORMANCE HARDWARE DATABASE • MADE BY AHMAD KHAN
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Suspense fallback={<div className="h-[50vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
