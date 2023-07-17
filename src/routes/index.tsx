import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { system, user } from "../api";
import { getToken } from "../utils";
// 页面加载
import { InitPage } from "../pages/init";
import LoginPage from "../pages/login";
//用户中心页面
const MemberPage = lazy(() => import("../pages/member/index"));
//主页
const IndexPage = lazy(() => import("../pages/index/index"));
//修改密码页面
const ChangePasswordPage = lazy(() => import("../pages/change-password/index"));
//修改部门页面
const ChangeDepartmentPage = lazy(
  () => import("../pages/change-department/index")
);
//学习页面
const StudyPage = lazy(() => import("../pages/study/index"));
//课程页面
const CoursePage = lazy(() => import("../pages/course/index"));
const CoursePlayPage = lazy(() => import("../pages/course/video"));

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
  RootPage = lazy(async () => {
    return new Promise<any>(async (resolve) => {
      try {
        let configRes: any = await system.config();
        resolve({
          default: <InitPage configData={configRes.data} />,
        });
      } catch (e) {
        console.error("系统初始化失败", e);
      }
    });
  });
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
      {
        path: "/course/:courseId/hour/:hourId",
        element: <PrivateRoute Component={<CoursePlayPage />} />,
      },
    ],
  },
];

export default routes;
