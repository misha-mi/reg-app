import axios from "axios";

export default function getUsers() {
  return axios({
    method: "GET",
    url: "http://localhost:8000/users/getUsers",
    withCredentials: true,
  });
}
