import axios from "axios";

export default function postCreate(newUserData) {
  return axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/users/register`,
    data: newUserData,
    withCredentials: true,
  });
}
