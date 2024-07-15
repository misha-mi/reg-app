import axios from "axios";

export default function getUser() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/users/getUser`,
    withCredentials: true,
  });
}
