import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

const fail = (err) => toast.error(err?.status === 400 ? err.message : "خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");

// ---- branches ----
export const createBranch = async (data, onSuccess) => {
    try { await api.post("/admin/branches", data); onSuccess?.(); toast.success("شعبه ایجاد شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const updateBranch = async (id, data, onSuccess) => {
    try { await api.patch(`/admin/branches/${id}`, data); onSuccess?.(); toast.success("شعبه به‌روزرسانی شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const assignManager = async (id, userId, onSuccess) => {
    try { await api.patch(`/admin/branches/${id}/assign-manager`, { userId }); onSuccess?.(); toast.success("مدیر شعبه منتسب شد."); return true; }
    catch (err) { fail(err); return false; }
};
export const deleteBranch = async (id, onSuccess) => {
    try { await api.delete(`/admin/branches/${id}`); onSuccess?.(); toast.success("شعبه حذف شد."); }
    catch (err) { fail(err); }
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
