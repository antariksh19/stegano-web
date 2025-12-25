from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Random import get_random_bytes

def encrypt_data(message, password):
    # 1. Generate a random salt
    salt = get_random_bytes(16)
    # 2. Derive a 32-byte key from the password
    key = PBKDF2(password, salt, dkLen=32, count=100000)
    
    # 3. Encrypt using AES-GCM
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(message.encode('utf-8'))
    
    # 4. Return Salt + Nonce + Tag + Ciphertext as a single byte string
    return salt + cipher.nonce + tag + ciphertext

def decrypt_data(payload, password):
    try:
        # 1. Extract the components based on fixed lengths
        salt = payload[:16]
        nonce = payload[16:32]
        tag = payload[32:48]
        ciphertext = payload[48:]
        
        # 2. Re-derive the same key
        key = PBKDF2(password, salt, dkLen=32, count=100000)
        
        # 3. Decrypt and verify the tag
        cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
        decrypted_message = cipher.decrypt_and_verify(ciphertext, tag)
        
        return decrypted_message.decode('utf-8')
    except (ValueError, KeyError):
        # This is triggered if the password is wrong or bits are corrupted
        raise ValueError("AUTHENTICATION_FAILED")