import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  regions: [],
  districts: [],
  crops: [],
  role: null,
  login: token => {},
  logout: () => {},
  getRole: role => {},
  fetchRegion: regions => {},
  fetchDistrict: districts => {},
  fetchCrop: crops => {},
});

export const AuthContextProvider = props => {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [role, setRole] = useState(null);

  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [crops, setCrops] = useState([]);

  //   let userIsLoggedIn = false;
  //   if (token) {
  //     userIsLoggedIn = true;
  //   }
  const userIsLoggedIn = !!token;
  //   const userRole = role;

  const loginHandler = token => {
    localStorage.setItem('token', token);
    setToken(token);
    console.log(userIsLoggedIn);
    window.location.reload();
  };

  const logoutHandler = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const fetchRegionHandler = regions => {
    setRegions(regions);
  };

  const fetchDistrictHandler = districts => {
    setDistricts(districts);
  };

  const fetchCropHandler = crops => {
    setCrops(crops);
  };

  const getRoleHandler = role => {
    setRole(role);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    regions: regions,
    districts: districts,
    crops: crops,
    role: role,
    login: loginHandler,
    logout: logoutHandler,
    fetchRegion: fetchRegionHandler,
    fetchDistrict: fetchDistrictHandler,
    fetchCrop: fetchCropHandler,
    getRole: getRoleHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
