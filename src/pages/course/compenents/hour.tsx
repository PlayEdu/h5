import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./hour.module.scss";
import { durationFormat } from "../../../utils/index";

interface PropInterface {
  id: number;
  cid: number;
  title: string;
  duration: number;
  record: any;
  progress: number;
}

export const HourCompenent: React.FC<PropInterface> = ({
  id,
  cid,
  title,
  duration,
  record,
  progress,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={styles["item"]}
        onClick={() => {
          navigate(`/course/${cid}/hour/${id}`);
        }}
      >
        <div className={styles["top-item"]}>
          <div className="d-flex">
            <i className="iconfont icon-icon-video"></i>
            <span className={styles["label"]}>视频</span>
          </div>
          {progress > 0 && progress < 100 && (
            <div className={styles["studying"]}>
              <span>
                学习到
                {durationFormat(Number(record.finished_duration || 0))}
              </span>
            </div>
          )}
          {progress >= 100 && (
            <div className={styles["complete"]}>
              <span>已学完</span>{" "}
            </div>
          )}
        </div>
        <div className={styles["title"]}>
          {title}({durationFormat(Number(duration))})
        </div>
      </div>
    </>
  );
};
