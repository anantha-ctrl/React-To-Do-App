# 📘 **Todo Manager – React Application**

A modern, future-proof Todo App built with React — powered by clean UI, drag-and-drop workflows, dark mode magic, and localStorage persistence.
Think “old-school productivity meets new-school innovation,” all wrapped in a sleek, responsive package.

## 🚀 Features

### ✅ Core Features

* Add, edit, complete, and delete tasks
* Real-time state updates
* Persistent data using **LocalStorage**

### ⚡ Advanced Upgrades

* 🖱 **Drag & Drop** (powered by `react-beautiful-dnd`)
* 🌙 **Dark Mode** with theme toggle
* 🔐 **Simple Authentication** (mock login system)
* 🎨 **Full UI Redesign**
* 📦 **LocalStorage Sync**
* 🐳 **Docker Support**

Because yes — productivity should look good, feel smooth, and run anywhere.

---

## 📂 Project Structure

```
todo-app/
│
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── TodoInput.jsx
│   │   ├── TodoItem.jsx
│   │   ├── TodoList.jsx
│   │   ├── Navbar.jsx
│   │   └── ThemeToggle.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Home.jsx
│   │
│   ├── context/
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js
│   │
│   ├── styles/
│   │   └── main.css
│   │
│   ├── App.js
│   ├── index.js
│   └── routes.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```sh
git clone https://github.com/your-username/todo-manager.git
cd todo-manager
```

### 2️⃣ Install dependencies

```sh
npm install
```

### 3️⃣ Start development server

```sh
npm start
```

Your app will be live at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🐳 Running with Docker

### Build the Docker image

```sh
docker build -t todo-manager .
```

### Run the container

```sh
docker run -p 3000:80 todo-manager
```

Boom. Your app is now containerized and deploy-ready.

---

## 🎨 UI & Theming

Dark mode? Yup.
Smooth transitions? Absolutely.
User-friendly? Always.

Toggle themes with the built-in switch — it’s fast, clean, and persistent.

---

## 🔐 Authentication (Simple Mock)

This project includes a basic front-end login page for demo purposes.
You can easily replace it with Firebase, Django, or JWT later.

---

## 📦 Tech Stack

* **React 18**
* **React Beautiful DnD**
* **LocalStorage API**
* **CSS (modern redesign)**
* **Docker / Nginx**

Traditional foundation. Future-looking execution.

---

## 📄 License

MIT — free to use, remix, ship, and brag about.

