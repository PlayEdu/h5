import { useEffect, useState } from "react";
import { user } from "../../api/index";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";

const IndexPage = () => {
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
    document.title = systemConfig.systemName || "首页";
  }, [systemConfig]);

  return (
    <div className="main-body">
      <div className="content">我是首页</div>
    </div>
  );
};

export default IndexPage;
