# EmpowerHerEd

A web application built with React and TypeScript for empowering women in education.

## Frontend setup

1. Clone the repository
```bash
git clone https://github.com/rukundo0023/empowerhered.git
```

2. Install dependencies
```bash
cd frontend
npm install
```

3. Run the development server
```bash
npm run dev
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite

## Figma mockup link
https://www.figma.com/proto/qLbaWHASZGCTRQzB1wYC1W/EmpowerHerEd?node-id=1-3&p=f&t=Ps84OuTKHuzUA1av-0&scaling=scale-down&content-scaling=fixed&page-id=0%3A1

## Link of github repo
https://github.com/rukundo0023/empowerhered

## Demo video Link
https://www.loom.com/share/43e89ae53a0941589a95dec33d18aa8e?sid=cacc879f-0a25-4d2c-b8b6-7bed7e4796aa
 
## Backend Development
The backend of EmpowerHerEd is built using Node.js, Express.js, and MongoDB. It handles user authentication, resource management, and API endpoints for frontend consumption.

## 📂 Server-side Code



## 🧩 Database Schema (MongoDB with Mongoose)




## 🚀 Deployment Plan
This project has two main parts: the frontend (what users see) and the backend (the server and database). Both need to be hosted online so people can use the app.

## Backend Deployment
The backend is built with Express.js and uses MongoDB for storing data.

We use a cloud service like Render or Railway to host the backend server.

Steps to deploy backend:

Push the backend code to GitHub.

Connect the GitHub repo to Render or Railway.

Set the build command (npm install) and start command (npm start) in the service dashboard.

Add environment variables like your MongoDB connection URL and secret keys.

When you push changes to GitHub, the backend automatically updates on the server.

## Frontend Deployment
The frontend is built with React and hosted on platforms like Vercel or Netlify.

Steps to deploy frontend:

Push frontend code to GitHub.

Connect the repo to Vercel or Netlify.

Set the build command (npm run build) and output folder (dist).

The frontend is then available online and communicates with the backend API.

## Project Structure

empowerhered/

├── frontend/          React and TypeScript (source files for the UI)

├── backend/           (Express server code and API routes)

├── README.md          (This file)

└── ...



## License

© 2025 EmpowerHerEd. All rights reserved.
