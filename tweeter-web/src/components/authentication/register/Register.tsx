import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../../authenticationFields/AuthenticationFields";
import useInfo from "../../userInfo/userInfoHook";
import { RegisterPresenter, RegisterView } from "../../../presenter/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;


  const { updateUserInfo } = useInfo();
  const { displayErrorMessage } = useToastListener();
  const navigate = useNavigate();

  const listener: RegisterView = {
    setFirstName: setFirstName,
    setLastName: setLastName,
    setAlias: setAlias,
    setPassword: setPassword,
    setImageBytes: setImageBytes,
    setImageUrl: setImageUrl,
    setRememberMe: setRememberMe,
    updateUserInfo: (currentUser: User, displayedUser: User | null,
      authToken: AuthToken) => updateUserInfo(currentUser, displayedUser,
        authToken, rememberMeRef.current),
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  }

  const [registerPresenter] = useState(new RegisterPresenter(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return !firstName || !lastName || !alias || !password || !imageUrl;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    registerPresenter.handleImageFile(file);
  };



  const doRegister = async () => {
    registerPresenter.doRegister(firstName, lastName, alias, password, imageBytes);
  };



  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields
          setAlias={(event) => setAlias(event.target.value)}
          setPassword={(event) => setPassword(event.target.value)}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onChange={handleFileChange}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doRegister}
    />
  );
};

export default Register;
