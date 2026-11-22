import { createBrowserRouter, Navigate } from 'react-router';

import { AppLayout } from './components/AppLayout';
import { CarListPage } from './pages/CarListPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/cars" replace /> },
      { path: 'cars', element: <CarListPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
