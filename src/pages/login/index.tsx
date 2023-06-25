import { Button } from "antd-mobile";
import { useDispatch, useSelector } from "react-redux";
import { loginAction, logoutAction } from "../../store/user/loginUserSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const loginState = useSelector((state: any) => {
    return state.loginUser.value;
  });

  return (
    <>
      <Button
        onClick={() => {
          dispatch(
            loginAction({
              user: {
                name: "霸王",
              },
            })
          );
        }}
      >
        登录吧
      </Button>

      {loginState.isLogin && (
        <Button
          onClick={() => {
            dispatch(logoutAction());
          }}
        >
          {loginState.user.name}
        </Button>
      )}
    </>
  );
};

export default LoginPage;
