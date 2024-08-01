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
    experimental: {
        serverComponentsExternalPackages: ["pino", "pino-pretty"],
    },
};

export default nextConfig;
