import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface RegisterView {
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setAlias: (alias: string) => void;
    setPassword: (password: string) => void;
    setImageBytes: (imagebytes: Uint8Array) => void;
    setImageUrl: (imageUrl: string) => void;
    setRememberMe: (rememberMe: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null,
        authToken: AuthToken) => void;
    displayErrorMessage: (message: string) => void;
    navigate: NavigateFunction;
}

export class RegisterPresenter {
    view: RegisterView;
    service: UserService = new UserService();

    constructor(view: RegisterView) {
        this.view = view;
    }



    public handleImageFile = (file: File | undefined) => {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
        } else {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    };

    async doRegister(firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array) {
        try {
            let [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes
            );

            this.view.updateUserInfo(user, user, authToken);
            this.view.navigate("/");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        }
    }


}