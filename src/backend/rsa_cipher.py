import rsa

def create_new_keys():
    return rsa.newkeys(2048)

def update_public_key(private_key):
    return private_key.publickey()