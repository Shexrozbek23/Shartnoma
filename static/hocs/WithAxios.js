import { useContext, useMemo } from 'react';
import axios from 'axios';
import PageAlertProvider from '../vibe/components/PageAlert/PageAlertContext';
import { fetchRequest } from '../helpers/createRequest';

const WithAxios = ({ children }) => {
  const ctx = useContext(PageAlertProvider);

  useMemo(() => {
    fetchRequest.interceptors.response.use(
      response => response,
      async error => {
        if (error.response.status == 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(error);
        } else if (error.response.status == 400) {
          alert(JSON.stringify(error.response.data));
          return error.response;
        } else if (error.response.status == 500) {
          //   alert('Тизим вақтинчалик ўзгаришлар жараёнида');
          ctx.setAlert('Тизим вақтинчалик ўзгаришлар жараёнида', 'danger');
          return Promise.reject(error);
        } else if (error.response.status === 402) {
          //   window.location.href = '/payment';
          ctx.setAlert('Ушбу вилоятга хисоблаш учун берилган лимит тугаган', 'danger');
          return Promise.reject(error);
          // return error.response;
        }
      }
    );
  }, []);

  return children;
};

export default WithAxios;
