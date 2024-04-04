import rsa
import base64

def create_new_keys():
    public_key, private_key = rsa.newkeys(2048)
    public_key_encoded = public_key.save_pkcs1().hex()
    public_key_base64 = base64.b64encode(bytes.fromhex(public_key_encoded)).decode()
    private_key_base64 = base64.b64encode(private_key.save_pkcs1()).decode('utf-8')

    return public_key_base64, private_key_base64

def update_public_key(private_key_base64):
    private_key_bytes = base64.b64decode(private_key_base64.encode())
    private_key = rsa.PrivateKey.load_pkcs1(private_key_bytes)

    return private_key.publickey()

def cipher_direct_message(public_key_base64, message):
    public_key_bytes = base64.b64decode(public_key_base64.encode())
    public_key = rsa.PublicKey.load_pkcs1(public_key_bytes)
    encrypted_message = rsa.encrypt(message.encode(), public_key)

    return encrypted_message

def decipher_direct_message(private_key_base64, encrypted_message_hex):
    private_key_bytes = base64.b64decode(private_key_base64.encode())
    private_key = rsa.PrivateKey.load_pkcs1(private_key_bytes)
    encrypted_message = bytes.fromhex(encrypted_message_hex)
    decrypted_message = rsa.decrypt(encrypted_message, private_key).decode()

    return decrypted_message