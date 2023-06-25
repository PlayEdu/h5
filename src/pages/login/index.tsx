import React, { useState, useEffect } from "react";
import { Button, Toast, SpinLoading, Input, Image } from "antd-mobile";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, system, user } from "../../api/index";
import { setToken } from "../../utils/index";
import { loginAction, logoutAction } from "../../store/user/loginUserSlice";
import banner from "../../assets/images/login/banner.png";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaVal, setCaptchaVal] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const loginState = useSelector((state: any) => {
    return state.loginUser.value;
  });

  useEffect(() => {
    fetchImageCaptcha();
    document.title = "登录";
  }, []);

  const fetchImageCaptcha = () => {
    setCaptchaLoading(true);
    system.imageCaptcha().then((res: any) => {
      setImage(res.data.image);
      setCaptchaKey(res.data.key);
      setCaptchaLoading(false);
    });
  };

  const loginSubmit = (e: any) => {
    if (!email) {
      Toast.show({
        content: "请输入学员邮箱账号",
      });
      return;
    }
    if (!password) {
      Toast.show({
        content: "请输入密码",
      });
      return;
    }
    if (!captchaVal) {
      Toast.show({
        content: "请输入图形验证码",
      });
      return;
    }
    if (captchaVal.length < 4) {
      Toast.show({
        content: "图形验证码错误",
      });
      return;
    }
    if (loading) {
      return;
    }
    handleSubmit();
  };

  const handleSubmit = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    login
      .login(email, password, captchaKey, captchaVal)
      .then((res: any) => {
        const token = res.data.token;
        setToken(token);
        getUser();
      })
      .catch((e) => {
        setLoading(false);
        setCaptchaVal("");
        fetchImageCaptcha();
      });
  };

  const getUser = () => {
    user.detail().then((res: any) => {
      const data = res.data;
      dispatch(loginAction(data));
      setLoading(false);
      navigate("/member", { replace: true });
    });
  };

  return (
    <div className={styles["login-content"]}>
      <div className={styles["top-content"]}>
        <div className={styles["title"]}>学员登录</div>
        <Image src={banner} width={150} height={150} />
      </div>
      <div className={styles["form-box"]}>
        <div className={styles["input-box"]}>
          <Input
            className={styles["input-item"]}
            placeholder="请输入学员邮箱账号"
            value={email}
            onChange={(val) => {
              setEmail(val);
            }}
          />
          <div className={styles["line"]}></div>
          <Input
            type="password"
            className={styles["input-item"]}
            placeholder="请输入密码"
            value={password}
            onChange={(val) => {
              setPassword(val);
            }}
          />
        </div>
        <div className={styles["captcha-box"]}>
          <Input
            value={captchaVal}
            className={styles["input-item"]}
            placeholder="请输入图形验证码"
            onChange={(val) => {
              setCaptchaVal(val);
            }}
          />
          <div className={styles["captcha-button"]}>
            {captchaLoading && (
              <div className={styles["catpcha-loading-box"]}>
                <SpinLoading color="primary" />
              </div>
            )}
            {!captchaLoading && (
              <Image
                className={styles["captcha"]}
                onClick={fetchImageCaptcha}
                src={image}
              />
            )}
          </div>
        </div>
        <div className={styles["button-box"]}>
          <Button
            className={styles["primary-button"]}
            disabled={captchaVal === "" || email === "" || password === ""}
            color="primary"
            loading={loading}
            onClick={loginSubmit}
          >
            登 录
          </Button>
        </div>
        <div className={styles["support-box"]}>「PlayEdu提供技术支持」</div>
      </div>
    </div>
  );
};

export default LoginPage;
