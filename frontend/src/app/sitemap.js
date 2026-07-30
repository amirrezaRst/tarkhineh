const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Runs at request time (revalidated hourly), so a newly-added branch shows up
// in the sitemap without a redeploy.
export const revalidate = 3600;

export default async function sitemap() {
    const staticRoutes = [
        { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
        { url: `${BASE_URL}/branches`, changeFrequency: "daily", priority: 0.9 },
        { url: `${BASE_URL}/menus`, changeFrequency: "daily", priority: 0.9 },
        { url: `${BASE_URL}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    ];

    let branchRoutes = [];
    try {
        const res = await fetch(`${API_URL}/branch`, { next: { revalidate: 3600 } });
        const { branches } = await res.json();
        branchRoutes = (branches || []).flatMap((b) => [
            { url: `${BASE_URL}/branches?branch=${b._id}`, changeFrequency: "daily", priority: 0.8 },
            { url: `${BASE_URL}/menus?branch=${b._id}`, changeFrequency: "daily", priority: 0.8 },
        ]);
    } catch {
        // Sitemap generation shouldn't fail the whole route if the API is
        // briefly unreachable — just ship the static routes that request.
    }

    return [...staticRoutes, ...branchRoutes];
}
