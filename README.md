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
4. [Tech Stack](#tech-stack)
5. [Screenshots](#screenshots)
6. [Installation](#installation)
7. [Environment Variables](#environment-variables)
8. [Database Seeding (Important)](#database-seeding)
9. [Project Structure](#project-structure)
10. [Security Notes](#security-notes)
11. [Contributing](#contributing)
12. [License](#license)
13. [Contact](#contact)

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

- Built a **multi-branch architecture (4 branches)** with dedicated dashboards for managers and couriers.
- Implemented the **full order lifecycle**: in-person/online orders → preparation → courier assignment → pickup/delivery.
- Designed a **smart dispatch strategy** (branch, courier status, workload/capacity, priority).
- Used **Redis** concepts to optimize dispatch flow and reduce concurrency contention during assignment updates.
- Implemented **RBAC + branch-scoped authorization** to prevent unauthorized access to orders/admin actions.
- Hardened backend security with best practices (**Helmet**, input validation, rate limiting, secure headers).
- Integrated **Zarinpal payment gateway** for checkout.

---

## Key Features <a name="features"></a>

- ✅ Multi-branch ordering (4 branches) + branch-scoped data isolation
- 🔎 Search & filtering (menu / products)
- 🛒 Cart & Checkout flow
- 💳 Zarinpal payment integration
- 🔐 Authentication with JWT stored in **HttpOnly cookies**
- 🧭 Role-based access (Super Admin / Branch Manager / Courier)
- ⚡ SEO & performance optimizations (Next.js)
- 🧰 Admin dashboards (in progress)

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
- **Redis**
- **JWT Auth (HttpOnly Cookies)**
- **Joi Validation**
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
<!-- 
> Best practice: add these files to your repo:
- `backend/.env.example`
- `frontend/.env.local.example`
-->

### Backend: `backend/.env`
Below is a **template**. Replace variable names with the exact ones used in your codebase if they differ.

```env
NODE_ENV=development
PORT=5000

# Mongo
MONGO_URI=mongodb://127.0.0.1:27017/tarkhineh

# Redis
REDIS_URL=redis://localhost:6379

# Auth (JWT)
JWT_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_token

# Cookies / Security
COOKIE_SECRET=your_cookie_secret
FRONT_ADDRESS=http://localhost:3000

# Zarinpal
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_CALLBACK_URL=http://localhost:3000/payment/verify


```

### Frontend: `frontend/.env.local`
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

- Authentication uses **JWT in HttpOnly cookies** (reduces XSS token theft risk compared to localStorage).
- Authorization is enforced server-side via:
  - **RBAC** (role checks)
  - **Branch-scoped** constraints (manager/courier can only access their branch data)
- Backend hardening includes:
  - Helmet
  - Input validation (Joi)
  - Rate limiting in progress
  - Secure headers

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
