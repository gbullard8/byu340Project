import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
  setRememberMe: (rememberMe: boolean) => void;
  navigate: NavigateFunction;
  updateUserInfo: (currentUser: User, displayedUser: User | null,
    authToken: AuthToken) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  view: LoginView;
  service: UserService = new UserService();

  constructor(view: LoginView) {
    this.view = view;
  }

  async doLogin(alias: string, password: string, originalUrl: string) {
    try {
      let [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    }
  }

}