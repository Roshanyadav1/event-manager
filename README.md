Here is a professional and complete `README.md` file for your project.

Create a new file named **`README.md`** in your main project folder and paste this content inside.

---

# 🎓 College Event Management System (MERN Stack)

A full-stack web application to manage college events.

* **Admins** can create, update, and delete events.
* **Students** can view events, register for them, and see their registration history.

---

## 🛠️ Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (v14 or higher) - [Download Here](https://nodejs.org/)
2. **MongoDB Community Server** - [Download Here](https://www.mongodb.com/try/download/community)
3. **VS Code** (Code Editor)

---

## 📦 Step 1: Install & Setup MongoDB

You need a database running locally for this app to work.

### **Windows Installation:**

1. Download the **MSI installer** from the link above.
2. Run the installer. **Select "Complete" setup.**
3. **IMPORTANT:** On the "Service Configuration" screen, keep "Run Service as Network Service user" selected.
4. **IMPORTANT:** Check the box **"Install MongoDB Compass"** (This is the UI to view your data).
5. Finish installation.

### **Verify MongoDB is Running:**

1. Open **Task Manager** (Ctrl + Shift + Esc).
2. Go to the **Services** tab.
3. Look for `MongoDB`. Status should be **Running**.
4. Open **MongoDB Compass** app and click **Connect** (URI: `mongodb://localhost:27017`).

---

## 🚀 Step 2: Backend Setup (Server)

This handles the database and API logic.

1. Open your terminal/command prompt.
2. Navigate to the `server` folder:
```bash
cd server

```


3. Install dependencies:
```bash
npm install

```


4. Create a **`.env`** file in the `server` folder and paste this:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college-events
JWT_SECRET=mysecretkey123

```


5. Start the Backend Server:
```bash
npm run dev

```


*You should see:* `🚀 Server running on port 5000` and `✅ MongoDB Connected`.

---

## 🎨 Step 3: Frontend Setup (Client)

This handles the User Interface (React).

1. Open a **new** terminal window (keep the server running).
2. Navigate to the `client` folder:
```bash
cd client

```


3. Install dependencies:
```bash
npm install

```


4. Start the React App:
```bash
npm run dev

```


5. Open your browser and go to: **`http://localhost:5173`**

---

## 🔑 How to Create an Admin User

By default, all new registrations are **Students**. To create an **Admin**:

1. Go to the app and **Register** a new user (e.g., `admin@college.com`).
2. Open **MongoDB Compass**.
3. Go to `college-events` database -> `users` collection.
4. Find the user you just created.
5. Click the **Pencil Icon** (Edit Document).
6. Change the `role` field from `"student"` to `"admin"`.
```json
"role": "admin"

```


7. Click **Update**.
8. **Logout and Login again.** You will now see the "Add Event" button.

---

## 📱 Features

### **Admin Role:**

* Create new events (Title, Date, Seats, etc.).
* Edit existing events.
* Delete events.
* View list of students registered for a specific event.

### **Student Role:**

* View all upcoming events.
* Register for an event (One-click).
* View "My Events" (History of registrations).
* Prevent duplicate registrations (Cannot join same event twice).

---

## 🐛 Troubleshooting

* **Error: `connect ECONNREFUSED 127.0.0.1:27017**`
* **Fix:** Your MongoDB is not running. Open Services on Windows and start the `MongoDB Server` service.


* **Error: `address already in use :::5000**`
* **Fix:** You have another server running. Close other terminals or change `PORT=5001` in your `.env` file.


* **Frontend says "Network Error"**
* **Fix:** Ensure your Backend terminal is running and says "Connected".



---

## 📚 Tech Stack

* **M**ongoDB (Database)
* **E**xpress.js (Backend Framework)
* **R**eact.js (Frontend Library + Vite)
* **N**ode.js (Runtime Environment)
* **Tailwind CSS** (Styling)
