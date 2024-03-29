import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import useInfo from "./components/userInfo/userInfoHook";
import { FollowingPresenter } from "./presenter/FollowingPresenter";
import { UserItemView } from "./presenter/UserItemPresenter";
import { FollowersPresenter } from "./presenter/FollowersPresenter";
import { StatusItemView } from "./presenter/StatusPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";

const App = () => {
  const { currentUser, authToken } = useInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {


  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <StatusItemScroller
              presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
            />
          }
        />
        <Route
          path="story"
          element={
            <StatusItemScroller
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
            />
          }
        />
        <Route
          path="following"
          element={
            <UserItemScroller
              presenterGenerator={(view: UserItemView) => new FollowingPresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              presenterGenerator={(view: UserItemView) => new FollowersPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
