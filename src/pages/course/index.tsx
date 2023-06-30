import { useEffect, useState } from "react";
import { Image, ProgressCircle, SpinLoading } from "antd-mobile";
import styles from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import backIcon from "../../assets/images/commen/icon-back-n.png";
import { course as Course } from "../../api/index";
import { Empty } from "../../components";
import { HourCompenent } from "./compenents/hour";

const CoursePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [course, setCourse] = useState<any>({});
  const [chapters, setChapters] = useState<any>([]);
  const [hours, setHours] = useState<any>({});
  const [learnRecord, setLearnRecord] = useState<any>({});
  const [learnHourRecord, setLearnHourRecord] = useState<any>({});

  useEffect(() => {
    getDetail();
  }, [params.courseId]);

  const getDetail = () => {
    setLoading(true);
    Course.detail(Number(params.courseId))
      .then((res: any) => {
        document.title = res.data.course.title;
        setCourse(res.data.course);
        setChapters(res.data.chapters);
        setHours(res.data.hours);
        if (res.data.learn_record) {
          setLearnRecord(res.data.learn_record);
        }
        if (res.data.learn_hour_records) {
          setLearnHourRecord(res.data.learn_hour_records);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const playVideo = (cid: number, id: number) => {
    navigate(`/course/${cid}/hour/${id}`);
  };

  return (
    <div className="main-body">
      <div className="main-header" style={{ backgroundColor: "#FF4D4F" }}>
        <Image
          className="back-icon"
          src={backIcon}
          onClick={() => navigate(-1)}
        />
      </div>
      <div className={styles["top-content"]}>
        <div className={styles["title"]}>{course.title}</div>
        <div className={styles["info-content"]}>
          <div className={styles["info"]}>
            <div className={styles["record"]}>
              已学完课时{" "}
              <strong>
                {learnRecord ? learnRecord.finished_count || 0 : 0}
              </strong>{" "}
              / {course.class_hour}
            </div>
            {course.is_required === 1 && (
              <div className={styles["type"]}>必修课</div>
            )}
            {course.is_required === 0 && (
              <div className={styles["type"]}>选修课</div>
            )}
          </div>
          <div className={styles["progress-box"]}>
            {JSON.stringify(learnRecord) === "{}" &&
              JSON.stringify(learnHourRecord) === "{}" && (
                <ProgressCircle
                  percent={0}
                  style={{
                    "--size": "80px",
                    "--fill-color": "#FFFFFF",
                    "--track-color": "#ffffff4D",
                    "--track-width": "7px",
                  }}
                >
                  <span className={styles.num}>0%</span>
                </ProgressCircle>
              )}
            {JSON.stringify(learnRecord) === "{}" &&
              JSON.stringify(learnHourRecord) !== "{}" && (
                <ProgressCircle
                  percent={1}
                  style={{
                    "--size": "80px",
                    "--fill-color": "#FFFFFF",
                    "--track-color": "#ffffff4D",
                    "--track-width": "7px",
                  }}
                >
                  <span className={styles.num}>1%</span>
                </ProgressCircle>
              )}
            {JSON.stringify(learnRecord) !== "{}" &&
              JSON.stringify(learnHourRecord) !== "{}" && (
                <ProgressCircle
                  percent={Math.floor(learnRecord.progress / 100)}
                  style={{
                    "--size": "80px",
                    "--fill-color": "#FFFFFF",
                    "--track-color": "#ffffff4D",
                    "--track-width": "7px",
                  }}
                >
                  <span className={styles.num}>
                    {Math.floor(learnRecord.progress / 100)}%
                  </span>
                </ProgressCircle>
              )}
          </div>
        </div>
      </div>
      <div className={styles["other-content"]}>
        {course.short_desc && (
          <>
            <div className={styles["desc"]}>{course.short_desc}</div>
            <div className={styles["line"]}></div>
          </>
        )}
        <div className={styles["chapters-hours-cont"]}>
          {chapters.length === 0 && JSON.stringify(hours) === "{}" && <Empty />}{" "}
          {chapters.length === 0 && JSON.stringify(hours) !== "{}" && (
            <div className={styles["hours-list-box"]}>
              {hours[0].map((item: any, index: number) => (
                <div key={item.id} className={styles["hours-it"]}>
                  {learnHourRecord[item.id] && (
                    <HourCompenent
                      id={item.id}
                      cid={item.course_id}
                      title={item.title}
                      record={learnHourRecord[item.id]}
                      duration={item.duration}
                      progress={
                        (learnHourRecord[item.id].finished_duration * 100) /
                        learnHourRecord[item.id].total_duration
                      }
                      onSuccess={(cid: number, id: number) => {
                        playVideo(cid, id);
                      }}
                    ></HourCompenent>
                  )}
                  {!learnHourRecord[item.id] && (
                    <HourCompenent
                      id={item.id}
                      cid={item.course_id}
                      title={item.title}
                      record={null}
                      duration={item.duration}
                      progress={0}
                      onSuccess={(cid: number, id: number) => {
                        playVideo(cid, id);
                      }}
                    ></HourCompenent>
                  )}
                </div>
              ))}
            </div>
          )}
          {chapters.length > 0 && JSON.stringify(hours) !== "{}" && (
            <div className={styles["hours-list-box"]}>
              {chapters.map((item: any, index: number) => (
                <div key={item.id} className={styles["chapter-it"]}>
                  <div className={styles["chapter-name"]}>{item.name}</div>
                  {hours[item.id] &&
                    hours[item.id].map((it: any, int: number) => (
                      <div key={it.id} className={styles["hours-it"]}>
                        {learnHourRecord[it.id] && (
                          <HourCompenent
                            id={it.id}
                            cid={item.course_id}
                            title={it.title}
                            record={learnHourRecord[it.id]}
                            duration={it.duration}
                            progress={
                              (learnHourRecord[it.id].finished_duration * 100) /
                              learnHourRecord[it.id].total_duration
                            }
                            onSuccess={(cid: number, id: number) => {
                              playVideo(cid, id);
                            }}
                          ></HourCompenent>
                        )}
                        {!learnHourRecord[it.id] && (
                          <HourCompenent
                            id={it.id}
                            cid={item.course_id}
                            title={it.title}
                            record={null}
                            duration={it.duration}
                            progress={0}
                            onSuccess={(cid: number, id: number) => {
                              playVideo(cid, id);
                            }}
                          ></HourCompenent>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
