import base64
import boto3
import json
from Crypto import Random
from Crypto.Cipher import AES
from urllib import parse


BS = 16
pad = lambda s: s + (BS - len(s.encode('utf-8')) % BS) * chr(BS - len(s.encode('utf-8')) % BS)
unpad = lambda s : s[:-ord(s[len(s)-1:])]


def encrypt_data(keyid, plaintext_message):
    kms_client = boto3.client('kms')

    data_key = kms_client.generate_data_key(
        KeyId=keyid,
        KeySpec='AES_256')


    cipher_text_blob = data_key.get('CiphertextBlob')
    plaintext_key = data_key.get('Plaintext')
    # Note, does not use IV or specify mode... for demo purposes only.
    iv = Random.new().read(AES.block_size ) #AES.block_size defaults to 16
    raw = pad( plaintext_message)
    cipher = AES.new( plaintext_key, AES.MODE_CBC, iv) 
    encrypted_data = base64.b64encode( iv + cipher.encrypt( raw.encode('utf-8') ) )

    # Need to preserve both of these data elements
    return encrypted_data, cipher_text_blob


def handler(event, context):
    print('request: {}'.format(json.dumps(event)))
    if event.get('keyid') == None:
        return {
            'statusCode': 400,
            'body': event
        }
    else :
        keyid = event['keyid']
        
    if event.get('plainmessage') == None:
        return {
            'statusCode': 400,
            'body': 'Missing plainmessage'
        }
    else :
        plainmessage = event['plainmessage']
        
    encrypted_data, cipher_text_blob = encrypt_data(keyid,plainmessage)

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/plain'
        },
        'body': {
            'cipher_text_blob':base64.b85encode(cipher_text_blob).decode('utf8'),
            'encrypted_data':base64.b85encode(encrypted_data).decode('utf8')
        }
    }