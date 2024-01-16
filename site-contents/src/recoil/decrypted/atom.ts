import { atom } from 'recoil'

const decryptedMessagesAtom = atom<string[]>({
  key: 'decryptedMessagesAtom',
  default: [],
})

export default decryptedMessagesAtom;
