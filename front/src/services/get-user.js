import axios from "axios";

export default function getUser() {
  return axios({
    method: "GET",
    url: "http://localhost:8001/users/getUser",
    withCredentials: true,
  });
}
