import { useEffect, useState } from "react";
import { ImageUploader, Toast, Mask, Image } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { user as member } from "../../api/index";
import { getDepName, studyTimeFormat } from "../../utils/index";
import { loginAction, logoutAction } from "../../store/user/loginUserSlice";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { TabBarFooter } from "../../components";
import moreIcon from "../../assets/images/commen/icon-more.png";

const MemberPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    {
      url: "",
    },
  ]);
  const user = useSelector((state: any) => state.loginUser.value.user);
  const departments = useSelector(
    (state: any) => state.loginUser.value.departments
  );
  const currentDepId = useSelector(
    (state: any) => state.loginUser.value.currentDepId
  );

  useEffect(() => {
    document.title = "我的";
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      setCurrentDepartment(getDepName() || departments[0].name);
    }
  }, [departments]);

  useEffect(() => {
    if (currentDepId === 0) {
      return;
    }
    getData();
  }, [currentDepId, user]);

  const getData = () => {
    setLoading(true);
    member.courses(currentDepId, 0).then((res: any) => {
      setStats(res.data.stats);
      setLoading(false);
    });
  };

  const setClick = () => {
    setVisible(true);
  };

  const getTotal = (num1: number, num2: number) => {
    let value = 0;
    if (num1) {
      value = value + num1;
    }
    if (num2 && num2 > 0) {
      value = value + num2;
    }

    return value;
  };

  const beforeUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      Toast.show("超过2M限制，不允许上传");
      return null;
    }
    return file;
  };

  const propsUpload = async (file: File) => {
    console.log(file);
    member.avatar(file).then((res: any) => {
      Toast.show("头像更换成功");
      getData();
    });
  };

  const mockUpload = async (file: File) => {
    setVisible(false);
    const data = new FormData();
    data.append("file", file);
    try {
      let res = await member.avatar(data);
      if (res) {
        Toast.show("头像更换成功");
        getUser();
      }
    } catch (e) {
      console.error("上传失败", e);
    }
    return {
      url: URL.createObjectURL(file),
    };
  };

  const getUser = () => {
    member.detail().then((res: any) => {
      const data = res.data;
      dispatch(loginAction(data));
      setFileList([]);
    });
  };

  return (
    <div className={styles["main-body"]}>
      <div className={styles["content-box"]}>
        <div className={styles["top-content"]}>
          <div className={styles["user-info"]}>
            {user && user.name && (
              <>
                <Image
                  width={100}
                  height={100}
                  style={{
                    borderRadius: "50%",
                    marginRight: 20,
                  }}
                  fit="cover"
                  src={user.avatar}
                />
                <div className={styles["other-cont"]}>
                  <div className={styles["name"]}>{user.name}</div>
                  <div className={styles["departments"]}>
                    <div className={styles["department-name"]}>
                      {currentDepartment}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Image
            className={styles["more-button"]}
            onClick={() => setClick()}
            src={moreIcon}
          />
        </div>
        <div className={styles["stats-content"]}>
          <div className={styles["stat-item"]}>
            <span className={styles["time"]}>
              {studyTimeFormat(stats.today_learn_duration)[0] !== 0 && (
                <>
                  <strong>
                    {studyTimeFormat(stats.today_learn_duration)[0] || 0}{" "}
                  </strong>
                  天
                </>
              )}
              {studyTimeFormat(stats.today_learn_duration)[1] !== 0 && (
                <>
                  <strong>
                    {" "}
                    {studyTimeFormat(stats.today_learn_duration)[1] || 0}{" "}
                  </strong>
                  时
                </>
              )}
              <strong>
                {" "}
                {studyTimeFormat(stats.today_learn_duration)[2] || 0}{" "}
              </strong>
              分
              <strong>
                {" "}
                {studyTimeFormat(stats.today_learn_duration)[3] || 0}{" "}
              </strong>
              秒
            </span>
            <span className={styles["tit"]}>今日学习</span>
          </div>
          <div className={styles["stat-item"]}>
            <span className={styles["time"]}>
              {studyTimeFormat(stats.learn_duration || 0)[0] !== 0 && (
                <>
                  <strong>
                    {studyTimeFormat(stats.learn_duration || 0)[0] || 0}{" "}
                  </strong>
                  天
                </>
              )}
              {studyTimeFormat(stats.learn_duration || 0)[1] !== 0 && (
                <>
                  <strong>
                    {" "}
                    {studyTimeFormat(stats.learn_duration || 0)[1] || 0}{" "}
                  </strong>
                  时
                </>
              )}
              <strong>
                {" "}
                {studyTimeFormat(stats.learn_duration || 0)[2] || 0}{" "}
              </strong>
              分
              <strong>
                {" "}
                {studyTimeFormat(stats.learn_duration || 0)[3] || 0}{" "}
              </strong>
              秒
            </span>
            <span className={styles["tit"]}>累计学习</span>
          </div>
        </div>
        <div className={styles["records-content"]}>
          <div className={styles["record-item"]}>
            <div className={styles["name"]}>所在部门</div>
            <div className={styles["value"]}>{currentDepartment}</div>
          </div>
          <div className={styles["record-item"]}>
            <div className={styles["name"]}>课时总进度</div>
            <div className={styles["value"]}>
              <strong>
                {getTotal(
                  stats.required_finished_course_count,
                  stats.nun_required_finished_course_count
                )}{" "}
              </strong>
              /{" "}
              {getTotal(
                stats.required_course_count,
                stats.nun_required_course_count
              )}
            </div>
          </div>
          <div className={styles["record-item"]}>
            <div className={styles["name"]}>必修课</div>
            <div className={styles["value"]}>
              <strong>{stats.required_finished_course_count || 0} </strong>/{" "}
              {stats.required_course_count || 0}
            </div>
          </div>
          {stats.nun_required_course_count > 0 && (
            <div className={styles["record-item"]}>
              <div className={styles["name"]}>选修课</div>
              <div className={styles["value"]}>
                <strong>
                  {stats.nun_required_finished_course_count || 0}{" "}
                </strong>
                / {stats.nun_required_course_count || 0}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles["support-box"]}>
        <i
          style={{ fontSize: 20, color: "rgba(0, 0, 0, 0.3)" }}
          className="iconfont icon-playedu"
        ></i>
      </div>
      <Mask
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
      >
        <div className={styles["dialog-body"]}>
          <div className={styles["dialog-box"]}>
            <div
              className={styles["button-item"]}
              onClick={() => {
                setVisible(false);
                if (departments.length === 1) {
                  Toast.show({
                    content: "暂无可切换部门",
                  });
                  return;
                }
                navigate("/change-department");
              }}
            >
              切换部门
            </div>
            <ImageUploader
              value={fileList}
              onChange={setFileList}
              upload={mockUpload}
              preview={false}
              showFailed={false}
              beforeUpload={beforeUpload}
            >
              <div className={styles["button-item"]}>更换头像</div>
            </ImageUploader>
            <div
              className={styles["button-item"]}
              onClick={() => {
                setVisible(false);
                navigate("/change-password");
              }}
            >
              修改密码
            </div>
          </div>
          <div
            className={styles["dialog-button"]}
            onClick={() => {
              setVisible(false);
              dispatch(logoutAction());
              window.location.href = "/login";
            }}
          >
            退出登录
          </div>
        </div>
      </Mask>
      <TabBarFooter></TabBarFooter>
    </div>
  );
};

export default MemberPage;
