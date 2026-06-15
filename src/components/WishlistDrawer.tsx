import React from 'react';
import { X, Heart, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div id="wishlist-drawer-overlay" className="fixed inset-0 z-50 bg-black/60 flex justify-end">
      <div className="bg-white dark:bg-dark-card w-full max-w-md h-full flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 shadow-2xl relative transition-all duration-300">
        
        {/* Header Drawer */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center text-left">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            <span className="font-display font-black text-slate-950 dark:text-white uppercase tracking-tight text-base">
              My Wishlist
            </span>
          </div>
          <button
            id="wishlist-close-drawer-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 text-left">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-12 opacity-80">
              <span className="text-4xl text-rose-500 block">❤️</span>
              <h4 className="font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto text-center leading-normal">
                Tag your favorite high-quality electronic items with the heart icon while browsing our store, and they'll show up here!
              </p>
              <button
                id="wishlist-return-shop"
                onClick={onClose}
                className="bg-primary text-white text-xs px-5 py-2.5 font-bold rounded-xl cursor-pointer"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850">
              {wishlist.map((product, idx) => (
                <div key={product.id} className={`flex items-center space-x-3 text-xs ${idx > 0 ? 'pt-4' : ''}`}>
                  <img src={product.image} alt="" className="h-14 w-14 rounded-lg object-cover bg-slate-50 shrink-0 border" />
                  
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold font-mono">
                      {product.brand}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white truncate mt-1">{product.name}</h4>
                    <span className="font-bold text-slate-900 dark:text-white block mt-0.5 font-mono">E{product.price.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      id={`wishlist-add-to-cart-${product.id}`}
                      disabled={product.stock <= 0}
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveFromWishlist(product);
                      }}
                      className={`p-2 rounded-xl transition ${
                        product.stock <= 0 
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                          : 'bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer'
                      }`}
                      title={product.stock <= 0 ? "Out of Stock" : "Move to Cart"}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>

                    <button
                      id={`wishlist-remove-item-${product.id}`}
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info banner */}
        {wishlist.length > 0 && (
          <div className="p-5 border-t dark:border-slate-850 bg-slate-50 dark:bg-slate-900/40 text-xs text-left">
            <p className="text-[10px] text-slate-450 uppercase font-bold font-mono">⚡ QUICK INVENTORY CHECK</p>
            <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
              Items in your wishlist are held temporarily. Stock levels are live, so add them to your shopping cart to secure your purchase!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
