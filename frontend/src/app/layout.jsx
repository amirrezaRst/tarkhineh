import { Vazirmatn } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { Suspense } from "react";
import { Skeleton } from "@/components/Skeleton";

export const metadata = {
  title: "ترخینه | سفارش آنلاین غذای سالم و گیاهی",
  description: "ترخینه، سفارش آنلاین غذای سالم و گیاهی از نزدیک‌ترین شعبه به شما.",
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
