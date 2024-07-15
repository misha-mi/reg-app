import axios from "axios";

export default function deleteUser(id) {
  return axios({
    method: "DELETE",
    url: `${process.env.REACT_APP_API_URL}/users/delete/${id}`,
    withCredentials: true,
  });
}
