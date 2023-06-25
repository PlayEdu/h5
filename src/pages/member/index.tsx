import { useEffect, useState } from "react";
import { Button, Toast, SpinLoading, Input, Image } from "antd-mobile";
import { user as member } from "../../api/index";
import {
  setDepKey,
  setDepName,
  getDepName,
  studyTimeFormat,
} from "../../utils/index";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { TabBarFooter } from "../../components";
import moreIcon from "../../assets/images/commen/icon-more.png";

const MemberPage = () => {
  const systemConfig = useSelector((state: any) => state.systemConfig.value);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState(0);
  const [departmentsMenu, setDepartmentsMenu] = useState<any>([]);
  const [currentDepartment, setCurrentDepartment] = useState<string>("");
  const [learnCourseRecords, setLearnCourseRecords] = useState<any>({});
  const [learnCourseHourCount, setLearnCourseHourCount] = useState<any>({});
  const [stats, setStats] = useState<any>({});
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
      const arr: any = [
        {
          key: "1",
          type: "group",
          label: "部门",
          children: [],
        },
      ];
      departments.map((item: any) => {
        arr[0].children.push({
          key: item.id,
          label: item.name,
          disabled: item.name === currentDepartment,
        });
      });
      setDepartmentsMenu(arr);
    }
  }, [departments]);

  useEffect(() => {
    if (currentDepId === 0) {
      return;
    }
    getData();
  }, [tabKey, currentDepId]);

  const getData = () => {
    setLoading(true);
    member.courses(currentDepId, 0).then((res: any) => {
      const records = res.data.learn_course_records;
      setStats(res.data.stats);
      setLearnCourseRecords(records);
      setLearnCourseHourCount(res.data.user_course_hour_count);

      setLoading(false);
    });
  };

  const setClick = () => {};

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

  return (
    <div className={styles["main-body"]}>
      <div className={styles["content-box"]}>
        <div className={styles["top-content"]}>
          <div className={styles["user-info"]}>
            {user && user.name && (
              <>
                <Image
                  loading="lazy"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    marginRight: 20,
                  }}
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
      <div className={styles["support-box"]}>「PlayEdu提供技术支持」</div>
      <TabBarFooter></TabBarFooter>
    </div>
  );
};

export default MemberPage;
