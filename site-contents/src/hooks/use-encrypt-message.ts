import axios from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';

interface EncryptMessageInput {
  keyId: string;
  message: string;
}

export const useEncryptMessage = (options: UseMutationOptions<unknown, unknown, EncryptMessageInput>) => {
  return useMutation('encryptMessage', async (input: EncryptMessageInput) => {
    const { keyId: keyid, message: plainmessage } = input;
    if (!process.env.REACT_PUBLIC_API_URL) {
      return null;
    }
    const { data } = await axios.post(
      process.env.REACT_PUBLIC_API_URL + 'encrypt',
      {
        keyid,
        plainmessage
      }
    );
    
    // const { data } = await axios.get(
    //   process.env.REACT_PUBLIC_API_URL+'encrypt',
    // );

    return {
      body: {
        cipher_text_blob: 'cipher',
        encrypted_data: 'encrypted_data',
      }
    }
    // return data;
  }, options);
};
