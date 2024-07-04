import { useState } from "react";
import Button from "../../ui/button/button";
import Input from "../../ui/input/input";
import "./auth-page.sass";
import postLogin from "../../services/post-login";
import { useNavigate } from "react-router-dom";
import Spinner from "../../ui/spinner/spinner";

const AuthPage = ({ setRole }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlerAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    postLogin({ login, password })
      .then((res) => {
        setRole(res.data);
        navigate("/");
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
