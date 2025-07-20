# EmpowerHerEd 💡

A web application built with **React**, **TypeScript**, and **Tailwind CSS** to empower women in education through mentorship, resources, and courses.

---

## 🌐 Live App  
🔗 [Visit the Live App](https://empowerhered-1ixh.vercel.app)

---

## 🎥 Demo Video  
🎬 [Watch Demo on Loom](https://www.loom.com/share/bfa4e0ac01984e28981aae41cf82077f?sid=694935d5-e73d-4d6e-be99-a91452efbf3d)

---

## 📦 Project Structure

empowerhered/
├── frontend/ # React + TypeScript client app
├── backend/ # Node.js + Express server APIs
├── .env # Environment variables
└── README.md


---

## 🛠 Technologies Used

### Frontend:
- React + TypeScript
- Tailwind CSS
- Vite
- React Router
- i18n (internationalization)
- PWA (`vite-plugin-pwa`)

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- RESTful APIs

---

## 🚀 Deployment Plan

### Frontend: Vercel  
- Framework Preset: `Vite`  
- Build Command: `npm run build`  
- Output Directory: `dist`  
- Environment variables configured in Vercel dashboard  

### Backend: Render  
- Web Service deployment  
- Build Command: `npm install`  
- Start Command: `npm start`  
- Set Environment Variables:
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`

---

## 🧪 Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/rukundo0023/empowerhered.git
cd empowerhered

2. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Runs at http://localhost:3000

3. Backend Setup
cd backend
npm install
npm start
Runs at http://localhost:5002

reate a .env file inside /backend folder:

PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


🔐 Environment Variables

Frontend (frontend/.env)

VITE_API_URL=https://empowerhered.onrender.com/api
VITE_APP_NAME=EmpowerHerEd
VITE_ENABLE_GOOGLE_LOGIN=true

📂 API Endpoints (Sample)

Method	Route	Description
POST	/api/users/login	Log in a user
POST	/api/users/register	Register a new user
GET	/api/resources	Get educational resources
GET	/api/mentorship/sessions	Get mentorship sessions

🤝 Contributing
Fork the repository

Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m "Added something"

Push to the branch: git push origin feature-name

Open a Pull Request

📫 Contact
Have questions or suggestions?

📧 Email: clevisrukundo@gmail.com
👤 GitHub: rukundo0023




📜 License
© 2025 EmpowerHerEd. All rights reserved.



