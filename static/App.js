import React, { useContext, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthContext from './store/auth-context';
import './vibe/scss/styles.scss';
import Login from './views/pages/Login/Login';
import createRequest, { fetchRequest } from './helpers/createRequest';
import Limit from './views/pages/Limit/Limit';

const getRegions = async () => {
  const regions = await createRequest.get('regions/').then(res => res.data);
  return regions;
};

const getDistricts = async () => {
  const districts = await createRequest.get('districts/').then(res => res.data);
  return districts;
};

const getExpenses = async () => {
  const expenses = await createRequest.get('expenses/').then(res => res.data);
  return expenses;
};

const getRole = async () => {
  const role = await fetchRequest.get('user/').then(res => res.data);
  return role;
};

export default function App() {
  const authCtx = useContext(AuthContext);

  useEffect(async () => {
    if (authCtx.isLoggedIn && window.location.pathname != '/payment') {
      if (authCtx.role == null) {
        const role = await getRole();
        authCtx.getRole(role.user_role);
      }

      if ((authCtx.regions = [])) {
        const regions = await getRegions();
        authCtx.fetchRegion(regions);
      }

      if ((authCtx.districts = [])) {
        const districts = await getDistricts();
        authCtx.fetchDistrict(districts);
      }

      if ((authCtx.crops = [])) {
        const crops = await getExpenses();
        authCtx.fetchCrop(crops);
      }
    }
  }, []);

  return (
    <Switch>
      {!authCtx.isLoggedIn && (
        <Route path="/login">
          <Login />
        </Route>
      )}
      {authCtx.isLoggedIn && (
        <Route path="/payment">
          <Limit />
        </Route>
      )}
      {authCtx.isLoggedIn && <Route component={DashboardLayout} />}
      {!authCtx.isLoggedIn && <Redirect to="/login" />}
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}
