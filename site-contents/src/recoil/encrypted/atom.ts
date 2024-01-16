import { atom } from 'recoil'

export interface EncryptedMessage {
  cipherTextBlob: string;
  encryptedData: string;
};

const encryptedMessagesAtom = atom<EncryptedMessage[]>({
  key: 'encryptedMessagesAtom',
  default: [],
})

export default encryptedMessagesAtom;
