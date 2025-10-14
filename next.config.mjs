/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com'],
  },
  // Silenciar warnings específicos
  eslint: {
    ignoreDuringBuilds: true, // ← ESTA LÍNEA
  },
  typescript: {
    ignoreBuildErrors: true, // ← Y ESTA (por si acaso)
  },
}

export default nextConfig