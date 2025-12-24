from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from logic.encryption import encrypt_data, decrypt_data
from logic.steganography import hide_message, extract_message
import io

app = Flask(__name__)
CORS(app)  # This is the "bridge" that allows React to talk to Flask

@app.route('/api/encode', methods=['POST'])
def encode():
    # 1. Get the data from the React Request
    file = request.files['image']
    message = request.form['message']
    password = request.form['password']

    # 2. Encrypt the message
    encrypted_payload = encrypt_data(message, password)

    # 3. Hide it in the image
    # Note: Person 2's hide_message function will be called here
    stego_img = hide_message(file, encrypted_payload)

    # 4. Save to memory and send back to React
    img_io = io.BytesIO()
    stego_img.save(img_io, 'PNG') # PNG is lossless, essential for LSB
    img_io.seek(0)
    
    return send_file(img_io, mimetype='image/png')

@app.route('/api/decode', methods=['POST'])
def decode():
    file = request.files['image']
    password = request.form['password']

    # 1. Extract the raw bytes from the pixels
    encrypted_payload = extract_message(file)

    # 2. Decrypt the payload back into text
    secret_text = decrypt_data(encrypted_payload, password)

    return jsonify({'message': secret_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)