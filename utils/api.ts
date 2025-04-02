import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/api`,
});

export default api;
