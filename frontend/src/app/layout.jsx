import { Vazirmatn } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { Suspense } from "react";
import { Skeleton } from "@/components/Skeleton";

const siteName = "ترخینه";
const siteDescription = "ترخینه، سفارش آنلاین غذای سالم و گیاهی از نزدیک‌ترین شعبه به شما.";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: `${siteName} | سفارش آنلاین غذای سالم و گیاهی`,
    // A page-level `export const metadata = { title: "..." }` gets this
    // appended automatically, so pages only need their own specific part.
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: ["ترخینه", "سفارش غذا", "غذای سالم", "غذای گیاهی", "رستوران زنجیره‌ای", "سفارش آنلاین غذا"],
  openGraph: {
    // images intentionally omitted — Next picks up app/opengraph-image.png
    // automatically via the file convention.
    type: "website",
    locale: "fa_IR",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const vazir = Vazirmatn({ subsets: ["arabic"] });


// The root Suspense boundary only shows on a genuinely first, cold load (slow
// connection / route-level code split) — a silhouette of the real page shell
// reads as "the site is arriving" instead of an off-brand English spinner.
const RootLoadingShell = () => (
  <div className="w-full min-h-screen">
    <div className="container flex items-center justify-between py-4">
      <Skeleton className="h-8 w-32" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
    <div className="container">
      <Skeleton className="w-full h-[300px] rounded-2xl" />
    </div>
    <div className="container grid xl:grid-cols-4 md:grid-cols-2 gap-5 mt-10">
      {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-[230px] rounded-lg" />)}
    </div>
  </div>
);

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body
        className={`${vazir.className} antialiased`} dir="rtl"
      >
        <Suspense fallback={<RootLoadingShell />}>
          <MainLayout>
            {children}
          </MainLayout>
        </Suspense>
      </body>
    </html>
  );
}
