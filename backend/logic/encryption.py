from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Random import get_random_bytes

def get_key(password, salt):
    # Turns a simple password into a strong 32-byte key
    return PBKDF2(password, salt, dkLen=32, count=1000000)

def encrypt_data(data, password):
    salt = get_random_bytes(16)
    key = get_key(password, salt)
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(data.encode('utf-8'))
    # Return everything needed to decrypt later
    return salt + cipher.nonce + tag + ciphertext

def decrypt_data(combined_data, password):
    # 1. Extract the parts from the combined blob
    salt = combined_data[:16]
    nonce = combined_data[16:32]
    tag = combined_data[32:48]
    ciphertext = combined_data[48:]

    # 2. Re-derive the same key using the same salt
    key = get_key(password, salt)

    # 3. Decrypt and Verify
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    try:
        decrypted_message = cipher.decrypt_and_verify(ciphertext, tag)
        return decrypted_message.decode('utf-8')
    except ValueError:
        return "ERROR: Incorrect password or corrupted image."