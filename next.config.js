/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for react and react-dom
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Chakra UI chunk
          chakra: {
            name: 'chakra',
            test: /[\\/]node_modules[\\/](@chakra-ui|@emotion|framer-motion)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
          // Commons chunk for shared code
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      };
    }

    return config;
  },
  reactStrictMode: true,
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  
  // Optimize images
  images: {
    domains: ['www.tiktok.com', 'p16-sign-sg.tiktokcdn.com', 'p16.tiktokcdn.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  
  // Performance optimization
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
