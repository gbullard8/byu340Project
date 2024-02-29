import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export interface UserNavigationHooksView {
  setDisplayedUser: (currentUser: User) => void;
  displayErrorMessage: (message: string) => void;

}



export class UserNavigationHooksPresenter {
  service: UserService = new UserService();
  view: UserNavigationHooksView;

  constructor(view: UserNavigationHooksView) {
    this.view = view;

  }
  async Navigate(currentUser: User, authToken: AuthToken, userAlias: string) {
    try {
      let alias = this.extractAlias(userAlias);
      let user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }


  extractAlias = (value: string): string => {
    let index = value.indexOf("@");
    return value.substring(index);
  };

}
export default UserNavigationHooksView
