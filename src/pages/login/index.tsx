import { useState, useEffect } from "react";
import { Button, Toast, SpinLoading, Input, Image } from "antd-mobile";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, system, user } from "../../api/index";
import { setToken } from "../../utils/index";
import { loginAction } from "../../store/user/loginUserSlice";
import {
  SystemConfigStoreInterface,
  saveConfigAction,
} from "../../store/system/systemConfigSlice";
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

  const loginSubmit = async (e: any) => {
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
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      let res: any = await login.login(email, password, captchaKey, captchaVal);
      setToken(res.data.token); //将token写入本地
      await getSystemConfig(); //获取系统配置并写入store
      await getUser(); //获取登录用户的信息并写入store
      setLoading(false);
      navigate("/member", { replace: true });
    } catch (e) {
      console.error("错误信息", e);
      setLoading(false);
      setCaptchaVal("");
      fetchImageCaptcha(); //刷新图形验证码
    }
  };

  const getUser = async () => {
    let res: any = await user.detail();
    dispatch(loginAction(res.data));
  };

  const getSystemConfig = async () => {
    let configRes: any = await system.config();
    if (configRes.data) {
      let config: SystemConfigStoreInterface = {
        //系统配置
        systemApiUrl: configRes.data["system-api-url"],
        systemH5Url: configRes.data["system-h5-url"],
        systemLogo: configRes.data["system-logo"],
        systemName: configRes.data["system-name"],
        systemPcUrl: configRes.data["system-pc-url"],
        pcIndexFooterMsg: configRes.data["system-pc-index-footer-msg"],
        //播放器配置
        playerPoster: configRes.data["player-poster"],
        playerIsEnabledBulletSecret:
          configRes.data["player-is-enabled-bullet-secret"] &&
          configRes.data["player-is-enabled-bullet-secret"] === "1"
            ? true
            : false,
        playerIsDisabledDrag:
          configRes.data["player-disabled-drag"] &&
          configRes.data["player-disabled-drag"] === "1"
            ? true
            : false,
        playerBulletSecretText: configRes.data["player-bullet-secret-text"],
        playerBulletSecretColor: configRes.data["player-bullet-secret-color"],
        playerBulletSecretOpacity:
          configRes.data["player-bullet-secret-opacity"],
      };
      dispatch(saveConfigAction(config));
    }
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
        <div className={styles["support-box"]}>
          <i
            style={{ fontSize: 20, color: "rgba(0, 0, 0, 0.3)" }}
            className="iconfont icon-playedu"
          ></i>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
