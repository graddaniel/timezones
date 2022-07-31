import { Routes, Route, Navigate } from 'react-router-dom';

import RequireAuthorization from './components/hoc/RequireAuthorization';

import Menu from './containers/Menu';
import LoginPage from './containers/LoginPage';
import RegistrationPage from './containers/RegistrationPage';
import TimezoneDetailsPage from './containers/TimezoneDetailsPage';
import TimezonesPage from './containers/TimezonesPage';
import UsersPage from './containers/UsersPage';

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
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegistrationPage />}
        />
        <Route
          path="/timezoneDetails"
          element={
            <RequireAuthorization requiredRoles={[USER, ADMIN]}>
              <TimezoneDetailsPage />
            </RequireAuthorization>
          }
        />
        <Route
          path="/timezones"
          element={
            <RequireAuthorization requiredRoles={[USER, ADMIN]}>
              <TimezonesPage />
            </RequireAuthorization>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuthorization requiredRoles={[USER_MANAGER, ADMIN]}>
              <UsersPage />
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
