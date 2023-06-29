import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { system, user } from "../api";

import { getToken } from "../utils";
import { InitPage } from "../pages/init";
import IndexPage from "../pages/index/index";
import LoginPage from "../pages/login";
import MemberPage from "../pages/member/index";
import ChangePasswordPage from "../pages/change-password/index";
import ChangeDepartmentPage from "../pages/change-department/index";
import StudyPage from "../pages/study/index";
import CoursePage from "../pages/course/index";
import PrivateRoute from "../components/private-route";

let RootPage: any = null;
if (getToken()) {
  RootPage = lazy(async () => {
    return new Promise<any>(async (resolve) => {
      try {
        let configRes: any = await system.config();
        let userRes: any = await user.detail();
        resolve({
          default: (
            <InitPage configData={configRes.data} loginData={userRes.data} />
          ),
        });
      } catch (e) {
        console.error("系统初始化失败", e);
      }
    });
  });
} else {
  RootPage = <InitPage />;
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: RootPage,
    children: [
      {
        path: "/",
        element: <PrivateRoute Component={<IndexPage />} />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/member",
        element: <PrivateRoute Component={<MemberPage />} />,
      },
      {
        path: "/change-password",
        element: <PrivateRoute Component={<ChangePasswordPage />} />,
      },
      {
        path: "/study",
        element: <PrivateRoute Component={<StudyPage />} />,
      },
      {
        path: "/change-department",
        element: <PrivateRoute Component={<ChangeDepartmentPage />} />,
      },
      {
        path: "/course/:courseId",
        element: <PrivateRoute Component={<CoursePage />} />,
      },
    ],
  },
];

export default routes;
