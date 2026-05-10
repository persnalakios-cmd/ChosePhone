import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { BrandLogo } from "./BrandLogo";

interface ProductCardProps {
  product: any;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const x = useMotionValue(150);
  const y = useMotionValue(150);

  const rotateX = useTransform(y, [0, 300], [15, -15]);
  const rotateY = useTransform(x, [0, 300], [-15, 15]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <motion.div
        className="h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouse}
        onMouseLeave={() => {
          x.set(150);
          y.set(150);
        }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="h-full flex flex-col shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200 border border-slate-100 transition-all duration-300 rounded-[32px] bg-white overflow-hidden group">
          <div className="aspect-[4/5] bg-slate-50 flex items-center justify-center relative p-8">
            <motion.div
              style={{ translateZ: 50 }}
              className="w-full h-full relative"
            >
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              {/* Using CSS 3D illusion for Phone Image since we don't have custom assets */}
              <div className="w-full h-full border-[6px] border-slate-900 rounded-[2rem] bg-slate-900 relative shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1/3 h-[20px] bg-black rounded-b-xl z-20"></div> {/* Notch */}
                <div className="w-full h-full bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                  <BrandLogo brand={product.brand} className="w-16 h-16 text-slate-800/15" />
                </div>
              </div>
            </motion.div>
          </div>
          <CardContent className="p-6 flex-1">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">{product.brand}</p>
            <h3 className="font-semibold text-xl text-slate-900 mb-2 truncate">{product.model}</h3>
            <p className="text-blue-600 font-bold text-lg">Rs. {product.price_pkr.toLocaleString()}</p>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0 mt-auto">
            <Button 
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 shadow-md hover:shadow-lg transition-all"
            >
              View Specifications
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
