import CopyPlugin from "copy-webpack-plugin";

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
    webpack: function (config, options) {
        config.plugins = [
            ...config.plugins,
            new CopyPlugin({
                patterns: [
                    {
                        from: "node_modules/marvinjs/editor.html",
                        to: "public/asds"
                    }
                ],
            }),
        ];
        return config;
    },
};

export default nextConfig;
