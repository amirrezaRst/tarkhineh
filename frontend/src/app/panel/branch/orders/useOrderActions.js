"use client";

import { useState } from "react";
import { approveOrder, assignCourier, updateOrderStatus } from "@/services/BranchManagerService";

// Shared order-mutation state/handlers used by both the list card and the detail
// panel, so the two stay in sync and don't duplicate the approve→prepare→send
// flow. Each handler flips `busy` and refetches via `onChanged` on success.
export default function useOrderActions(order, onChanged) {
    const [eta, setEta] = useState(30);
    const [courierId, setCourierId] = useState("");
    const [busy, setBusy] = useState(false);

    const withBusy = async (action) => { setBusy(true); await action(); setBusy(false); };

    const approve = () => withBusy(async () => {
        await approveOrder(order._id, Number(eta), () => { });
        await updateOrderStatus(order._id, "preparing", onChanged);
    });
    const assignAndSend = () => withBusy(async () => {
        if (!courierId) return;
        await assignCourier(order._id, courierId, () => { });
        await updateOrderStatus(order._id, "on_the_way", onChanged);
    });
    const markDelivered = () => withBusy(() => updateOrderStatus(order._id, "delivered", onChanged));
    const cancel = () => withBusy(() => updateOrderStatus(order._id, "cancelled", onChanged));

    return { eta, setEta, courierId, setCourierId, busy, approve, assignAndSend, markDelivered, cancel };
}
