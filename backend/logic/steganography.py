from PIL import Image
import numpy as np

def hide_message(image_file, encrypted_payload):
    # 1. Open image and convert to a NumPy array
    img = Image.open(image_file).convert('RGB')
    pixels = np.array(img)
    
    # 2. Add a 'delimiter' so we know where the message ends during decoding
    # We add '#####', which is 5 hash symbols as a stopping signal
    payload = encrypted_payload + b'#####'
    
    # 3. Convert bytes to a flat list of bits
    bits = []
    for byte in payload:
        for i in range(8):
            bits.append((byte >> (7 - i)) & 1)
    
    # 4. Flatten the pixel data to make bit injection easier
    flat_pixels = pixels.flatten()
    
    if len(bits) > len(flat_pixels):
        raise ValueError("Image is too small to hold this message!")
    
    # 5. The Core LSB Move: 
    # For each bit in our message, set the LSB of the corresponding pixel to that bit
    for i in range(len(bits)):
        # Clear the last bit (AND 254) then OR it with our secret bit
        flat_pixels[i] = (flat_pixels[i] & 254) | bits[i]
    
    # 6. Reshape back to image dimensions and save
    new_pixels = flat_pixels.reshape(pixels.shape)
    return Image.fromarray(new_pixels.astype('uint8'))

def extract_message(image_file):
    img = Image.open(image_file).convert('RGB')
    pixels = np.array(img).flatten()
    
    # Extract LSB from every pixel
    extracted_bits = [pixels[i] & 1 for i in range(len(pixels))]
    
    # Convert bits back to bytes
    all_bytes = bytearray()
    for i in range(0, len(extracted_bits), 8):
        byte = 0
        for bit in range(8):
            if i + bit < len(extracted_bits):
                byte = (byte << 1) | extracted_bits[i + bit]
        all_bytes.append(byte)
        
        # Check if we hit our delimiter '#####'
        if all_bytes.endswith(b'#####'):
            return all_bytes[:-5] # Return message without the delimiter
            
    return all_bytes