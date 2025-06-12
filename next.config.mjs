/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                port: '',
                pathname: '/9.x/**',
            },
        ],
    },
    serverExternalPackages: ["pino", "pino-pretty"],
    // Force webpack instead of turbopack to avoid stack overflow issues
    webpack: (config, { dev, isServer }) => {
        // Return the modified config
        return config;
    },
};

export default nextConfig;
