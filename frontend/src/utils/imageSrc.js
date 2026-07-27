// Resolve an image reference to a usable src.
// - Already a URL/absolute path ("/…" or "http…") -> used as-is (DB branch
//   images resolved by the caller, or legacy local "/images/…").
// - A bare filename -> prefixed: branch galleries fall back to the local
//   /images folder, everything else to the API's /public image host.
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

export const resolveImg = (image, isBranchGallery = false) => {
    if (!image) return "";
    if (image.startsWith("/") || image.startsWith("http")) return image;
    return isBranchGallery ? `/images/${image}` : `${IMAGE_URL}/${image}`;
};
