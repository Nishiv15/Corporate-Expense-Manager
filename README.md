# Corporate Expense Manager

## 📌 Overview

Corporate Expense Manager is a web-based platform designed to simplify and streamline **company expense management and approval workflows**.  
It helps organizations manage employee expenses, approvals, and budget control in a **centralized, transparent, and secure** way.

The system is built using the **MERN stack** and focuses on solving real-world problems faced by companies when handling expense reimbursements and approvals.

---

## 🎯 Problem

In many organizations, expense management is still handled through:
- Emails
- Spreadsheets
- Manual approvals
- Paper receipts

This leads to:
- Lack of transparency
- Delayed approvals
- Poor tracking
- No clear audit trail
- Difficulty managing approvals across teams

---

## 💡 Solution

Corporate Expense Manager provides a **structured, role-based platform** where:

- Employees can submit expenses easily
- Managers can review, approve, or reject expenses
- All actions are tracked and auditable
- Expense lifecycle is clearly defined
- Drafts, submissions, and approvals are securely managed

---

## 👥 User Roles

### 🔹 Manager
- Creates and manages the company account
- Registers employees
- Assigns roles and approval limits
- Reviews and approves/rejects expenses
- Manages users (soft delete)
- Can deactivate the company

### 🔹 Employee
- Logs in using credentials created by the manager
- Creates expense requests
- Edits or deletes expenses while in draft
- Submits expenses for approval
- Views expense status and history

### 🔹 Admin (Work in Progress)
- Platform-level role intended for internal administration
- Will manage companies and platform-wide settings
- Not associated with any specific company
- **Admin functionality is currently under development and not yet implemented**

---

## 🔁 Expense Lifecycle

Draft → Submitted → Approved / Rejected

- **Draft**
  - Editable and deletable
  - Visible only to the creator

- **Submitted**
  - Locked from editing
  - Awaiting manager approval

- **Approved / Rejected**
  - Final state
  - Stored permanently for audit purposes

---

## 🔐 Security & Access Control

- Role-based access control (Manager / Employee)
- Company-level data isolation
- Draft expenses visible only to creators
- Soft deletion for users and companies
- Backend-enforced authorization rules
- JWT-based authentication

---

## 🧱 Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend
- React.js (Vite)
- Tailwind CSS
- JavaScript

---

## 🗂️ Key Features

- Company-based multi-user system
- Secure authentication and authorization
- Draft-based expense creation
- Approval workflow
- Approval history tracking
- Soft deletion for data safety
- Scalable architecture for future admin features

---

## 🚀 Future Enhancements

Planned improvements include:
- Admin dashboard (platform-level)
- Expense analytics and reports
- Notification system (email / in-app)
- Multi-level approval workflows
- Budget tracking and alerts
- Mobile-friendly UI

---

## 📌 Project Status

This project is currently under active development and focuses on delivering a **robust MVP** with clean architecture and real-world business logic.