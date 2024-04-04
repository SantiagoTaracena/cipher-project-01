import rsa
import base64

def create_new_keys():
    public_key, private_key = rsa.newkeys(2048)
    public_key_encoded = public_key.save_pkcs1().hex()
    public_key_base64 = base64.b64encode(bytes.fromhex(public_key_encoded)).decode()
    private_key_base64 = base64.b64encode(private_key.save_pkcs1()).decode('utf-8')

    return public_key_base64, private_key_base64

def update_public_key(private_key):
    return private_key.publickey()