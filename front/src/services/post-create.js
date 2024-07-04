import axios from "axios";

export default function postCreate(newUserData) {
  return axios({
    method: "POST",
    url: "http://localhost:8000/users/register",
    data: newUserData,
    withCredentials: true,
  });
}
