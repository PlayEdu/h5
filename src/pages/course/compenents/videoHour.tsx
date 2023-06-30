import React from "react";
import styles from "./hour.module.scss";
import { durationFormat } from "../../../utils/index";

interface PropInterface {
  id: number;
  cid: number;
  vid: number;
  title: string;
  duration: number;
  record: any;
  progress: number;
  onSuccess: (cid: number, id: number) => void;
}

export const HourCompenent: React.FC<PropInterface> = ({
  id,
  cid,
  vid,
  title,
  duration,
  record,
  progress,
  onSuccess,
}) => {
  return (
    <>
      <div
        className={styles["item"]}
        onClick={() => {
          onSuccess(cid, id);
        }}
      >
        <div className={styles["top-item"]}>
          <div className="d-flex">
            <i className="iconfont icon-icon-video"></i>
            <span className={styles["label"]}>视频</span>
          </div>
          {vid === id && (
            <div className={styles["studying"]}>
              <span>学习中</span>
            </div>
          )}
          {vid !== id && progress > 0 && progress < 100 && (
            <div className={styles["studying"]}>
              <span>
                学习到
                {durationFormat(Number(record.finished_duration || 0))}
              </span>
            </div>
          )}
          {vid !== id && progress >= 100 && (
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
