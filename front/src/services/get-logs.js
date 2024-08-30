import axios from "axios";

export default function getLogs() {
  return axios({
    method: "GET",
    url: `${process.env.REACT_APP_API_URL}/users/getLogs`,
    withCredentials: true,
  });
}
