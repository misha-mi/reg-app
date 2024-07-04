import axios from "axios";

export default function getUser() {
  return axios({
    method: "GET",
    url: "http://localhost:8000/users/getUser",
    withCredentials: true,
  });
}
