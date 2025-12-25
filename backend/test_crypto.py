from logic.encryption import encrypt_data, decrypt_data

msg = "Test 123"
pwd = "password"

# Encrypt
encrypted = encrypt_data(msg, pwd)
print(f"Encrypted Blob: {encrypted.hex()[:20]}...")

# Decrypt
decrypted = decrypt_data(encrypted, pwd)
print(f"Decrypted Message: {decrypted}")

if msg == decrypted:
    print("✅ CRYPTO LOGIC IS PERFECT")
else:
    print("❌ CRYPTO LOGIC IS BROKEN")