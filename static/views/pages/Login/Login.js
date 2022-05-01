import React, { useState, useRef, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';

import { authRequest } from '../../../helpers/createRequest';
import AuthContext from '../../../store/auth-context';
import classes from './Login.module.css';

const Login = props => {
  //   const history = useNavigate();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  const submitHandler = e => {
    e.preventDefault();

    const enteredUsername = usernameRef.current.value;
    const enteredPassword = passwordRef.current.value;

    if (isLogin) {
      authRequest
        .post('auth/', {
          username: enteredUsername,
          password: enteredPassword,
        })
        .then(res => {
          const { data } = res;
          console.log(res);
          authCtx.login(data.token);
        })
        .catch(e => {
          console.log(e.response.status);
          alert('Бундай фойдаланувчи мавжуд емас!');
        });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Тизимга кириш' : "Рўйхатдан ўтиш"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Исм</label>
          <input type="text" id="username" placeholder="Исм" ref={usernameRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Парол</label>
          <input type="password" id="password" placeholder="Парол" ref={passwordRef} required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Кириш' : 'Яратиш'}</button>
          <button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
            {isLogin ? "Рўйхатдан ўтиш" : 'Мавжуд фойдаланувчи сифатида кириш'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Login;
