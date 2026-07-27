// Monochrome line icons for the admin panel — single-colour (currentColor),
// stroke-based, so nothing reads as a colourful/emoji "AI-generated" marker.
// Size via className (w-*/h-*); default 1em.

const base = (p) => ({ viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", width: "1em", height: "1em", "aria-hidden": true, ...p });

export const EditIcon = (p) => <svg {...base(p)}><path d="M4 20h4L18.5 9.5a2.12 2.12 0 0 0-3-3L5 17v3Z" /><path d="M13.5 6.5l4 4" /></svg>;
export const TrashIcon = (p) => <svg {...base(p)}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>;
export const PlusIcon = (p) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>;
export const SearchIcon = (p) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>;
export const SwapIcon = (p) => <svg {...base(p)}><path d="M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8" /></svg>;
export const CheckIcon = (p) => <svg {...base(p)}><path d="m5 12 4 4 10-10" strokeWidth="2" /></svg>;
export const CloseIcon = (p) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const EyeOffIcon = (p) => <svg {...base(p)}><path d="M3 3l18 18M10.6 5.2A9.6 9.6 0 0 1 12 5c5 0 9 4 10 7a12 12 0 0 1-2.4 3.4M6.2 6.2A12 12 0 0 0 2 12c1 3 5 7 10 7 1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>;
export const ChevronRightIcon = (p) => <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>;
export const ClockIcon = (p) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const PinIcon = (p) => <svg {...base(p)}><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>;
export const PhoneIcon = (p) => <svg {...base(p)}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>;
export const ImageIcon = (p) => <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m21 16-5-5L5 21" /></svg>;
export const BagIcon = (p) => <svg {...base(p)}><path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>;
export const PersonIcon = (p) => <svg {...base(p)}><circle cx="12" cy="8" r="3.2" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>;
export const ReviewStarIcon = (p) => <svg {...base(p)} fill="currentColor" stroke="none"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.9z" /></svg>;
export const HomeMiniIcon = (p) => <svg {...base(p)}><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9h12v-9" /></svg>;
