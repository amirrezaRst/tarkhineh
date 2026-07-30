import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";

// Unlike the unit tests, this one talks to a real Express app AND a real
// MongoDB connection — that's what makes it an "integration" test: it
// proves the pieces work together, not just each piece in isolation.
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("GET /api/branch", () => {
    it("responds with 200 and a list of branches", async () => {
        // supertest wraps the app directly — no real port is ever opened.
        const res = await request(app).get("/api/branch");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.branches)).toBe(true);
    });

    it("every branch in the list has a name and an id", async () => {
        const res = await request(app).get("/api/branch");

        for (const branch of res.body.branches) {
            expect(branch).toHaveProperty("_id");
            expect(branch).toHaveProperty("name");
        }
    });
});

describe("GET /api/branch/:id", () => {
    it("responds with 404 for an id that doesn't exist", async () => {
        // A syntactically valid Mongo ObjectId that (almost certainly)
        // nothing in the database actually has.
        const fakeId = "000000000000000000000000";

        const res = await request(app).get(`/api/branch/${fakeId}`);

        expect(res.status).toBe(404);
    });
});
