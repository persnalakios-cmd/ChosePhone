import React from 'react';
import { Apple, Smartphone } from 'lucide-react';

export function BrandLogo({ brand, className }: { brand: string, className?: string }) {
  const b = brand.toLowerCase();
  
  if (b.includes('apple')) {
    return <Apple className={className} />;
  }
  if (b.includes('samsung')) {
    return (
      <svg className={className} viewBox="0 0 100 40" fill="currentColor">
        <text x="50%" y="55%" fontSize="28" fontWeight="900" textAnchor="middle" dominantBaseline="middle" letterSpacing="-1">SAMSUNG</text>
      </svg>
    );
  }
  if (b.includes('google')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
      </svg>
    );
  }
  if (b.includes('xiaomi')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect width="24" height="24" rx="4" opacity="0.2" fill="currentColor" />
        <text x="50%" y="55%" fontSize="14" fontWeight="900" textAnchor="middle" dominantBaseline="middle" letterSpacing="-0.5">mi</text>
      </svg>
    );
  }
  
  return <Smartphone className={className} />;
}
