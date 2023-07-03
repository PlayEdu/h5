import { useState, useEffect } from "react";
import { Image, ProgressBar, Skeleton } from "antd-mobile";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { course } from "../../api/index";
import { TabBarFooter, Empty } from "../../components";
import mediaIcon from "../../assets/images/commen/icon-medal.png";
import moment from "moment";

const StudyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [todayCourses, setTodayCourses] = useState<any>([]);
  const [yesterdayCourses, setYesterdayCourses] = useState<any>([]);
  const [courses, setCourses] = useState<any>([]);

  useEffect(() => {
    document.title = "最近学习";
  }, []);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = () => {
    setLoading(true);
    course.latestLearn().then((res: any) => {
      let data = res.data;
      let today: any = [];
      let yesterday: any = [];
      let box: any = [];
      if (data && data.length > 0) {
        data.map((item: any) => {
          if (
            item.hour_record &&
            moment(item.hour_record.updated_at).isSame(moment(), "day")
          ) {
            today.push(item);
          } else if (
            item.hour_record &&
            moment(item.hour_record.updated_at).isSame(
              moment().subtract(1, "day"),
              "day"
            )
          ) {
            yesterday.push(item);
          } else {
            box.push(item);
          }
          setTodayCourses(today);
          setYesterdayCourses(yesterday);
          setCourses(box);
        });
      }
      setLoading(false);
    });
  };

  return (
    <div className="main-body">
      <div className={styles["title"]}>最近学习</div>
      <div className={styles["list-box"]}>
        {loading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div className={styles["item"]} key={i}>
              <Skeleton
                animated
                style={{
                  width: 100,
                  height: 75,
                  borderRadius: 8,
                  marginRight: 15,
                }}
              />
              <div className={styles["item-info"]}>
                <Skeleton animated style={{ width: "100%", height: 21 }} />
                <Skeleton animated style={{ width: "100%", height: 24 }} />
              </div>
            </div>
          ))}
        {!loading && courses.length === 0 && <Empty></Empty>}
        {/* <div className={styles["label"]}>更早</div> */}
        {!loading && (
          <>
            {todayCourses.length > 0 && (
              <>
                <div className={styles["label"]}>今日</div>
                {todayCourses.map((item: any, index: number) => (
                  <div key={index} style={{ width: "100%" }}>
                    {item.course && (
                      <div
                        className={styles["item"]}
                        onClick={() => {
                          navigate(`/course/${item.course.id}`);
                        }}
                      >
                        <Image
                          src={item.course.thumb}
                          width={100}
                          height={75}
                          style={{ borderRadius: 8, marginRight: 15 }}
                        />
                        <div className={styles["item-info"]}>
                          <div className={styles["item-title"]}>
                            {item.course.title}
                          </div>
                          <div className={styles["item-record"]}>
                            {item.course.is_required === 1 && (
                              <div className={styles["type"]}>必修课</div>
                            )}
                            {item.course.is_required === 0 && (
                              <div className={styles["active-type"]}>
                                选修课
                              </div>
                            )}
                            {item.record && (
                              <>
                                {item.record.progress < 10000 && (
                                  <ProgressBar
                                    percent={Math.floor(
                                      item.record.progress / 100
                                    )}
                                    text
                                    style={{
                                      flex: 1,
                                      "--fill-color": "#FF4D4F",
                                      "--track-color": "#F6F6F6",
                                      "--track-width": "8px",
                                      "--text-width": "27px",
                                    }}
                                  />
                                )}
                                {item.record.progress >= 10000 && (
                                  <>
                                    <Image
                                      width={20}
                                      height={20}
                                      src={mediaIcon}
                                    />
                                    <span className={styles["tip"]}>
                                      恭喜你学完此课程!
                                    </span>
                                  </>
                                )}
                              </>
                            )}
                            {!item.record && (
                              <ProgressBar
                                percent={1}
                                text
                                style={{
                                  flex: 1,
                                  "--fill-color": "#FF4D4F",
                                  "--track-color": "#F6F6F6",
                                  "--track-width": "8px",
                                  "--text-width": "27px",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            {yesterdayCourses.length > 0 && (
              <>
                <div className={styles["label"]}>昨日</div>
                {yesterdayCourses.map((item: any, index: number) => (
                  <div key={index} style={{ width: "100%" }}>
                    {item.course && (
                      <div
                        className={styles["item"]}
                        onClick={() => {
                          navigate(`/course/${item.course.id}`);
                        }}
                      >
                        <Image
                          src={item.course.thumb}
                          width={100}
                          height={75}
                          style={{ borderRadius: 8, marginRight: 15 }}
                        />
                        <div className={styles["item-info"]}>
                          <div className={styles["item-title"]}>
                            {item.course.title}
                          </div>
                          <div className={styles["item-record"]}>
                            {item.course.is_required === 1 && (
                              <div className={styles["type"]}>必修课</div>
                            )}
                            {item.course.is_required === 0 && (
                              <div className={styles["active-type"]}>
                                选修课
                              </div>
                            )}
                            {item.record && (
                              <>
                                {item.record.progress < 10000 && (
                                  <ProgressBar
                                    percent={Math.floor(
                                      item.record.progress / 100
                                    )}
                                    text
                                    style={{
                                      flex: 1,
                                      "--fill-color": "#FF4D4F",
                                      "--track-color": "#F6F6F6",
                                      "--track-width": "8px",
                                      "--text-width": "27px",
                                    }}
                                  />
                                )}
                                {item.record.progress >= 10000 && (
                                  <>
                                    <Image
                                      width={20}
                                      height={20}
                                      src={mediaIcon}
                                    />
                                    <span className={styles["tip"]}>
                                      恭喜你学完此课程!
                                    </span>
                                  </>
                                )}
                              </>
                            )}
                            {!item.record && (
                              <ProgressBar
                                percent={1}
                                text
                                style={{
                                  flex: 1,
                                  "--fill-color": "#FF4D4F",
                                  "--track-color": "#F6F6F6",
                                  "--track-width": "8px",
                                  "--text-width": "27px",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            {courses.length > 0 && (
              <>
                <div className={styles["label"]}>更早</div>
                {courses.map((item: any, index: number) => (
                  <div key={index} style={{ width: "100%" }}>
                    {item.course && (
                      <div
                        className={styles["item"]}
                        onClick={() => {
                          navigate(`/course/${item.course.id}`);
                        }}
                      >
                        <Image
                          src={item.course.thumb}
                          width={100}
                          height={75}
                          style={{ borderRadius: 8, marginRight: 15 }}
                        />
                        <div className={styles["item-info"]}>
                          <div className={styles["item-title"]}>
                            {item.course.title}
                          </div>
                          <div className={styles["item-record"]}>
                            {item.course.is_required === 1 && (
                              <div className={styles["type"]}>必修课</div>
                            )}
                            {item.course.is_required === 0 && (
                              <div className={styles["active-type"]}>
                                选修课
                              </div>
                            )}
                            {item.record && (
                              <>
                                {item.record.progress < 10000 && (
                                  <ProgressBar
                                    percent={Math.floor(
                                      item.record.progress / 100
                                    )}
                                    text
                                    style={{
                                      flex: 1,
                                      "--fill-color": "#FF4D4F",
                                      "--track-color": "#F6F6F6",
                                      "--track-width": "8px",
                                      "--text-width": "27px",
                                    }}
                                  />
                                )}
                                {item.record.progress >= 10000 && (
                                  <>
                                    <Image
                                      width={20}
                                      height={20}
                                      src={mediaIcon}
                                    />
                                    <span className={styles["tip"]}>
                                      恭喜你学完此课程!
                                    </span>
                                  </>
                                )}
                              </>
                            )}
                            {!item.record && (
                              <ProgressBar
                                percent={1}
                                text
                                style={{
                                  flex: 1,
                                  "--fill-color": "#FF4D4F",
                                  "--track-color": "#F6F6F6",
                                  "--track-width": "8px",
                                  "--text-width": "27px",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
      <TabBarFooter></TabBarFooter>
    </div>
  );
};

export default StudyPage;
