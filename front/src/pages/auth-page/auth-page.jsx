import { useState } from "react";
import Button from "../../ui/button/button";
import Input from "../../ui/input/input";
import "./auth-page.sass";
import postLogin from "../../services/post-login";
import { useNavigate } from "react-router-dom";
import Spinner from "../../ui/spinner/spinner";
import deleteConfig from "../../services/delete-config";

const AuthPage = ({ setRole, setId, password, setPassword }) => {
  const [login, setLogin] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const downloadConfig = async (id, password) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/getConfig`,
      {
        method: "POST",
        headers: {
          withCredentials: true,
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          id,
          password,
        }),
      }
    );

    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "cfg.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    deleteConfig(id);
  };

  const handlerAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    postLogin({ login, password })
      .then((res) => {
        setRole(res.data.role);
        setId(res.data.id);
        if (res.data.role === "user") {
          downloadConfig(res.data.id, password);
        } else {
          navigate("/");
        }
      })
      .catch((res) => setErrors(res.response.data.error.split(",")))
      .finally(() => setIsLoading(false));
  };

  return (
    <form className="auth-page" onSubmit={handlerAuth}>
      <div className="auth-page__title">Login</div>
      <div className="auth-page__input">
        <Input
          value={login}
          setValue={setLogin}
          error={errors.filter((item) => item.includes("login"))[0]}
        />
      </div>
      <div className="auth-page__title">Password</div>
      <div className="auth-page__input">
        <Input
          value={password}
          setValue={setPassword}
          error={errors.filter((item) => item.includes("password"))[0]}
        />
      </div>
      <div className="auth-page__button">
        <Button classNames={["button_w215"]} isLoading={isLoading}>
          Log in
        </Button>
      </div>
    </form>
  );
};

export default AuthPage;
