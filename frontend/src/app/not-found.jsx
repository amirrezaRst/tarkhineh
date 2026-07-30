import Link from "next/link";
import { SearchIcon } from "@/assets/Icons";

export const metadata = {
    title: "صفحه پیدا نشد",
};

const NotFound = () => {
    return (
        <div className="container min-h-[70vh] flex flex-col items-center justify-center text-center gap-5 py-16">
            <div className="w-20 h-20 rounded-full bg-primary-subtle flex items-center justify-center">
                <SearchIcon className="w-9 h-9 fill-primary" />
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
                <p className="text-muted-fg text-super-sm max-w-md">
                    ممکن است لینک اشتباه باشد یا این صفحه جابه‌جا شده باشد.
                </p>
            </div>

            <Link
                href="/"
                className="inline-block bg-primary text-white rounded-lg py-2.5 px-8 text-super-sm font-medium hover:bg-primary-hover transition-colors mt-2"
            >
                بازگشت به صفحه اصلی
            </Link>
        </div>
    );
};

export default NotFound;
