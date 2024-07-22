import axios from "axios";

export default function deleteConfig(id) {
  return axios({
    method: "DELETE",
    url: `${process.env.REACT_APP_API_URL}/users/deleteConfig/${id}`,
    withCredentials: true,
  });
}
