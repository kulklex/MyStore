import axios from "axios";
import { baseUrl, store } from "../main"
import { refreshTokens } from "../redux/userSlice";


const apiClient = axios.create({
  baseURL: "https://m-store-server.onrender.com", 
});

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = JSON.parse(localStorage.getItem('userToken')).refreshToken;;
      const response = await axios.post(`${baseUrl}/api/auth/refresh-token`, { token: refreshToken });

      if (response.status === 200) {
        const { accessToken } = response.data;
        store.dispatch(refreshTokens({ accessToken }));

        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
