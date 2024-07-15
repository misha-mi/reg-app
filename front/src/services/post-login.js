import axios from "axios";

export default function postLogin(authData) {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/users/login`,
    data: authData,
    withCredentials: true,
  });
}
