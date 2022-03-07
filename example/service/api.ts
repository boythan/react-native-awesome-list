import axios from "axios";

const getInstance = () => {
  const instance = axios.create({
    baseURL: "https://api.github.com/",
    timeout: 1000,
  });
  return instance;
};

const API = {
  instance: getInstance(),
  getUserList: () => API.instance.get("users"),
};

export default API;
