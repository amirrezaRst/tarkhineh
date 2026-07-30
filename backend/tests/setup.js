// Runs once before every test file. Tests should never depend on the real
// config.env (the values there are secrets, and tests shouldn't need a real
// secret to prove that "sign then verify" round-trips correctly) — so we set
// small throwaway values here instead.
process.env.JWT_SECRET = "test-jwt-secret";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";

// Integration tests hit the same local dev database the rest of this
// project's manual testing already uses (see the OTP-from-Mongo technique
// used throughout this session) — no separate test database yet. Fine for
// read-only tests; a write-heavy test suite would need its own database.
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tarkhineh";

// orderController builds a Zarinpal client at require() time (a module-level
// side effect — every route file gets pulled in by app.js, so this runs the
// moment the app is imported, whether or not a test ever touches payments).
// The public Zarinpal sandbox test merchant id, same one in config.env.example.
process.env.ZARINPAL_MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "eaa46b01-819e-42ef-8a67-ba2bb7f69a32";
process.env.ZARINPAL_SANDBOX = "true";
