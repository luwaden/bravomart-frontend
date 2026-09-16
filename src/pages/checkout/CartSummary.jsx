import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { formatNaira } from '../../components/ui/Price';

export default function CartSummary({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  calculateItemShippingFee,
  calculateItemDistance,
  productsTotal,
  totalShippingFee,
  platformFee,
  grandTotal,
  isMultiPickup,
}) {
  return (
    <div className="space-y-4">
      {/* Cart item list */}
      <div className="card p-4 sm:p-6">
        <h3 className="mb-4 flex items-center justify-between text-sm font-medium text-ink">
          <span>Cart items ({cartItems.length})</span>
          <span className="text-xs font-normal text-ink-faint">Quantities</span>
        </h3>

        {cartItems.length > 0 ? (
          <div className="divide-y divide-line">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-3 first:pt-0 text-xs">
                {item.image && (
                  <img src={item.image} alt={item.title} className="h-12 w-12 shrink-0 rounded object-cover sm:h-14 sm:w-14" />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-medium text-ink">{item.title || 'Cart item'}</h4>
                  <p className="text-[11px] text-ink-faint">
                    Weight: {item.weightKg || 1}kg · Distance: {calculateItemDistance(item)}km
                  </p>
                  <p className="mt-0.5 font-semibold text-moss-700">
                    {formatNaira(item.salePrice || 15000)} each
                  </p>
                </div>
                <div className="flex shrink-0 items-center overflow-hidden rounded border border-line-strong bg-paper-mist">
                  <button type="button" onClick={() => onUpdateQuantity(idx, -1)} className="p-1.5 text-ink-soft hover:bg-paper-sunk cursor-pointer">
                    <Minus size={12} />
                  </button>
                  <span className="px-2 text-xs font-medium sm:px-3">{item.quantity || 1}</span>
                  <button type="button" onClick={() => onUpdateQuantity(idx, 1)} className="p-1.5 text-ink-soft hover:bg-paper-sunk cursor-pointer">
                    <Plus size={12} />
                  </button>
                </div>
                <div className="shrink-0 text-right">
                  <span className="block font-semibold text-ink">
                    {formatNaira((item.salePrice || 15000) * (item.quantity || 1))}
                  </span>
                  <button type="button" onClick={() => onRemoveItem(idx)} className="mt-1 ml-auto block text-[11px] text-clay hover:underline cursor-pointer">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-ink-faint">
            Your cart is empty. Add products to proceed.
          </div>
        )}
      </div>

      {/* Pricing breakdown */}
      <div className="card space-y-5 p-4 sm:p-6">
        <h3 className="border-b border-line pb-3 text-sm font-medium text-ink">Order price summary</h3>

        <div className="space-y-3 border-b border-line pb-4 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Itemized shipping</h4>
            {isMultiPickup && <span className="badge-moss">5% multi-pickup discount</span>}
          </div>

          {cartItems.length > 0 ? (
            <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
              {cartItems.map((item, idx) => {
                const itemDist = calculateItemDistance(item);
                const itemShipping = calculateItemShippingFee(item);
                return (
                  <div key={idx} className="space-y-1 rounded bg-paper-mist p-2.5">
                    <div className="flex justify-between font-medium text-ink">
                      <span className="truncate pr-2">{item.title || `Product #${idx + 1}`}</span>
                      <span>{formatNaira((item.salePrice || 15000) * (item.quantity || 1))}</span>
                    </div>
                    <div className="flex justify-between border-t border-line/60 pt-1 text-[10px] text-ink-faint">
                      <span>{itemDist}km × {item.weightKg || 1}kg × rate</span>
                      <span className="font-medium text-ink-soft">Shipping: {formatNaira(itemShipping)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded bg-paper-mist p-2.5 text-center text-[11px] italic text-ink-faint">
              No items in cart.
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-ink-soft">
            <span>Products subtotal</span>
            <span className="font-medium text-ink">{formatNaira(productsTotal)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Distance-based shipping</span>
            <span className="font-medium text-ink">{formatNaira(totalShippingFee)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Platform service charge (3%)</span>
            <span className="font-medium text-ink">{formatNaira(platformFee)}</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3 text-sm font-medium text-ink">
            <span>Total payable</span>
            <span className="font-display text-lg text-moss-700 sm:text-xl">{formatNaira(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
