import axios from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';

interface DecryptMessageInput {
  cipherTextBlob: string;
  encryptedData: string;
}

export const useDecryptMessage = (options: UseMutationOptions<unknown, unknown, DecryptMessageInput>) => {
  return useMutation('decryptMessage', async (input: DecryptMessageInput) => {
    const { cipherTextBlob: cipher_text_blob, encryptedData: encrypted_data } = input;
    // const { data } = await axios.post(
    //   'https://api.url.here',
    //   {
    //     cipher_text_blob,
    //     encrypted_data
    //   }
    // );

    const { data } = await axios.get(
      'http://localhost:8080/encrypt',
    );
    return data;
  }, options);
};
