
# 📦 Smart Logistics & Delivery Management System  

A **full-stack logistics and delivery management system** designed for businesses handling parcel pickup, delivery, and fleet coordination — inspired by platforms like **Amazon Logistics, Delhivery, and Dunzo**.  

## 🛠️ Tech Stack  
**Frontend**  
- React.js (Vite)  
- TailwindCSS + ShadCN UI  
- React Router  

**Backend**  
- Node.js + Express.js  
- MongoDB (Mongoose ORM)  
- JWT Authentication  
- Socket.IO (for real-time tracking)  

**Other Tools**  
- Axios (API calls)  
- Redis (optional, caching real-time updates)  

---

## ✨ Core Features  

### 👤 Customers  
- Register/Login  
- Create shipment requests (pickup & delivery address, package type)  
- Live tracking of parcel on a map  
- SMS/Email notifications for each stage (Booked → Picked → In Transit → Delivered)  
- Cancel shipment before pickup  
- Download shipment receipts/invoices  

### 🚚 Delivery Agents  
- Login via OTP or credentials  
- View assigned deliveries  
- Real-time location tracking (auto-updating)  
- Update parcel status (Picked/Delivered)  
- Raise support tickets if issues occur  

### 🏢 Admins  
- Dashboard with total shipments, active deliveries, pending issues  
- Create & manage delivery zones  
- Assign deliveries to agents  
- Monitor live delivery agent locations  
- Manage customer support tickets  
- Manage warehouses & hubs (optional)  
- Analytics dashboard with KPIs and shipment trends  

---

## 📂 Project Structure  
```
Smart-Logistics-and-Delivery-Management-System/
│── backend/        # Express.js API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
│── frontend/       # React.js frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── pages/      # Login, Signup, Dashboards
│   │   ├── context/   # Auth Context
│   │   ├── api/       # Axios setup
│   │   └── App.jsx
│
└── README.md
```

---

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/your-username/Smart-Logistics-and-Delivery-Management-System.git
cd Smart-Logistics-and-Delivery-Management-System
```

### 2️⃣ Backend Setup  
```bash
cd backend
npm install
```
Create a `.env` file:  
```env
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
PORT=5000
```
Run backend:  
```bash
npm run dev
```

### 3️⃣ Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```

---

## 🧑‍💻 Usage Flow  

1. **Customer** signs up, creates shipment.  
2. **Admin** assigns shipment to an agent.  
3. **Agent** updates status + shares live location.  
4. **Customer** tracks shipment in real-time.  

---

## 🔮 Future Enhancements  
- Route optimization with Google Maps Distance Matrix API  
- Push notifications for updates  
- Analytics dashboards (delivery times, agent performance)  
- Payment integration (COD, UPI, etc.)  
- Mobile app for agents (React Native)  

---

## 📜 License  
MIT License © 2025 Hasan


