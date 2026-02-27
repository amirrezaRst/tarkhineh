/**
 * Tarkhineh - Database Seeder
 *
 * Usage:
 *   cd backend
 *   npm run seed
 *   npm run seed -- --reset
 *
 * Notes:
 * - Reads Mongo URI from .env (MONGO_URI).
 * - Deletes only Tarkhineh collections (does NOT drop the entire DB unless you change it).
 * - Creates: users (admin/managers/couriers/user) + menus + discounts + branches + coupons + cart + order + payment + like + review + reports.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");

// Models
const User = require("../models/UserModel");
const Branch = require("../models/BranchModel");
const Menu = require("../models/MenuModel");
const Discount = require("../models/DiscountModel");
const Coupon = require("../models/CouponModel");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const Payment = require("../models/PaymentModel");
const Like = require("../models/LikeModel");
const Review = require("../models/ReviewModel");
const Report = require("../models/ReportModel");

const MONGO_URI = process.env.MONGO_URI;

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function purgeCollections() {
  // Delete children first (safe order)
  await Promise.allSettled([
    Like.deleteMany({}),
    Review.deleteMany({}),
    Payment.deleteMany({}),
    Order.deleteMany({}),
    Cart.deleteMany({}),
    Report.deleteMany({}),
    Discount.deleteMany({}),
    Coupon.deleteMany({}),
    Branch.deleteMany({}),
    Menu.deleteMany({}),
    User.deleteMany({}),
  ]);
}

async function seed() {
  const reset = process.argv.includes("--reset");

  if (!MONGO_URI) {
    throw new Error("Missing MONGO_URI in backend/.env");
  }

  // Safety guard
  if (process.env.NODE_ENV === "production" && !process.argv.includes("--force")) {
    throw new Error(
      "Refusing to seed in production without --force. Set NODE_ENV=development for local seeding."
    );
  }

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  if (reset) {
    console.log("🧹 Reset mode: deleting existing Tarkhineh documents...");
    await purgeCollections();
  } else {
    console.log("ℹ️ Non-reset mode: seeding without cleanup (may create duplicates). Use --reset for a clean seed.");
  }

  // 1) Users (phoneNumber is required+unique)
  const users = await User.insertMany([
    {
      fullName: "Tarkhineh Super Admin",
      email: "admin@tarkhineh.local",
      phoneNumber: "09120000001",
      userName: "tarkhineh_admin",
      role: "admin",
    },
    // 4 branch managers
    {
      fullName: "Branch Manager - Vanak",
      email: "manager.vanak@tarkhineh.local",
      phoneNumber: "09120000011",
      userName: "manager_vanak",
      role: "branch_manager",
    },
    {
      fullName: "Branch Manager - SaadatAbad",
      email: "manager.saadat@tarkhineh.local",
      phoneNumber: "09120000012",
      userName: "manager_saadat",
      role: "branch_manager",
    },
    {
      fullName: "Branch Manager - Tajrish",
      email: "manager.tajrish@tarkhineh.local",
      phoneNumber: "09120000013",
      userName: "manager_tajrish",
      role: "branch_manager",
    },
    {
      fullName: "Branch Manager - Ekbatan",
      email: "manager.ekbatan@tarkhineh.local",
      phoneNumber: "09120000014",
      userName: "manager_ekbatan",
      role: "branch_manager",
    },
    // Couriers (optional, but useful for dashboards)
    {
      fullName: "Courier - Vanak",
      email: "courier.vanak@tarkhineh.local",
      phoneNumber: "09120000021",
      userName: "courier_vanak",
      role: "courier",
    },
    {
      fullName: "Courier - SaadatAbad",
      email: "courier.saadat@tarkhineh.local",
      phoneNumber: "09120000022",
      userName: "courier_saadat",
      role: "courier",
    },
    // Normal user (for browsing/cart/order)
    {
      fullName: "Test User",
      email: "user@tarkhineh.local",
      phoneNumber: "09120000999",
      userName: "test_user",
      role: "user",
      addresses: [
        {
          title: "Home",
          addressLine: "Tehran, Example St, No. 12",
          recipientPhoneNumber: "09120000999",
          recipientFullName: "Test User",
          coordinates: { lat: 35.7219, lng: 51.3347 },
        },
      ],
    },
  ]);

  const managers = users.filter((u) => u.role === "branch_manager");
  const testUser = users.find((u) => u.role === "user");

  // 2) Menus
  const menus = await Menu.insertMany([
    {
      name: "Kebab Koobideh",
      description: "Classic Iranian koobideh with rice.",
      price: 220000,
      category: "main",
      images: [],
      ingredients: ["beef", "onion", "spices"],
      foodType: "iranian",
      isPersian: true,
    },
    {
      name: "Joojeh Kebab",
      description: "Grilled chicken kebab with saffron.",
      price: 260000,
      category: "main",
      images: [],
      ingredients: ["chicken", "saffron", "lemon"],
      foodType: "iranian",
      isPersian: true,
    },
    {
      name: "Caesar Salad",
      description: "Romaine lettuce, parmesan, and chicken.",
      price: 180000,
      category: "side",
      images: [],
      ingredients: ["lettuce", "parmesan", "chicken"],
      foodType: "non-iranian",
      isPersian: false,
    },
    {
      name: "Pepperoni Pizza",
      description: "Thin crust pepperoni pizza.",
      price: 310000,
      category: "main",
      images: [],
      ingredients: ["pepperoni", "cheese", "tomato"],
      foodType: "pizza",
      isPersian: false,
    },
    {
      name: "Doogh",
      description: "Traditional yogurt drink.",
      price: 35000,
      category: "drink",
      images: [],
      ingredients: ["yogurt", "mint"],
      foodType: "iranian",
      isPersian: true,
    },
    {
      name: "Chocolate Cake",
      description: "Rich chocolate dessert slice.",
      price: 95000,
      category: "dessert",
      images: [],
      ingredients: ["cocoa", "flour", "eggs"],
      foodType: "non-iranian",
      isPersian: false,
    },
  ]);

  // 3) Discounts (optional) + attach to Menu.discount
  const discount1 = await Discount.create({
    menuItem: menus[0]._id,
    discountType: "percentage",
    discountValue: 15,
    startDate: new Date(),
    endDate: daysFromNow(14),
    active: true,
  });

  await Menu.updateOne({ _id: menus[0]._id }, { $set: { discount: discount1._id } });

  // 4) Branches (manager is required)
  const branches = await Branch.insertMany([
    {
      name: "Tarkhineh - Vanak",
      manager: managers[0]._id,
      menus: [menus[0]._id, menus[1]._id, menus[4]._id],
    },
    {
      name: "Tarkhineh - Saadat Abad",
      manager: managers[1]._id,
      menus: [menus[1]._id, menus[2]._id, menus[5]._id],
    },
    {
      name: "Tarkhineh - Tajrish",
      manager: managers[2]._id,
      menus: [menus[0]._id, menus[3]._id, menus[4]._id],
    },
    {
      name: "Tarkhineh - Ekbatan",
      manager: managers[3]._id,
      menus: [menus[2]._id, menus[3]._id, menus[5]._id],
    },
  ]);

  // 5) Coupon (optional)
  const coupon = await Coupon.create({
    code: "WELCOME10",
    description: "10% off for first order",
    discountType: "percentage",
    discountValue: 10,
    usageLimit: 1,
    validFrom: new Date(),
    validTo: daysFromNow(30),
    active: true,
    user: testUser._id,
  });

  await User.updateOne({ _id: testUser._id }, { $addToSet: { coupons: coupon._id } });

  // 6) Cart (optional)
  await Cart.create({
    user: testUser._id,
    branch: branches[0]._id,
    items: [
      { menuItem: menus[0]._id, quantity: 1 },
      { menuItem: menus[4]._id, quantity: 2 },
    ],
  });

  // 7) Order (optional)
  const orderItems = [
    { menuItem: menus[0]._id, quantity: 1, price: menus[0].price },
    { menuItem: menus[4]._id, quantity: 1, price: menus[4].price },
  ];
  const totalPrice = orderItems.reduce((sum, it) => sum + it.quantity * it.price, 0);
  const discountAmount = Math.round(totalPrice * 0.1);
  const finalPrice = totalPrice - discountAmount;

  const order = await Order.create({
    user: testUser._id,
    items: orderItems,
    totalPrice,
    discount: discountAmount,
    finalPrice,
    deliveryType: "courier",
    estimatedDeliveryTime: new Date(),
    deliveryFee: 45000,
    branch: branches[0]._id,
    customerNote: "Please ring the bell.",
    status: "pending",
    deliveryAddress: {
      addressLine: "Tehran, Example St, No. 12",
      recipientPhoneNumber: "09120000999",
      recipientFullName: "Test User",
    },
    paymentMethod: "online",
    paymentStatus: "unpaid",
    refundStatus: "none",
    pickupCode: 1234,
    approvedAt: null,
  });

  await User.updateOne({ _id: testUser._id }, { $addToSet: { orderHistory: order._id } });

  // 8) Payment (optional)
  await Payment.create({
    order: order._id,
    user: testUser._id,
    paymentMethod: "online",
    status: "pending",
    amount: finalPrice + 45000,
    paymentCode: "SEED-PAY-001",
    transactionId: "SEED-TX-001",
  });

  // 9) Review + Like (optional)
  await Review.create({
    text: "Very tasty and fresh!",
    rating: 5,
    user: testUser._id,
    menuItem: menus[0]._id,
    branch: branches[0]._id,
  });

  await Like.create({
    user: testUser._id,
    menuItem: menus[0]._id,
  });

  // 10) Reports (optional)
  await Report.insertMany(
    branches.map((b) => ({
      branch: b._id,
      totalSales: 0,
      totalOrders: 0,
      totalDiscount: 0,
      reportType: "daily",
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  console.log("\n✅ Seed completed successfully.");
  console.log("\nTest accounts:");
  console.log(`- Admin: admin@tarkhineh.local | 09120000001 | role=admin`);
  console.log(`- User:  user@tarkhineh.local  | 09120000999 | role=user`);
  console.log("\nManagers:");
  users.filter((u) => u.role === "branch_manager").forEach((m) => {
    console.log(`- ${m.email} | ${m.phoneNumber}`);
  });
  console.log("\nCouriers:");
  users.filter((u) => u.role === "courier").forEach((c) => {
    console.log(`- ${c.email} | ${c.phoneNumber}`);
  });

  await mongoose.disconnect();
  console.log("🔌 Disconnected.");
}

seed().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
