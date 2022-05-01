import axios from 'axios';
import { BASE_URL } from '../constants/variables';

export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
export const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'X-CSRFToken': getCookie('csrftoken'),
    'Content-Type': 'application/json',
  },
});

export const fetchRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'X-CSRFToken': getCookie('csrftoken'),
    'Content-Type': 'application/json',
  },
});

export const authRequest = axios.create({
  baseURL: BASE_URL,
  'X-CSRFToken': getCookie('csrftoken'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// fetchRequest.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response.status == 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//       return Promise.reject(error);
//     } else if (error.response.status == 400) {
//       alert(JSON.stringify(error.response.data));
//       return error.response;
//     } else if (error.response.status == 500) {
//       alert('Тизим вақтинчалик ўзгаришлар жараёнида');
//       return Promise.reject(error);
//     } else if (error.response.status === 402) {
//       // alert(JSON.stringify(error.response.data));
//       window.location.href = '/payment'
//       return Promise.reject(error);
//       // return error.response;
//     }
//   }
// );

export default request;
