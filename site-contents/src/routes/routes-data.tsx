import { routerType } from '../types';
import { Decryption } from './decryption';
import { Encryption } from './encryption';
import { Home } from './home';

const routesData: routerType[] = [
  {
    path: "",
    element: <Home />,
    title: "home"
  },
  {
    path: "encryption",
    element: <Encryption />,
    title: "encryption"
  },
  {
    path: "decryption",
    element: <Decryption />,
    title: "decryption"
  },
];

export default routesData;