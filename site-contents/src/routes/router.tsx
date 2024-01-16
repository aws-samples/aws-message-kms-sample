import { Route, Routes } from 'react-router-dom';
import { routerType } from '../types';
import pagesData from './routes-data';

export const Router = () => {
  const pageRoutes = pagesData.map(({ path, title, element }: routerType) => {
    return <Route key={title} path={`/${path}`} element={element} />;
  });

  return <Routes>{pageRoutes}</Routes>;
};
