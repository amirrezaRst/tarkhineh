import { Vazirmatn } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import { Suspense } from "react";

export const metadata = {
  title: "ترخینه | سفارش آنلاین غذای سالم و گیاهی",
  description: "ترخینه، سفارش آنلاین غذای سالم و گیاهی از نزدیک‌ترین شعبه به شما.",
};

const vazir = Vazirmatn({ subsets: ["arabic"] });


export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body
        className={`${vazir.className} antialiased`} dir="rtl"
      >
        <Suspense fallback={
          <div className="w-full h-screen flex items-center justify-center">
            <h1 className="text-2xl font-medium text-green-500">Loading...</h1>
          </div>
        }>
          <MainLayout>
            {children}
          </MainLayout>
        </Suspense>
      </body>
    </html>
  );
}
