import { useEffect, useState } from "react";
import { Image, ProgressCircle } from "antd-mobile";
import styles from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import backIcon from "../../assets/images/commen/icon-back-n.png";
import { course as vod } from "../../api/index";
import { Empty } from "../../components";
import { HourCompenent } from "./compenents/hour";

type LocalUserLearnHourRecordModel = {
  [key: number]: UserLearnHourRecordModel;
};

type LocalCourseHour = {
  [key: number]: CourseHourModel[];
};

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseModel | null>(null);
  const [chapters, setChapters] = useState<ChapterModel[]>([]);
  const [hours, setHours] = useState<LocalCourseHour | null>(null);
  const [learnRecord, setLearnRecord] = useState<UserLearnRecordModel | null>(
    null
  );
  const [learnHourRecord, setLearnHourRecord] =
    useState<LocalUserLearnHourRecordModel>({});

  const [courseTypeText, setCourseTypeText] = useState("");
  const [userCourseProgress, setUserCourseProgress] = useState(0);

  useEffect(() => {
    if (courseId) {
      getDetail(Number(courseId));
    }
  }, [courseId]);

  const getDetail = (cid: number) => {
    vod.detail(cid).then((res: any) => {
      let courseItem: CourseModel = res.data.course;

      document.title = courseItem.title || "课程详情";

      setCourse(courseItem);
      setChapters(res.data.chapters);
      setHours(res.data.hours);

      if (res.data.learn_record) {
        setLearnRecord(res.data.learn_record);
      }

      if (res.data.learn_hour_records) {
        setLearnHourRecord(res.data.learn_hour_records);
      }
    });
  };

  useEffect(() => {
    if (course) {
      setCourseTypeText(course.is_required === 1 ? "必修课" : "选修课");
    }
  }, [course]);

  useEffect(() => {
    if (learnRecord?.progress) {
      setUserCourseProgress(learnRecord.progress / 100);
    } else if (learnHourRecord) {
      setUserCourseProgress(1);
    } else {
      setUserCourseProgress(0);
    }
  }, [learnRecord, learnHourRecord]);

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
        <div className={styles["title"]}>{course?.title}</div>
        <div className={styles["info-content"]}>
          <div className={styles["info"]}>
            <div className={styles["record"]}>
              已学完课时{" "}
              <strong>
                {learnRecord ? learnRecord.finished_count || 0 : 0}
              </strong>{" "}
              / {course?.class_hour}
            </div>
            <div className={styles["type"]}>{courseTypeText}</div>
          </div>
          <div className={styles["progress-box"]}>
            <ProgressCircle
              percent={userCourseProgress}
              style={{
                "--size": "80px",
                "--fill-color": "#FFFFFF",
                "--track-color": "#ffffff4D",
                "--track-width": "7px",
              }}
            >
              <span className={styles.num}>{userCourseProgress}%</span>
            </ProgressCircle>
          </div>
        </div>
      </div>
      <div className={styles["other-content"]}>
        {course?.short_desc && (
          <>
            <div className={styles["desc"]}>{course.short_desc}</div>
            <div className={styles["line"]}></div>
          </>
        )}
        <div className={styles["chapters-hours-cont"]}>
          {chapters.length === 0 && !hours && <Empty />}

          {chapters.length === 0 && hours && (
            <div className={styles["hours-list-box"]} style={{ marginTop: 10 }}>
              {hours[0].map((item: CourseHourModel) => (
                <div key={item.id} className={styles["hours-it"]}>
                  <HourCompenent
                    id={item.id}
                    cid={item.course_id}
                    title={item.title}
                    record={learnHourRecord[item.id]}
                    duration={item.duration}
                    onSuccess={(cid: number, id: number) => {
                      playVideo(cid, id);
                    }}
                  ></HourCompenent>
                </div>
              ))}
            </div>
          )}

          {chapters.length > 0 && hours && (
            <div className={styles["hours-list-box"]}>
              {chapters.map((item: ChapterModel) => (
                <div key={item.id} className={styles["chapter-it"]}>
                  <div className={styles["chapter-name"]}>{item.name}</div>
                  {hours[item.id]?.map((it: CourseHourModel) => (
                    <div key={it.id} className={styles["hours-it"]}>
                      <HourCompenent
                        id={it.id}
                        cid={item.course_id}
                        title={it.title}
                        record={learnHourRecord[it.id]}
                        duration={it.duration}
                        onSuccess={(cid: number, id: number) => {
                          playVideo(cid, id);
                        }}
                      ></HourCompenent>
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
