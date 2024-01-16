import axios from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';

interface EncryptMessageInput {
  keyId: string;
  message: string;
}

export const useEncryptMessage = (options: UseMutationOptions<unknown, unknown, EncryptMessageInput>) => {
  return useMutation('encryptMessage', async (input: EncryptMessageInput) => {
    const { keyId: keyid, message: plainmessage } = input;
    // const { data } = await axios.post(
    //   'http://localhost:8080/encrypt',
    //   {
    //     keyid,
    //     plainmessage
    //   }
    // );

    // const { data } = await axios.get(
    //   'http://localhost:8080/encrypt',
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
