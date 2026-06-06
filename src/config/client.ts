// NEXT_PUBLIC_ vars are available on client; TENANT_SLUG is server-only (used only in API fetches)
export const clientConfig = {
  tenantSlug: process.env.TENANT_SLUG ?? 'el-renuevo',
  clientName: process.env.NEXT_PUBLIC_CLIENT_NAME ?? 'Renuevo Almohadones',
  brandColor: process.env.NEXT_PUBLIC_BRAND_COLOR ?? '#9b8b75',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
    'Hola! Vi su tienda online y me interesa...',
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL ?? null,
  domain: process.env.NEXT_PUBLIC_DOMAIN ?? 'localhost:3000',
};

export type ClientConfig = typeof clientConfig;
