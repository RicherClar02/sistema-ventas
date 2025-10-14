const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
   images: {
    domains: [
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'tu-dominio-de-imagenes.com'
    ],
  },
  experimental: {
    appDir: true,
  },
  // Para PWA
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}