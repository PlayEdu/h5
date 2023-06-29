import { useEffect, useState } from "react";
import { Image, ProgressBar, SpinLoading } from "antd-mobile";
import styles from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import backIcon from "../../assets/images/commen/icon-back-n.png";
import { course as Course } from "../../api/index";
import { Empty } from "../../components";

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

  return (
    <div className="main-body">
      <div className="main-header" style={{ backgroundColor: "#FF4D4F" }}>
        <Image
          className="back-icon"
          src={backIcon}
          onClick={() => navigate(-1)}
        />
      </div>
      <div className={styles["top-content"]}></div>
    </div>
  );
};

export default CoursePage;
