'use client';

import { OrderSummary, PrimaryButton, GhostButton } from './CheckoutSharedUI';

interface StepWhatsAppConfirmProps {
  onBack: () => void;
  onSubmit: (paymentMethod: string) => Promise<void>;
  isSubmitting: boolean;
  apiError: string | null;
}

// ── Step 3 (Distribuidora Nehemías): confirmación por WhatsApp ──────────────────
// Sin selector de método de pago con tarjeta — el pedido se confirma por
// WhatsApp, el backend decide la URL de redirección vía `checkoutUrl`.
export function StepWhatsAppConfirm({
  onBack,
  onSubmit,
  isSubmitting,
  apiError,
}: StepWhatsAppConfirmProps) {
  return (
    <div className='space-y-3'>
      {/* En desktop el resumen está en la sidebar — aquí solo mobile */}
      <div className='md:hidden'>
        <OrderSummary />
      </div>

      {apiError && (
        <p
          className='text-[12px] px-3 py-2 rounded-[10px]'
          style={{ color: 'var(--error)', background: 'rgba(185,99,99,.08)' }}>
          {apiError}
        </p>
      )}

      <PrimaryButton
        type='button'
        onClick={() => onSubmit('whatsapp')}
        disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : 'Confirmar pedido por WhatsApp'}
      </PrimaryButton>
      <GhostButton type='button' onClick={onBack}>
        Volver
      </GhostButton>
    </div>
  );
}
