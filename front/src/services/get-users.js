import axios from "axios";

export default function getUsers() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/users/getUsers`,
    withCredentials: true,
  });
}
