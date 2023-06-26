import { SpinLoading } from "antd-mobile";

const LoadingPage = () => {
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <SpinLoading color="primary" />
    </div>
  );
};

export default LoadingPage;
