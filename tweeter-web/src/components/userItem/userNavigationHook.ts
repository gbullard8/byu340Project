import useToastListener from "../toaster/ToastListenerHook";
import useInfo from "../userInfo/userInfoHook";
import UserNavigationHooksView, { UserNavigationHooksPresenter } from "../../presenter/UserNavagationHookPresenter";
import { useState } from "react";


const userNavigationHooks = () => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = useInfo();
    const listener: UserNavigationHooksView = {
        setDisplayedUser: setDisplayedUser,
        displayErrorMessage: displayErrorMessage
    }

    const [navPresenter] = useState(new UserNavigationHooksPresenter(listener));

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        navPresenter.Navigate(currentUser!, authToken!, event.target.toString());

    };



    return navigateToUser
}

export default userNavigationHooks;