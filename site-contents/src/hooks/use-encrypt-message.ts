import axios from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';

interface EncryptMessageInput {
  keyId: string;
  message: string;
}
const { REACT_APP_PUBLIC_API_URL } = process.env;

export const useEncryptMessage = (options: UseMutationOptions<unknown, unknown, EncryptMessageInput>) => {
  return useMutation('encryptMessage', async (input: EncryptMessageInput) => {
    const { keyId: keyid, message: plainmessage } = input;
    console.log(REACT_APP_PUBLIC_API_URL); 
    const { data } = await axios.post(
      REACT_APP_PUBLIC_API_URL + '/encryption',
      {
        keyid,
        plainmessage
      }
    );

    // const { data } = await axios.get(
    //   'http://localhost:8080/encrypt',
    // );

    // return {
    //   body: {
    //     cipher_text_blob: 'cipher',
    //     encrypted_data: 'encrypted_data',
    //   }
    // }
    return data;
  }, options);
};
