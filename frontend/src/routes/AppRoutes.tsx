import { Routes, Route } from 'react-router-dom';
import Login from '../components/login/login';
import MainRoutes from './MainRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/events" element={<div>Events Page</div>} />
      {
        MainRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))
      }
    </Routes>
  );
}

export default AppRoutes;