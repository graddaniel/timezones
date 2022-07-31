import { Routes, Route, useLocation } from 'react-router-dom';

import RequireAuthorization from './components/hoc/RequireAuthorization';

import Menu from './containers/Menu';
import Login from './containers/Login';

import Forbidden403 from './components/status-pages/403';
import NotFound404 from './components/status-pages/404';

import './App.css';


function App() {
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== "/login" && (
        <Menu />
      )}
      <Routes>
        <Route
          path="/"
          element={<div>TODO ADD</div>}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<div>register</div>}
        />
        <Route
          path="/timezones"
          element={
            <RequireAuthorization requiredRoles={['user', 'admin']}>
              <div>Timezones</div>
            </RequireAuthorization>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuthorization requiredRoles={['userManager', 'admin']}>
              <div>Users</div>
            </RequireAuthorization>
          }
        />
        <Route
          path="/403"
          element={
            <Forbidden403 />
          }
        />
        <Route
          path="*"
          element={
            <NotFound404 />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
