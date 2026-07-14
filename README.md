![Tarkhineh Thumbnail](./frontend/public/github/tarkhine-readme-thumnail.jpg)

# <img src="./frontend/public/images/logo-2.png" alt="Tarkhineh" width="92" height="92"> **Tarkhineh** — Multi-Branch Food Ordering & Reservation Platform

[![GitHub stars](https://img.shields.io/github/stars/amirrezaRst/tarkhineh?style=social)](https://github.com/amirrezaRst/tarkhineh/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/amirrezaRst/tarkhineh?style=social)](https://github.com/amirrezaRst/tarkhineh/network/members)
<!-- Optional badges:
-->
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/amirrezaRst/tarkhineh)](https://github.com/amirrezaRst/tarkhineh)

### Under Ongoing Development (Admin dashboards are in progress)

---

## Table of Contents
1. [Overview](#overview)
2. [Highlights](#highlights)
3. [Key Features](#features)
4. [Roadmap](#roadmap)
5. [Tech Stack](#tech-stack)
6. [Screenshots](#screenshots)
7. [Installation](#installation)
8. [Environment Variables](#environment-variables)
9. [Database Seeding (Important)](#database-seeding)
10. [Project Structure](#project-structure)
11. [Security Notes](#security-notes)
12. [Contributing](#contributing)
13. [License](#license)
14. [Contact](#contact)

---

## Overview <a name="overview"></a>

**Tarkhineh** is a **multi-branch food ordering and reservation platform** for a chain restaurant with **4 branches**, supporting both **online and in-person** orders with **pickup** and **courier delivery**.

The system includes role-specific dashboards for:
- **Super Admin** (global management)
- **Branch Manager** (branch-scoped operations)
- **Branch Couriers** (delivery lifecycle)

A core focus of this project is building a reliable **courier assignment (dispatch) strategy** and enforcing **strict branch-scoped access control** across the system.

---

## Highlights <a name="highlights"></a>

- Built a **multi-branch architecture (4 branches)** with branch-scoped data isolation.
- Implemented the **order lifecycle**: in-person/online orders → preparation → pickup/delivery, with order status tracking.
- Implemented **RBAC + branch-scoped authorization** (a central role model plus owner/branch guards) to prevent unauthorized access to orders and admin actions.
- **Server-side price integrity**: order totals, per-item discounts, and coupons are recomputed on the server from the cart — client-supplied amounts are never trusted.
- Hardened backend security: **Helmet** secure headers, **rate limiting** (global + strict on OTP endpoints), **NoSQL-injection sanitization**, Joi input validation, and JWT in **HttpOnly cookies**.
- Integrated **Zarinpal payment gateway** for checkout.

> Some originally-planned headline features (a smart courier **dispatch** strategy, Redis-backed dispatch concurrency control, full SEO metadata, and SMS delivery of OTP codes) are **not yet implemented** — see [Roadmap](#roadmap).

---

## Key Features <a name="features"></a>

- ✅ Multi-branch ordering (4 branches) + branch-scoped data isolation
- 🔎 Search & filtering (menu / products)
- 🛒 Cart & Checkout flow
- 💳 Zarinpal payment integration (server-side amount verification)
- 🔐 Authentication via **phone number + OTP**, JWT stored in **HttpOnly cookies**
- 🧭 Role-based route access (Super Admin / Branch Manager / Courier)
- 🧰 Admin & panel dashboards *(in progress)*

---

## Roadmap <a name="roadmap"></a>

Planned / partially-built work, tracked honestly so the docs match the code:

- 🚚 **Courier dispatch strategy** (assign orders to couriers by branch, status, workload/capacity) — not yet implemented.
- ⚡ **Redis-backed** dispatch concurrency control — Redis is connected but not yet used by application logic.
- 📱 **SMS delivery of OTP codes** — codes are currently generated and stored server-side but not sent to a real SMS gateway.
- 🔎 **SEO metadata** per route (Next.js Metadata API) — not yet added.
- 🧰 **Admin / branch / courier dashboards** — routing and guards exist; most panels are still stubs.

---

## Tech Stack <a name="tech-stack"></a>

### Frontend
- **Next.js 15**
- **React 19 (RC)**
- **Tailwind CSS**
- **Zustand**
- **React Hook Form**
- **React Toastify / SweetAlert2**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Redis** *(connected; not yet used by app logic — see [Roadmap](#roadmap))*
- **JWT Auth (HttpOnly Cookies)**
- **Joi Validation**
- **Helmet** (secure headers), **express-rate-limit**, **express-mongo-sanitize**
- **Multer + Sharp** (uploads & image processing)
- **node-cron** (scheduled jobs)
- **Zarinpal (Checkout/Pay)**

---

## Screenshots <a name="screenshots"></a>

![Tarkhineh Desktop](./frontend/public/github/tarkhineh-project-fullpage.jpg)
![Tarkhineh Mobile](./frontend/public/github/tarkhineh-project-mobile.jpg)

<!-- 
> Live Demo: **TBA** (add your deployment link here) 
-->

---

## Installation <a name="installation"></a>

This repository contains two separate apps:

- `backend/` (Express + MongoDB)
- `frontend/` (Next.js 15)

### Prerequisites
- Node.js **>= 18** (recommended)
- MongoDB (local or Atlas)
- Redis (local or cloud)

### 1) Clone
```bash
git clone https://github.com/amirrezaRst/tarkhineh.git
cd tarkhineh
```

### 2) Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#environment-variables))

Run backend (dev):
```bash
npm run dev
```

Run backend (prod):
```bash
npm run start
```

Backend default:
- `http://localhost:5000`

### 3) Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env.local` (see [Environment Variables](#environment-variables))

Run frontend (dev):
```bash
npm run dev
```

Build frontend:
```bash
npm run build
```

Run frontend (prod):
```bash
npm run start
```

Frontend default:
- `http://localhost:3000`

---

## Environment Variables <a name="environment-variables"></a>

Templates are checked into the repo — copy them and fill in your values:

- Backend: copy `backend/config/config.env.example` → `backend/config/config.env`
- Frontend: copy `frontend/.env.example` → `frontend/.env`

### Backend: `backend/config/config.env`
These are the variables the code actually reads:

```env
PORT=5000
MONGO_URI="mongodb://localhost:27017/tarkhineh"

# Generate each with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

FRONT_ADDRESS="http://localhost:3000/"

# Comma-separated list of allowed CORS origins
CORS_ORIGINS=http://localhost:3000

# Zarinpal (sandbox test id: eaa46b01-819e-42ef-8a67-ba2bb7f69a32)
ZARINPAL_MERCHANT_ID=your_zarinpal_merchant_id
ZARINPAL_SANDBOX=true
```

### Frontend: `frontend/.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMAGE_URL=http://localhost:5000/public
NEXT_PUBLIC_BASE_URL=http://localhost:3000/
```

---

## Database Seeding (Important) <a name="database-seeding"></a>

This project relies on MongoDB content (branches, menus, etc).  
If you run it with an empty MongoDB, the UI will show no items.

### Run seed (recommended)
```bash
cd backend
npm run seed -- --reset
```

- `--reset` clears existing documents in Tarkhineh collections first (recommended for local dev).
- Make sure `MONGO_URI` is set in `backend/.env`.

### What it seeds
- ✅ 4 branches (each with a manager + menus)
- ✅ sample menus
- ✅ sample discount linked to a menu item
- ✅ sample coupon (`WELCOME10`)
- ✅ sample cart, order, payment
- ✅ sample like & review
- ✅ sample reports
- ✅ test users for different roles (admin / branch_manager / courier / user)

---

## Project Structure <a name="project-structure"></a>

```txt
tarkhineh/
├─ frontend/
│  ├─ src/
│  │  ├─ app/
│  │  ├─ assets/
│  │  ├─ components/
│  │  ├─ constant/
│  │  ├─ hooks/
│  │  ├─ services/
│  │  ├─ stores/
│  │  └─ utils/
│  ├─ public/
└─ backend/
   ├─ config/
   ├─ controllers/
   ├─ middleware/
   ├─ models/
   ├─ public/
   ├─ routes/
   ├─ utils/
   ├─ validation/
   ├─ seed/
   └─ server.js
```

---

## Security Notes <a name="security-notes"></a>

- Authentication uses **JWT in HttpOnly cookies** (reduces XSS token theft risk compared to localStorage). Logout invalidates the refresh token server-side, not just client-side.
- Authorization is enforced server-side via:
  - **RBAC** — a central role model with reusable `Authenticate` / `Authorize` middleware.
  - **Ownership** guards — users can only act on their own cart / orders / addresses / reviews (identity is taken from the session, never from the request body).
  - **Branch-scoped** guards — a manager/courier can only access their own branch's data.
- **Price integrity** — order totals, per-item discounts, and coupons are recomputed server-side from the cart; client-supplied amounts are ignored.
- Backend hardening:
  - **Helmet** — secure HTTP headers (CSP, HSTS, `X-Content-Type-Options`, etc.).
  - **Rate limiting** — a global limiter plus a strict limiter on the OTP request/verify endpoints.
  - **express-mongo-sanitize** — strips `$`/`.` operators from user input to block NoSQL injection.
  - **Joi** input validation on request bodies.
- Secrets (`config.env`) are git-ignored; `.env.example` templates are provided instead.

---

## Contributing <a name="contributing"></a>

Contributions are welcome.

Suggested workflow (you can formalize this in `CONTRIBUTING.md`):
1. Fork the repo
2. Create a feature branch: `feat/<short-name>`
3. Run lint before PR (frontend): `npm run lint`
4. Submit a PR with a clear description and screenshots if UI-related

> Tip: Add `CONTRIBUTING.md` + PR/Issue templates for a more professional open-source experience.

---

## License <a name="license"></a>

This project is licensed under the **MIT License** — see `LICENSE`.

---

## Contact <a name="contact"></a>

- 📧 Email: [amirreza.rostami.0073@gmail.com](mailto:amirreza.rostami.0073@gmail.com)
- 🌐 Website: [https://arostami.dev/en](https://arostami.dev/en)
- 💼 LinkedIn: [LinkedIn Profile Address](https://www.linkedin.com/in/amirreza--rostami/)
