import struct
from PIL import Image
import io

def hide_message(image_file, payload):
    # Force RGB to avoid bit-shifts from Alpha channels
    img = Image.open(image_file).convert('RGB')
    pixels = list(img.getdata())
    
    # 1. Create a 4-byte header representing the length of the payload
    header = struct.pack('>I', len(payload))
    data_to_hide = header + payload
    
    # 2. Convert bytes to a flat list of bits
    bits = []
    for byte in data_to_hide:
        for i in range(8):
            bits.append((byte >> (7 - i)) & 1)

    if len(bits) > len(pixels) * 3:
        raise ValueError("IMAGE_CAPACITY_EXCEEDED")

    # 3. Inject bits into the LSB of each color channel
    new_pixels = []
    bit_idx = 0
    total_bits = len(bits)
    
    for px in pixels:
        channels = list(px)
        for i in range(3): # R, G, B
            if bit_idx < total_bits:
                # Clear the LSB and set it to our bit
                channels[i] = (channels[i] & ~1) | bits[bit_idx]
                bit_idx += 1
        new_pixels.append(tuple(channels))

    out_img = Image.new("RGB", img.size)
    out_img.putdata(new_pixels)
    return out_img

def extract_message(image_file):
    img = Image.open(image_file).convert('RGB')
    pixels = list(img.getdata())
    
    # 1. Extract ALL LSBs into a flat list
    all_lsbs = []
    for px in pixels:
        for i in range(3):
            all_lsbs.append(px[i] & 1)
            
    # 2. Parse the first 32 bits to get the payload length
    header_bits = all_lsbs[:32]
    header_bytes = []
    for i in range(0, 32, 8):
        byte = 0
        for bit in header_bits[i:i+8]:
            byte = (byte << 1) | bit
        header_bytes.append(byte)
    
    payload_length = struct.unpack('>I', bytes(header_bytes))[0]
    
    # 3. Extract exactly the required number of payload bits
    payload_bits = all_lsbs[32 : 32 + (payload_length * 8)]
    payload_bytes = []
    for i in range(0, len(payload_bits), 8):
        byte = 0
        for bit in payload_bits[i:i+8]:
            byte = (byte << 1) | bit
        payload_bytes.append(byte)
        
    return bytes(payload_bytes)