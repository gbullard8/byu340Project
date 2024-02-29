import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


export interface PostStatusView {
    setPost: (post: string) => void;
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, num: number) => void;
    clearLastInfoMessage: () => void;

}

export class PostStatusPresenter {
    view: PostStatusView;
    service: StatusService = new StatusService();

    constructor(view: PostStatusView) {
        this.view = view;
    }

    async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        try {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.clearLastInfoMessage();
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        }
    }
    public clearPost() {
        this.view.setPost("");
    }
}