import base64
import boto3
import json
from Crypto import Random
from Crypto.Cipher import AES
from urllib import parse


BS = 16
pad = lambda s: s + (BS - len(s.encode('utf-8')) % BS) * chr(BS - len(s.encode('utf-8')) % BS)
unpad = lambda s : s[:-ord(s[len(s)-1:])]


def decrypt_data( encrypted_data, cipher_text_blob):
    kms_client = boto3.client('kms')
    encrypted_data = base64.b64decode(encrypted_data)
    iv = encrypted_data[:BS]
    decrypted_key = kms_client.decrypt(CiphertextBlob=cipher_text_blob).get('Plaintext')
    cipher = AES.new(decrypted_key, AES.MODE_CBC , iv) 
    dec = cipher.decrypt(encrypted_data[BS:])
    return unpad(dec).decode('utf-8')

def handler(event, context):
    print('request: {}'.format(json.dumps(event)))
    if event['cipher_text_blob']:
        cipher_text_blob = base64.b85decode(event['cipher_text_blob'])
    if event['encrypted_data']:
         encrypted_data = base64.b85decode(event['encrypted_data'])
    
    if not cipher_text_blob:
        return {
            'statusCode': 400,
            'body': 'Missing cipher_text_blob'
        }
    if not encrypted_data:
        return {
            'statusCode': 400,
            'body': 'Missing encrypted_data'
        }
        
    plainmessage = decrypt_data(encrypted_data, cipher_text_blob)
        
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/plain'
        },
        'body': {
            'plainmessage':plainmessage
        }
    }