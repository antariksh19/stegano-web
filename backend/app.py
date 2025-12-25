from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from logic.encryption import encrypt_data, decrypt_data
from logic.steganography import hide_message, extract_message
import io

app = Flask(__name__)
CORS(app)

@app.route('/api/encode', methods=['POST'])
def encode():
    try:
        # 1. Get the data from the React Request
        file = request.files['image']
        message = request.form['message']
        password = request.form['password']

        # 2. Encrypt the message
        encrypted_payload = encrypt_data(message, password)

        # 3. Hide it in the image
        stego_img = hide_message(file, encrypted_payload)

        # 4. Save to memory and send back to React
        img_io = io.BytesIO()
        stego_img.save(img_io, 'PNG') 
        img_io.seek(0)
        
        return send_file(img_io, mimetype='image/png')
    except Exception as e:
        # If encoding fails (e.g., image too small), return 500
        return jsonify({'error': f"ENCODE_ERROR: {str(e)}"}), 500

@app.route('/api/decode', methods=['POST'])
def decode():
    try:
        file = request.files['image']
        password = request.form['password']
        
        payload = extract_message(file)
        secret_text = decrypt_data(payload, password)
        
        return jsonify({'message': secret_text}), 200
    except ValueError:
        return jsonify({'message': 'AUTH_FAILURE: Invalid Key'}), 401
    except Exception as e:
        return jsonify({'message': f'SYSTEM_ERROR: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)