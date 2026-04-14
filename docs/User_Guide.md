# CoffeeHub — User Guide

## What is CoffeeHub?

CoffeeHub is a web application for managing multi-branch coffee shops. It allows coffee shop owners to manage branches, menus, table reservations, customer reviews, and view business analytics — all from one centralized platform.

**Live URL:** https://coffee-shop-diana.com

---

## Who is it for?

| Role | Who | What they can do |
|------|-----|-----------------|
| **Customer** | Anyone visiting the site | Browse menu, view branches, read reviews |
| **Registered User** | Signed-up customer | Book tables, leave reviews, manage bookings |
| **Admin** | Coffee shop manager | Manage menu, handle reservations, moderate reviews, view analytics |
| **SuperAdmin** | Business owner | Everything above + manage branches, manage staff roles |

---

## Getting Started

### 1. Visit the Website

Open https://coffee-shop-diana.com in your browser.

### 2. Browse Without Signing Up

You can freely:
- View the **Home** page with branch listings
- Browse the **Menu** with categories and prices
- View **Branch** details with approved customer reviews
- See **QR codes** for branches

### 3. Create an Account

1. Click **"Sign In"** in the top-right corner
2. Click **"Register"** or **"Sign in with Google"**
3. Fill in: Name, Email, Password
4. Click **"Create Account"**

### 4. Log In

1. Click **"Sign In"**
2. Enter your email and password
3. Click **"Sign In"**
4. Or use **"Sign in with Google"** for one-click login

---

## Customer Features

### Book a Table

1. Click **"Book a Table"** from the home page or navigation
2. Select a **branch** from the dropdown
3. Select a **table** (shows capacity)
4. Pick a **date** and **time range** (start and end time)
5. Enter **number of guests**
6. Add optional **special requests**
7. Click **"Confirm Reservation"**
8. Your reservation will be **PENDING** until an admin confirms it

### View My Reservations

1. Click **"Dashboard"** in the navigation
2. See all your reservations with status:
   - 🟡 **Pending** — waiting for admin confirmation
   - 🟢 **Confirmed** — your table is booked
   - 🔴 **Cancelled** — booking was cancelled
   - 🔵 **Completed** — visit finished
3. You can **cancel** any Pending or Confirmed reservation

### Leave a Review

1. Go to a **Branch** page (click "View Details" on any branch)
2. Scroll down and click **"Leave a Review"**
3. Select a **star rating** (1-5)
4. Write your **comment**
5. Click **"Submit Review"**
6. Your review will appear after admin approval

### View My Reviews

1. Go to **Dashboard**
2. Click the **"My Reviews"** tab
3. See all your reviews with their approval status

---

## Admin Features

### Accessing the Admin Panel

1. Log in with an Admin or SuperAdmin account
2. Click **"Admin Panel"** in the navigation
3. You'll see the Admin Dashboard with sidebar navigation

### Admin Dashboard

The dashboard shows:
- **Total reservations** for today
- **Pending reservations** requiring action
- **Pending reviews** awaiting moderation
- **Active branches** count
- Quick links to all management sections

### Menu Management (`Admin Panel → Menu`)

**Categories:**
1. Click the **"Categories"** tab
2. Click **"+ Add New Item"** to create a category
3. Enter: Category Name, Description, select Branch
4. Click **"Save Category"**
5. Use the ✏️ (edit) or 🗑️ (delete) icons to modify existing categories

**Menu Items:**
1. Click the **"Menu Items"** tab
2. Click **"+ Add New Item"** to create a menu item
3. Enter: Name, Description, Price, Image URL, Category, Discount (%), Availability
4. Click **"Save"**
5. Toggle the availability switch directly in the table to quickly enable/disable items

### Reservation Management (`Admin Panel → Reservations`)

1. View all reservations across all branches
2. **Filter** by status: All, Pending, Confirmed, Cancelled, Completed
3. **Search** by customer name or branch
4. **Actions:**
   - Click **"Confirm"** (green) to approve a pending reservation
   - Click **"Cancel"** (red) to cancel a reservation
   - Click **"Complete"** (blue) to mark a confirmed reservation as finished

### Review Moderation (`Admin Panel → Reviews`)

1. Click the **"Pending"** tab to see unmoderated reviews
2. Each review shows: customer name, branch, star rating, comment
3. Click **"Approve"** (green) to publish the review
4. Click **"Reject"** (red) to hide the review
5. Click the **"Approved"** tab to see all published reviews

### Analytics (`Admin Panel → Analytics`)

1. Select a **branch** from the dropdown
2. Set a **date range** (From and To dates)
3. Click **"Generate Report"**
4. View:
   - **Stat cards**: Total reservations, Confirmed, Cancelled, Average rating
   - **Bar chart**: Reservations overview by day of week
   - **Line chart**: Reservation trends over time
   - **Rating distribution**: Breakdown of 1-5 star reviews

### QR Code Management (`Admin Panel → QR Codes`)

1. Select a **branch**
2. View QR codes for:
   - **Branch landing page** — customers scan to see branch info
   - **Review submission** — customers scan to leave a review
   - **Each table** — customers scan to see the menu
3. Click **"Download PNG"** to save any QR code
4. Click **"Download All"** to get all table QR codes at once
5. Print and place QR codes on tables, receipts, or marketing materials

### Branch Management (`Admin Panel → Branches`)

*SuperAdmin only*

1. Click **"+ Add New Branch"**
2. Fill in: Name, City, Address, Phone, Description
3. Upload a **branch image** (drag & drop or paste URL)
4. Click **"Create Branch"**
5. Edit or delete branches from the table
6. Branch deletion is a **soft delete** (sets to inactive)

---

## Using QR Codes

QR codes are a key feature of CoffeeHub. Here's how they work:

| QR Type | Where to place it | What happens when scanned |
|---------|-------------------|--------------------------|
| **Table QR** | On each table | Opens the menu page for that branch |
| **Branch QR** | At the entrance, on flyers | Opens the branch detail page |
| **Review QR** | On receipts, table tents | Opens the review submission form |

### Example Workflow:
1. Admin generates QR codes from `Admin Panel → QR Codes`
2. QR codes are printed and placed on tables
3. Customer scans with their phone camera
4. Menu/review page opens automatically in the browser
5. Customer can browse menu or leave a review without downloading an app

---

## Mobile Access

CoffeeHub is fully responsive. All features work on mobile phones:
- Navigation collapses into a **hamburger menu** (☰)
- Cards stack in a single column
- Forms are touch-friendly
- QR scanning opens mobile-optimized pages

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't log in | Check email/password, try "Forgot password?" or Google login |
| Reservation error | Ensure end time is after start time, date is in the future, guests don't exceed table capacity |
| Review not showing | Reviews require admin approval before they appear publicly |
| QR code not scanning | Ensure good lighting, try moving closer/further from the QR code |
| Page not loading | Try refreshing (Ctrl+Shift+R), clear browser cache |

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| SuperAdmin | diana@coffeehub.com | password123 |
| Admin | marcus@test.com | password123 |
| User | sarah@test.com | password123 |

---

*CoffeeHub — Crafted for the Digital Sommelier*
*© 2026 Diana Mamytova, Ala-Too International University*
