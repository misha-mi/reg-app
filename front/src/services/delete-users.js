import axios from "axios";

export default function deleteUsers(ids) {
  return axios({
    method: "DELETE",
    url: `${process.env.REACT_APP_API_URL}/users/deleteUsers`,
    data: ids,
    withCredentials: true,
  });
}
