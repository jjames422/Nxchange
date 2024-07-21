/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      import('./scripts/testDatabaseConnection.js').then(module => module.default());
    }
    console.log('DATABASE_URL:', process.env.DATABASE_URL); // Add this line
    return config;
  },
};

export default nextConfig;
