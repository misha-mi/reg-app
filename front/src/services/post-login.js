import axios from "axios";

export default function postLogin(authData) {
  return axios({
    method: "POST",
    url: "http://localhost:8000/users/login",
    data: authData,
    withCredentials: true,
  });
}
