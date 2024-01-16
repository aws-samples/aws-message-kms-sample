import { atom } from 'recoil'

const cipherTextBlobAtom = atom<string>({
  key: 'cipherTextBlobAtom',
  default: '',
})

export default cipherTextBlobAtom;
