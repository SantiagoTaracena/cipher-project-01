import rsa
import base64
import secrets
import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding

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

    return encrypted_message.hex()

def decipher_direct_message(private_key_base64, encrypted_message_hex):
    private_key_bytes = base64.b64decode(private_key_base64.encode())
    private_key = rsa.PrivateKey.load_pkcs1(private_key_bytes)
    encrypted_message = bytes.fromhex(encrypted_message_hex)
    decrypted_message = rsa.decrypt(encrypted_message, private_key).decode()

    return decrypted_message

def generate_group_key():
    return secrets.token_bytes(16).hex()

def cipher_group_message(key, message):
    message = message.encode('utf-8')
    key = bytes.fromhex(key)
    iv = os.urandom(16)
    padder = padding.PKCS7(128).padder()
    padded_message = padder.update(message) + padder.finalize()
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_message) + encryptor.finalize()

    return (iv + ciphertext).hex()

def decipher_group_message(key, encrypted_message_hex):
    encrypted_message = bytes.fromhex(encrypted_message_hex)
    key = bytes.fromhex(key)
    iv = encrypted_message[:16]
    encrypted_message = encrypted_message[16:]
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_message = decryptor.update(encrypted_message) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    message = unpadder.update(padded_message) + unpadder.finalize()
    message = message.decode('utf-8')

    return message
