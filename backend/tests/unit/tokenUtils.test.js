import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtils.js";

describe("generateAccessToken", () => {
    it("produces a token that decodes back to the same data", () => {
        // Arrange: the input we're giving the function
        const userData = { id: "abc123", role: "customer" };

        // Act: call the real function
        const token = generateAccessToken(userData);

        // Assert: decoding the token with the same secret should give us
        // back exactly what we put in.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.id).toBe("abc123");
        expect(decoded.role).toBe("customer");
    });

    it("sets an expiry about 1 day in the future", () => {
        const token = generateAccessToken({ id: "abc123" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const oneDaySeconds = 24 * 60 * 60;
        const actualLifetime = decoded.exp - decoded.iat;

        expect(actualLifetime).toBe(oneDaySeconds);
    });

    it("cannot be verified with the refresh token secret", () => {
        // This is the real-world bug this test protects against: if
        // generateAccessToken ever accidentally signed with the WRONG
        // secret, an access token could be forged using the refresh secret
        // (or vice versa). expect(...).toThrow() passes only if the
        // function inside actually throws.
        const token = generateAccessToken({ id: "abc123" });

        expect(() => {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        }).toThrow();
    });
});

describe("generateRefreshToken", () => {
    it("sets an expiry about 30 days in the future", () => {
        const token = generateRefreshToken({ id: "abc123" });
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const thirtyDaysSeconds = 30 * 24 * 60 * 60;
        expect(decoded.exp - decoded.iat).toBe(thirtyDaysSeconds);
    });
});
