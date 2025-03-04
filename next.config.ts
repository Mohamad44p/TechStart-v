/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 3600,
    },
    optimizeCss: true,
    optimisticClientCache: true,
    webVitalsAttribution: ["CLS", "LCP"],
    optimizePackageImports: ["@/components/ui", "lodash", "framer-motion"],
    optimizeServerReact: true,
    scrollRestoration: true,
    mdxRs: true,
    ppr: true,
    reactCompiler: true,
  },
  bundlePagesRouterDependencies: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.techstart.ps",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipsd.ps",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Accept-Ranges",
            value: "bytes",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'clipboard-write=self'
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'self';",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://www.youtube-nocookie.com https://*.ytimg.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: http:;
              media-src 'self' blob: https: http:;
              frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
              connect-src 'self' https:;
              worker-src 'self' blob:;
              frame-ancestors 'self';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
