"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/apiClient";
import Modal from "@/components/panel/Modal";
import { Avatar, ROLE_META } from "../adminUtils";
import { updateUserRole } from "@/services/AdminService";

const ROLES = ["user", "courier", "branch_manager", "admin"];
const NEEDS_BRANCH = ["courier", "branch_manager"];

const RoleModal = ({ open, onClose, user, onSaved }) => {
    const [role, setRole] = useState(user?.role || "user");
    const [branch, setBranch] = useState(user?.branch?._id || "");
    const [branches, setBranches] = useState([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => { setRole(user?.role || "user"); setBranch(user?.branch?._id || ""); }, [user]);

    useEffect(() => {
        if (!open) return;
        api.get("/admin/branches").then((res) => setBranches(res.data.branches)).catch(() => { });
    }, [open]);

    if (!user) return null;
    const needsBranch = NEEDS_BRANCH.includes(role);

    const submit = async (e) => {
        e.preventDefault();
        if (needsBranch && !branch) return;
        setBusy(true);
        const ok = await updateUserRole(user._id, { role, branch: needsBranch ? branch : null }, onSaved);
        setBusy(false);
        if (ok) onClose();
    };

    return (
        <Modal open={open} onClose={onClose} size="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-extrabold mb-1">تغییر نقش کاربر</h2>
                <div className="flex items-center gap-2.5 mb-5 mt-3">
                    <Avatar name={user.fullName} phone={user.phoneNumber} role={user.role} size={40} />
                    <div><div className="font-bold text-super-sm">{user.fullName || "بدون نام"}</div><div className="text-super-xs text-muted-fg tabular-nums">{user.phoneNumber}</div></div>
                </div>

                <label className="block text-super-sm font-bold mb-2">نقش جدید</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {ROLES.map((r) => (
                        <button type="button" key={r} onClick={() => setRole(r)} aria-pressed={role === r}
                            className={`rounded-xl py-3 text-super-sm font-extrabold border-2 transition-colors ${role === r ? "border-primary bg-primary-subtle text-primary" : "border-border text-muted-fg hover:border-border-strong"}`}>
                            {ROLE_META[r].label}
                        </button>
                    ))}
                </div>

                {needsBranch && (
                    <div className="mb-5">
                        <label className="block text-super-sm font-bold mb-1.5">شعبه</label>
                        <select value={branch} onChange={(e) => setBranch(e.target.value)}
                            className="w-full border border-border rounded-xl px-3.5 py-2.5 text-super-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40">
                            <option value="">— انتخاب شعبه —</option>
                            {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>
                )}

                <div className="flex gap-3">
                    <button type="submit" disabled={busy || (needsBranch && !branch)} className="flex-1 bg-primary text-primary-fg rounded-xl py-3 text-super-sm font-bold hover:bg-primary-hover disabled:opacity-50">
                        {busy ? "در حال ذخیره…" : "ثبت نقش"}
                    </button>
                    <button type="button" onClick={onClose} className="px-5 rounded-xl border border-border text-super-sm font-bold text-muted-fg">انصراف</button>
                </div>
            </form>
        </Modal>
    );
};

export default RoleModal;
