// Shared helpers for the admin panel: role identity, avatars, category labels.

export const ROLE_META = {
    admin: { label: "مدیر کل", tone: "admin" },
    branch_manager: { label: "مدیر شعبه", tone: "branch" },
    courier: { label: "پیک", tone: "courier" },
    user: { label: "کاربر", tone: "user" },
};

// role tone -> pill classes (dot + label, never colour-alone).
const TONE = {
    admin: "bg-[hsl(var(--role-admin)/0.12)] text-[hsl(var(--role-admin))]",
    branch: "bg-[hsl(var(--role-branch)/0.12)] text-[hsl(var(--role-branch))]",
    courier: "bg-[hsl(var(--role-courier)/0.12)] text-[hsl(var(--role-courier))]",
    user: "bg-surface-sunken text-muted-fg",
    warn: "bg-warning-subtle text-warning-fg",
};

export const RolePill = ({ role, children, tone }) => {
    const t = tone || ROLE_META[role]?.tone || "user";
    return (
        <span className={`inline-flex items-center gap-1.5 text-super-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${TONE[t]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {children || ROLE_META[role]?.label || role}
        </span>
    );
};

const AV_BG = {
    admin: "bg-[hsl(var(--role-admin))]",
    branch: "bg-[hsl(var(--role-branch))]",
    courier: "bg-[hsl(var(--role-courier))]",
    user: "bg-[hsl(var(--muted-fg))]",
};

export const initials = (name, phone) => {
    if (name && name.trim()) {
        const p = name.trim().split(/\s+/);
        return (p[0]?.[0] || "") + (p[1]?.[0] || "");
    }
    return phone ? String(phone).slice(-2) : "؟";
};

export const Avatar = ({ name, phone, role = "user", src, size = 32 }) => {
    const s = { width: size, height: size };
    if (src) return <img src={src} alt="" style={s} className="rounded-full object-cover shrink-0" />;
    return (
        <div style={s} className={`rounded-full grid place-items-center text-white font-extrabold shrink-0 ${AV_BG[ROLE_META[role]?.tone || "user"]}`}>
            <span style={{ fontSize: size * 0.36 }}>{initials(name, phone)}</span>
        </div>
    );
};

export const STATUS_META = {
    pending: { label: "در انتظار تأیید", color: "hsl(var(--status-pending))", sub: "bg-status-pending-subtle text-status-pending" },
    preparing: { label: "در حال آماده‌سازی", color: "hsl(var(--status-preparing))", sub: "bg-status-preparing-subtle text-status-preparing" },
    on_the_way: { label: "در مسیر", color: "hsl(var(--status-on-the-way))", sub: "bg-status-on-the-way-subtle text-status-on-the-way" },
    delivered: { label: "تحویل‌شده", color: "hsl(var(--status-delivered))", sub: "bg-status-delivered-subtle text-status-delivered" },
    cancelled: { label: "لغوشده", color: "hsl(var(--status-cancelled))", sub: "bg-status-cancelled-subtle text-status-cancelled" },
};

export const StatusPill = ({ status }) => {
    const m = STATUS_META[status] || STATUS_META.pending;
    return <span className={`inline-flex items-center gap-1.5 text-super-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${m.sub}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{m.label}</span>;
};

export const PAYMENT_LABEL = { paid: "پرداخت‌شده", unpaid: "پرداخت‌نشده", failed: "ناموفق" };
export const DELIVERY_LABEL = { courier: "ارسال با پیک", person: "تحویل حضوری" };

export const CAT_LABEL = { main: "غذای اصلی", side: "پیش‌غذا", dessert: "دسر", drink: "نوشیدنی" };
export const FOOD_TYPE_LABEL = { iranian: "ایرانی", "non-iranian": "غیرایرانی", pizza: "پیتزا", sandwich: "ساندویچ" };

export const faDate = (d) => (d ? new Date(d).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" }) : "—");

// Menu image. The backend serves /public -> public/menu-images, so a stored
// filename resolves at ${IMAGE_URL}/<filename> (same convention as the rest of
// the app's MenuCard components).
export const menuImg = (images) => {
    const first = Array.isArray(images) ? images[0] : images;
    if (!first) return null;
    if (/^https?:\/\//.test(first)) return first;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${first}`;
};

// Branch image served from the dedicated /public/branches mount.
export const branchImg = (images) => {
    const first = Array.isArray(images) ? images[0] : images;
    if (!first) return null;
    if (/^https?:\/\//.test(first)) return first;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/branches/${String(first).replace(/^\/?branches\//, "")}`;
};

// Hero-slide image served from the dedicated /public/slides mount.
export const slideImg = (filename) => {
    if (!filename) return null;
    if (/^https?:\/\//.test(filename)) return filename;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/slides/${String(filename).replace(/^\/?slides\//, "")}`;
};
