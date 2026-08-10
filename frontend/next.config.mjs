// The backend serves branch/menu/courier/slide photos from a separate origin
// (NEXT_PUBLIC_IMAGE_URL) - next/image refuses to optimize a remote host
// unless it's explicitly allow-listed. Deriving the pattern from the env var
// (rather than hardcoding a host) means dev (localhost:5000) and production
// each pick up the right host automatically at build time.
const imageUrl = new URL(process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000/public");

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: imageUrl.protocol.replace(":", ""),
                hostname: imageUrl.hostname,
                port: imageUrl.port || "",
                pathname: `${imageUrl.pathname}/**`,
            },
        ],
    },
};

export default nextConfig;
