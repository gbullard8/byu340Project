import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LogoutView {
  clearUserInfo: () => void;
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, num: number) => void;
  clearLastInfoMessage: () => void;
}

export class LogoutPresenter {
  view: LogoutView;
  service: UserService = new UserService();

  constructor(view: LogoutView) {
    this.view = view;
  }

  async logout(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);
    try {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}