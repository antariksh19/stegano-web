<div align="center">
  

  <h1>Stegano-web 🔒</h1>

  <p>A secure full-stack web application designed to conceal AES-256-GCM encrypted messages inside images via Least Significant Bit (LSB) steganography.</p>

  <h3>🟢 <a href="https://stegano-web.vercel.app/">Live Deployment Available Here</a></h3>
</div>

<br/>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Cryptography-000000?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="Crypto" />
</div>

---

## 🚀 Overview

Stegano-web is a specialized security tool that combines modern frontend architecture with robust backend cryptographic algorithms. It allows users to imperceptibly embed highly sensitive, encrypted data directly into standard image files, ensuring data confidentiality through both encryption and obfuscation.

### ✨ Key Features
* **LSB Steganography:** Implements Least Significant Bit manipulation to embed data into image pixels without visually altering the image.
* **Military-Grade Encryption:** Utilizes AES-256-GCM to encrypt the message payload before it is hidden, ensuring that even if the steganography is detected, the payload remains secure.
* **Immersive UI:** Features a custom-built, responsive React frontend tailored with Tailwind CSS, including a dynamic `MatrixRain` background component.
* **Decoupled Architecture:** Clean separation of concerns between the React client and the Python API processing layer.

## 📂 Project Structure

```text
stegano-web/
├── backend/                  # Python API and Core Logic[cite: 9]
│   ├── app.py                # Main server entry point[cite: 9]
│   ├── logic/
│   │   ├── encryption.py     # AES-256-GCM encryption handlers[cite: 9]
│   │   └── steganography.py  # LSB image processing algorithms[cite: 9]
│   ├── test_crypto.py        # Cryptographic unit tests[cite: 9]
│   └── requirements.txt      # Python dependencies[cite: 9]
│
└── frontend/                 # React UI[cite: 9]
    ├── public/               # Static assets[cite: 9]
    ├── src/
    │   ├── services/         # API integration layer[cite: 9]
    │   ├── App.js            # Root React component[cite: 9]
    │   ├── MatrixRain.js     # Custom UI effect component[cite: 9]
    │   └── index.css         # Global styling[cite: 9]
    └── tailwind.config.js    # Tailwind configuration[cite: 9]
```

## 🛠 System Setup

To run this application locally, you will need to start both the Python backend and the React frontend.

### Prerequisites
* Node.js (v16+) and npm
* Python 3.8+
* Git

### 1. Backend Setup (Python)

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and install the dependencies[cite: 9]:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

Run the backend server[cite: 9]:
```bash
python app.py
```

### 2. Frontend Setup (React)

Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install the Node dependencies[cite: 9]:
```bash
npm install
```

Start the development server:
```bash
npm start
```
The frontend will typically run on `http://localhost:3000` and communicate with the local Python API.

## 🧪 Testing

The repository includes a test suite to verify the integrity of the cryptographic algorithms. To run the tests, navigate to the backend directory and execute[cite: 9]:
```bash
pytest test_crypto.py
```

## 📫 Connect

* **LinkedIn:** [Antariksh Mohapatra](https://www.linkedin.com/in/antariksh-mohapatra/)
* **Email:** [antariksh19m@gmail.com](mailto:antariksh19m@gmail.com)
* **GitHub:** [@antariksh19](https://github.com/antariksh19)

## 📄 License
Distributed under the MIT License.
