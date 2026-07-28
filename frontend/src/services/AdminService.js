import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

const fail = (err) => toast.error(err?.status === 400 ? err.message : "خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");

// ---- branches ----
// createBranch returns the created branch (or null) so the caller can then
// upload its images; it does not toast/reload on its own.
export const createBranch = async (data) => {
    try { const res = await api.post("/admin/branches", data); return res.data.branch; }
    catch (err) { fail(err); return null; }
};
export const updateBranch = async (id, data) => {
    try { await api.patch(`/admin/branches/${id}`, data); return true; }
    catch (err) { fail(err); return false; }
};
// Multipart: keeps `keep` (existing filenames) and appends new files.
export const setBranchImages = async (id, files = [], keep = []) => {
    const fd = new FormData();
    fd.append("keep", JSON.stringify(keep));
    files.forEach((f) => fd.append("images", f));
    try { const res = await api.patch(`/admin/branches/${id}/images`, fd); return res.data.images; }
    catch (err) { fail(err); return null; }
};
export const assignManager = async (id, userId, onSuccess) => {
    try { await api.patch(`/admin/branches/${id}/assign-manager`, { userId }); onSuccess?.(); toast.success("مدیر شعبه منتسب شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteBranch = async (id, onSuccess) => {
    try { await api.delete(`/admin/branches/${id}`); onSuccess?.(); toast.success("شعبه حذف شد."); }
    catch (err) { fail(err); }
};

// ---- orders (oversight) ----
export const cancelOrder = async (id, onSuccess) => {
    try { await api.patch(`/admin/orders/${id}/cancel`); onSuccess?.(); toast.success("سفارش لغو شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const refundOrder = async (id, onSuccess) => {
    try { await api.patch(`/admin/orders/${id}/refund`); onSuccess?.(); toast.success("بازپرداخت انجام شد."); return true; }
    catch (err) { fail(err); return false; }
};

// ---- users & roles ----
export const updateUserRole = async (id, body, onSuccess) => {
    try { await api.patch(`/admin/users/${id}/role`, body); onSuccess?.(); toast.success("نقش کاربر به‌روزرسانی شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteUser = async (id, onSuccess) => {
    try { await api.delete(`/admin/users/${id}`); onSuccess?.(); toast.success("کاربر حذف شد."); }
    catch (err) { fail(err); }
};

// ---- promotions: coupons + discounts ----
export const createCoupon = async (data, onSuccess) => {
    try { await api.post("/admin/coupons", data); onSuccess?.(); toast.success("کوپن ایجاد شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const updateCoupon = async (id, data, onSuccess) => {
    try { await api.patch(`/admin/coupons/${id}`, data); onSuccess?.(); toast.success("کوپن به‌روزرسانی شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteCoupon = async (id, onSuccess) => {
    try { await api.delete(`/admin/coupons/${id}`); onSuccess?.(); toast.success("کوپن حذف شد."); }
    catch (err) { fail(err); }
};
export const createDiscount = async (data, onSuccess) => {
    try { await api.post("/admin/discounts", data); onSuccess?.(); toast.success("تخفیف ایجاد شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const updateDiscount = async (id, data, onSuccess) => {
    try { await api.patch(`/admin/discounts/${id}`, data); onSuccess?.(); toast.success("تخفیف به‌روزرسانی شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteDiscount = async (id, onSuccess) => {
    try { await api.delete(`/admin/discounts/${id}`); onSuccess?.(); toast.success("تخفیف حذف شد."); }
    catch (err) { fail(err); }
};

// ---- platform settings ----
export const updateSettings = async (data, onSuccess) => {
    try { const r = await api.patch("/admin/settings", data); onSuccess?.(r.data.settings); toast.success("تنظیمات ذخیره شد."); return true; }
    catch (err) { fail(err); return false; }
};

// ---- reviews ----
export const setReviewStatus = async (id, status, onSuccess) => {
    try { const r = await api.patch(`/admin/reviews/${id}/status`, { status }); onSuccess?.(); toast.success(r.message); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteReview = async (id, onSuccess) => {
    try { await api.delete(`/admin/reviews/${id}`); onSuccess?.(); toast.success("نظر حذف شد."); }
    catch (err) { fail(err); }
};

// ---- menu catalog (reuses the global /menu admin endpoints) ----
export const createMenuItem = async (formData, onSuccess) => {
    try { await api.post("/menu", formData); onSuccess?.(); toast.success("آیتم منو اضافه شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const updateMenuItem = async (id, formData, onSuccess) => {
    try { await api.put(`/menu/${id}`, formData); onSuccess?.(); toast.success("آیتم منو به‌روزرسانی شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteMenuItem = async (id, onSuccess) => {
    try { await api.delete(`/menu/${id}`); onSuccess?.(); toast.success("آیتم منو حذف شد."); }
    catch (err) { fail(err); }
};

// ---- hero slides ----
export const createSlide = async (file, data) => {
    const fd = new FormData();
    fd.append("images", file);
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    try { const r = await api.post("/admin/slides", fd); toast.success("اسلاید اضافه شد."); return r.data.slide; }
    catch (err) { fail(err); return null; }
};
export const updateSlide = async (id, data, file) => {
    const fd = new FormData();
    if (file) fd.append("images", file);
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    try { await api.patch(`/admin/slides/${id}`, fd); toast.success("اسلاید به‌روزرسانی شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteSlide = async (id, onSuccess) => {
    try { await api.delete(`/admin/slides/${id}`); onSuccess?.(); toast.success("اسلاید حذف شد."); }
    catch (err) { fail(err); }
};
export const reorderSlides = async (ids, onSuccess) => {
    try { await api.patch("/admin/slides/reorder", { ids }); onSuccess?.(); }
    catch (err) { fail(err); }
};
