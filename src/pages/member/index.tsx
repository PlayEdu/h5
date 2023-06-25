import { useEffect, useState } from "react";
import { user } from "../../api/index";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { TabBarFooter } from "../../components";
import moreIcon from "../../assets/images/commen/icon-more.png";

const MemberPage = () => {
  const systemConfig = useSelector((state: any) => state.systemConfig.value);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState(0);
  const departments = useSelector(
    (state: any) => state.loginUser.value.departments
  );
  const currentDepId = useSelector(
    (state: any) => state.loginUser.value.currentDepId
  );

  useEffect(() => {
    document.title = "我的";
  }, []);

  return (
    <div className="main-body">
      <div className={styles["content-box"]}>我的</div>
      <div className={styles["support-box"]}>「PlayEdu提供技术支持」</div>
      <TabBarFooter></TabBarFooter>
    </div>
  );
};

export default MemberPage;
