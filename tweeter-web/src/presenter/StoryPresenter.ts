import { User, AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusPresenter";
import { StatusService } from "../model/service/StatusService";

export const PAGE_SIZE = 10;

export class StoryPresenter extends StatusItemPresenter {

    private service: StatusService;


    private lastItem: Status | null = null;

    public constructor(view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    public async loadMoreItems(authToken: AuthToken, user: User) {
        try {
            if (this.hasMoreItems) {
                let [newItems, hasMore] = await this.service.loadMoreStoryItems(authToken, user, PAGE_SIZE, this.lastItem);

                this.hasMoreItems = hasMore;
                this.lastItem = newItems[newItems.length - 1];
                this.view.addItems(newItems);
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to load story items because of exception: ${error}`
            );
        }
    };
}