import axios from 'axios'
// make connection to api
const requestInstance = axios.create({
    baseURL: '/api/',
    timeout: 5000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

// refresh connection to api
requestInstance.interceptors.response.use(
    response => response,
    error => {
        let remember= JSON.parse(localStorage.getItem("remember"));
       if(remember==true) {
           const originalRequest = error.config;

           // Prevent infinite loops
           let baseURL = "http://127.0.0.1:8000/";
           if (error.response.status === 401 && originalRequest.url === baseURL + 'user/token/refresh/') {

               window.location.href = '/sign-in';
               return Promise.reject(error);
           }

           if (error.response.data.code === "token_not_valid" &&
               error.response.status === 401 &&
               error.response.statusText === "Unauthorized") {
               console.log("if2")
               const refreshToken = localStorage.getItem('refresh_token');

               if (refreshToken) {
                   console.log("if2_1")
                   const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                   // exp date in token is expressed in seconds, while now() returns milliseconds:
                   const now = Math.ceil(Date.now() / 1000);
                   console.log(tokenParts.exp);

                   if (tokenParts.exp > now) {
                       console.log("if2_1_1")
                       return requestInstance
                           .post('user/token/refresh/', {refresh: refreshToken})
                           .then((response) => {

                               localStorage.setItem('access_token', response.data.access);
                               localStorage.setItem('refresh_token', response.data.refresh);

                               requestInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                               originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                               console.log("if2_1_1_1")
                               return requestInstance(originalRequest);
                           })
                           .catch(err => {
                               console.log("if2_1_1_2")
                               console.log(err)
                           });
                   } else {
                       console.log("if2_1_2")
                       console.log("Refresh token is expired", tokenParts.exp, now);
                       window.location.href = 'user/login/';
                   }
               } else {
                   console.log("if2_2")
                   console.log("Refresh token not available.")
                   window.location.href = 'user/login/';
               }
           }
       }
        console.log("ERROR")
      // specific error handling done elsewhere
      return Promise.reject(error);
  }
);


export default requestInstance
