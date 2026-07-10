/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — update hostname when Supabase project URL is known
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Distribuidora Victoria — CDN externo para productos de Nahuel
      {
        protocol: 'https',
        hostname: 'api.distribuidora-victoria.com.ar',
        pathname: '/uploads/**',
      },
      // Placeholder images — solo para desarrollo/demo
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
