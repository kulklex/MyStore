import axios from "axios";
import { baseUrl, store } from "../main"
import { refreshTokens } from "../redux/userSlice";

const apiClient = axios.create({
  baseURL: 'https://m-store-server.onrender.com', 
});


apiClient.interceptors.request.use(
  (config) => {
    const userToken = JSON.parse(localStorage.getItem('userToken'));
    if (userToken && userToken.accessToken) {
      config.headers['x-refresh-token'] = userToken.refreshToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const userToken = JSON.parse(localStorage.getItem('userToken'));
        const refreshToken = userToken ? userToken.refreshToken : null;

        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(`${baseUrl}/api/auth/refresh-token`, 
          { token: refreshToken },
          { headers: { 'x-refresh-token': refreshToken } } // Set x-refresh-token header
        );

        if (response.status === 200) {
          const { accessToken } = response.data;

          // Update local storage with new access token
          userToken.accessToken = accessToken;
          localStorage.setItem('userToken', JSON.stringify(userToken));

          // Dispatch refreshTokens action to update state
          store.dispatch(refreshTokens({ accessToken }));

          // Update the Authorization header in the original request and retry
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          
          return axios(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
