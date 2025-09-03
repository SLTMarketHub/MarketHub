# Customer API (TMF629)

This project implements the **TMF629 Customer API**, providing endpoints to manage customer-related operations.  
It is built with **Node.js** and follows TM Forum standards.

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- npm (comes with Node.js)

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd customer-api

2. **Install Dependencies**
   ```bash
   npm install

3. **Run the API**
   ```bash
   npm start
   
---


## ⚙️ Project Structure
    ```bash
        customer-api/
        ├── Server.js              # Main API server
        ├── ClientListner.js       # Client listener logic
        ├── package.json           # Dependencies & scripts
        ├── .env                   # Environment variables
        └── CTK-TMF629-v5.0.0/     # CTK validation toolkit
   
---


## 🧪 Testing with CTK (Optional)
The project includes the TM Forum Conformance Test Kit (CTK) under CTK-TMF629-v5.0.0/.
You can run CTK tests using the provided scripts:

- Linux/Mac
   ```bash
      ./CTK-TMF629-v5.0.0/Mac-Linux-RUNCTK.sh

- Windows
   ```bash
   CTK-TMF629-v5.0.0/Windows-Bat-RUNCTK.bat

---

## 📄 Environment Variables

Configure API settings via .env file. Example:
   ```bash
       PORT=3000
       DB_URI=mongodb://localhost:27017/customerManagement