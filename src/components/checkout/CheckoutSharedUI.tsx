'use client';

import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/format';

// ── Mini resumen ──────────────────────────────────────────────────────────────
export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const shipping = total > 60000 ? 0 : 4500;
  return (
    <div
      className='rounded-[14px] p-4 mb-4'
      style={{ background: 'var(--marfil)' }}>
      <p
        className='text-[10px] tracking-[.16em] uppercase font-semibold mb-3'
        style={{ color: 'var(--tx-faint)' }}>
        Resumen del pedido
      </p>
      {items.map(({ product, quantity }) => (
        <div
          key={product.id}
          className='flex justify-between text-[12.5px] mb-1.5'>
          <span style={{ color: 'var(--tx-soft)' }}>
            {product.name} × {quantity}
          </span>
          <span>${formatPrice(product.price * quantity)}</span>
        </div>
      ))}
      <div
        style={{ height: 1, background: 'var(--line-soft)', margin: '10px 0' }}
      />
      <div className='flex justify-between text-[12.5px] mb-1.5'>
        <span style={{ color: 'var(--tx-soft)' }}>Envío</span>
        <span style={{ color: shipping === 0 ? 'var(--exito)' : 'var(--tx)' }}>
          {shipping === 0 ? 'Gratis' : `$${formatPrice(shipping)}`}
        </span>
      </div>
      <div
        className='flex justify-between font-semibold mt-2'
        style={{ fontSize: 15, color: 'var(--marron)' }}>
        <span>Total</span>
        <span>${formatPrice(total + shipping)}</span>
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className='w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.12em] uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-60'
      style={{ background: 'var(--taupe)' }}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className='w-full py-4 rounded-[10px] text-[12.5px] font-semibold tracking-[.1em] uppercase transition-colors'
      style={{
        border: '1px solid var(--line)',
        color: 'var(--marron)',
        background: 'transparent',
      }}>
      {children}
    </button>
  );
}
