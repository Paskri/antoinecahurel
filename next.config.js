/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: { unoptimized: true },
    //reactStrictMode: false,
    //webpack: (config, { isServer }) => {
    //    // Exclure certains fichiers ou dossiers lors de la construction
    //    if (!isServer) {
    //        config.module.rules.push({
    //            test: /\.(txt|md|php)$/, // Ajoutez ici les extensions que vous souhaitez exclure
    //            use: 'ignore-loader',
    //        });
    //    }
    //
    //    return config;
    //},
}

module.exports = nextConfig
