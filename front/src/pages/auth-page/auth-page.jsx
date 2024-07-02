import { useState } from "react";
import Button from "../../ui/button/button";
import Input from "../../ui/input/input";
import "./auth-page.sass";
import postLogin from "../../services/post-login";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ setRole }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlerAuth = (e) => {
    e.preventDefault();
    const authData = {
      login,
      password,
    };
    postLogin(authData)
      .then((res) => {
        setRole(res.data);
        navigate("/");
      })
      .catch(() => console.log("error"));
  };

  return (
    <form className="auth-page" onSubmit={handlerAuth}>
      <div className="auth-page__title">Login</div>
      <div className="auth-page__input">
        <Input value={login} setValue={setLogin} />
      </div>
      <div className="auth-page__title">Password</div>
      <div className="auth-page__input">
        <Input value={password} setValue={setPassword} />
      </div>
      <div className="auth-page__button">
        <Button classNames={["button_w215"]}>Log in</Button>
      </div>
    </form>
  );
};

export default AuthPage;
