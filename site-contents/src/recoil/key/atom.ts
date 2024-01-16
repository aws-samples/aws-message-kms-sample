import { atom } from 'recoil'

const keyArnAtom = atom<string>({
  key: 'keyArnAtom',
  default: '',
})

export default keyArnAtom;
