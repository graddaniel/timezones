import { Routes, Route, Navigate } from 'react-router-dom';

import RequireAuthorization from './components/hoc/RequireAuthorization';

import Menu from './containers/Menu';
import Login from './containers/Login';
import Register from './containers/Register';

import Forbidden403 from './components/status-pages/403';
import NotFound404 from './components/status-pages/404';

import './App.css';
import React from 'react';
import useRole from './hooks/useRole';

import config from './config.json';

const {
  roles: {
    user: USER,
    userManager: USER_MANAGER,
    admin: ADMIN,
  }
} = config;

function App() {
  const role = useRole();

  const generateMainPageRedirection = () => {
    switch(role) {
      case USER:
        return <Navigate to="/timezones" />;
      case USER_MANAGER:
      case ADMIN:
        return <Navigate to="/users" />;
      default:
        return <Navigate to="/login" />;
    }
  } 

  return (
    <React.Fragment>
      <Menu />
      <div className="App">
      <Routes>
        <Route
          path="/"
          element={generateMainPageRedirection()}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/timezones"
          element={
            <RequireAuthorization requiredRoles={[USER, ADMIN]}>
              <div>Timezones</div>
            </RequireAuthorization>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuthorization requiredRoles={[USER_MANAGER, ADMIN]}>
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
    </React.Fragment>
  );
}

export default App;
