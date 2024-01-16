import axios from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';

interface DecryptMessageInput {
  cipherTextBlob: string;
  encryptedData: string;
}

export const useDecryptMessage = (options: UseMutationOptions<unknown, unknown, DecryptMessageInput>) => {
  return useMutation('decryptMessage', async (input: DecryptMessageInput) => {
    if (!process.env.REACT_PUBLIC_API_URL) {
      return null;
    }
    const { cipherTextBlob: cipher_text_blob, encryptedData: encrypted_data } = input;
    const { data } = await axios.post(
      process.env.REACT_PUBLIC_API_URL + 'decryption',
      {
        cipher_text_blob,
        encrypted_data
      }
    );

    // const { data } = await axios.get(
    //   process.env.REACT_PUBLIC_API_URL+'decrypt',
    // );
    return data;
  }, options);
};
