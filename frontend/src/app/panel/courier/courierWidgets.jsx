"use client";

import { useState } from "react";
import useUserStore from "@/stores/useUserStore";
import Card from "@/components/panel/Card";
import BarChart from "@/components/panel/charts/BarChart";
import { setAvailability } from "@/services/CourierService";

// A hairline key/value ledger inside a card — the workhorse of the panel rails.
export const LedgerCard = ({ title, rows = [] }) => (
    <Card className="p-5">
        <div className="text-super-xs font-bold text-muted-fg mb-3">{title}</div>
        <div>
            {rows.map((r, i) => (
                <div key={i} className="flex justify-between items-center gap-3 text-super-sm py-2.5 border-b border-border last:border-0">
                    <span className="text-muted-fg">{r.k}</span>
                    <span className={`font-extrabold ${r.tnum === false ? "" : "tabular-nums"}`}>{r.v}</span>
                </div>
            ))}
        </div>
    </Card>
);

// Weekly bar chart card with a total footer.
export const WeekBarsCard = ({ title, data = [], total, totalLabel = "مجموع" }) => (
    <Card className="p-5">
        <div className="flex items-end justify-between mb-2">
            <div className="text-super-xs font-bold text-muted-fg">{title}</div>
            {total != null && <div className="text-super-xs text-muted-fg">{totalLabel}: <b className="tabular-nums">{total}</b></div>}
        </div>
        <BarChart data={data} height={104} />
    </Card>
);

// Availability control for a rail — same effect as the topbar toggle, but a
// larger, thumb-friendly card. Reflects and updates the shared user store.
export const AvailabilityControl = ({ onChange }) => {
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);
    const [busy, setBusy] = useState(false);
    const online = user?.courierStatus !== "offline";

    const set = async (next) => {
        if (busy || (next === "available") === online) return;
        setBusy(true);
        await setAvailability(next, (s) => { setUser({ ...user, courierStatus: s }); onChange?.(s); });
        setBusy(false);
    };

    return (
        <Card className="p-5">
            <div className="text-super-xs font-bold text-muted-fg mb-3">وضعیت فعالیت</div>
            <div className="flex gap-2.5">
                <button onClick={() => set("available")} disabled={busy} aria-pressed={online}
                    className={`flex-1 rounded-xl py-3 text-super-sm font-extrabold border-2 transition-colors min-h-[52px] ${online ? "border-primary bg-primary-subtle text-primary" : "border-border bg-surface text-muted-fg"}`}>
                    آنلاین<span className="block text-super-xs font-medium text-subtle-fg mt-0.5">آمادهٔ دریافت</span>
                </button>
                <button onClick={() => set("offline")} disabled={busy} aria-pressed={!online}
                    className={`flex-1 rounded-xl py-3 text-super-sm font-extrabold border-2 transition-colors min-h-[52px] ${!online ? "border-muted-fg bg-surface-sunken text-muted-fg" : "border-border bg-surface text-muted-fg"}`}>
                    آفلاین<span className="block text-super-xs font-medium text-subtle-fg mt-0.5">پایان شیفت</span>
                </button>
            </div>
        </Card>
    );
};
