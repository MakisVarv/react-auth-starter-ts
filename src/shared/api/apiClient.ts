import axios, { type AxiosInstance } from "axios";
import apiUrl from "../../config/env";

const apiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default apiClient;
