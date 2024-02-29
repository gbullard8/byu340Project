import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";

const useInfo = () => useContext(UserInfoContext);

export default useInfo;