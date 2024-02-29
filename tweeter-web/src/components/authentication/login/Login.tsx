import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../../authenticationFields/AuthenticationFields";
import useInfo from "../../userInfo/userInfoHook";
import { User, AuthToken } from "tweeter-shared";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useInfo();
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: LoginView = {
    setAlias: setAlias,
    setPassword: setPassword,
    setRememberMe: setRememberMe,
    updateUserInfo: (currentUser: User, displayedUser: User | null,
      authToken: AuthToken) => updateUserInfo(currentUser, displayedUser,
        authToken, rememberMeRef.current),
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  }

  const [loginPresenter] = useState(new LoginPresenter(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const doLogin = async () => {
    loginPresenter.doLogin(alias, password, props.originalUrl!)
  };



  const inputFieldGenerator = () => {
    return (
      <AuthenticationFields
        setAlias={(event) => setAlias(event.target.value)}
        setPassword={(event) => setPassword(event.target.value)}
      />
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;
