import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

import { authRequest } from '../../../helpers/createRequest';
import AuthContext from '../../../store/auth-context';
import classes from './Limit.module.css';

const Limit = props => {
  return (
    <section className={classes.auth}>
      <h1>Ушбу вилоятга хисоблаш учун берилган лимит тугаган!</h1>
      <Link to="/home">Асосий саҳивага ўтиш</Link>
    </section>
  );
};

export default Limit;
