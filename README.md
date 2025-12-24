🔐 SteganoWeb: Secure Image Steganography
SteganoWeb is a full-stack security application that combines AES-256-GCM Encryption with Least Significant Bit (LSB) Steganography. It allows users to hide encrypted secret messages within standard PNG images, ensuring both data confidentiality and deniability.

🚀 Key Features
Dual-Layer Security: Messages are first encrypted using AES-256-GCM before being embedded.

High Fidelity: Uses LSB substitution to ensure the stego-image is visually indistinguishable from the original.

Tamper Detection: AES-GCM provides an authentication tag to ensure the hidden data hasn't been modified.

Zero-Knowledge: The server processes images in memory (RAM); no secret data or images are stored in a database.

🛠️ Tech Stack
Frontend
React.js: Component-based UI for a seamless Single Page Application experience.

Axios: For asynchronous multi-part file uploads.

CSS/Tailwind: Modern, responsive security-themed interface.

Backend
Flask (Python): RESTful API for handling cryptographic and image processing logic.

PyCryptodome: Industry-standard library for AES-GCM implementation.

Pillow & NumPy: High-performance pixel manipulation and image handling.

💡 Why LSB + AES-GCM?
Standard steganography often hides plain text, which can be easily extracted. By using AES-GCM, even if an attacker detects the hidden data, they cannot read it without the password. Furthermore, the GCM mode ensures that if even a single pixel is altered, the decryption will fail, alerting the user to a potential "Man-in-the-Middle" attack.