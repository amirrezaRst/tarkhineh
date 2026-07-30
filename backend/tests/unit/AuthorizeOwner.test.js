import { describe, it, expect, vi } from "vitest";
import AuthorizeOwner from "../../middleware/AuthorizeOwner.js";

// AuthorizeOwner is just a function: (req, res, next) => {...}. Express
// normally builds req/res from a real HTTP request, but nothing stops us
// from building small fake versions ourselves — that's the whole trick to
// testing middleware without running a server. `vi.fn()` creates a fake
// function that remembers how it was called, so we can later assert
// "was this called, and with what?"
const buildRes = () => {
    const res = {};
    res.status = vi.fn(() => res); // .status(403) returns res, like Express does
    res.json = vi.fn(() => res);
    return res;
};

describe("AuthorizeOwner", () => {
    const middleware = AuthorizeOwner("id"); // matches req.params.id

    it("calls next() when the logged-in user matches the URL param", () => {
        const req = { user: { id: "user1", role: "user" }, params: { id: "user1" } };
        const res = buildRes();
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("calls next() for an admin, even on someone else's resource", () => {
        const req = { user: { id: "adminId", role: "admin" }, params: { id: "someoneElse" } };
        const res = buildRes();
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
    });

    it("rejects with 403 when a regular user requests someone else's resource", () => {
        const req = { user: { id: "user1", role: "user" }, params: { id: "someoneElse" } };
        const res = buildRes();
        const next = vi.fn();

        middleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
    });
});
