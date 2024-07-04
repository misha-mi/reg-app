import axios from "axios";

export default function deleteUser(id) {
  return axios({
    method: "DELETE",
    url: `http://localhost:8000/users/delete/${id}`,
    withCredentials: true,
  });
}
