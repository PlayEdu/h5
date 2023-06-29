import { useEffect, useRef, useState } from "react";
import { Dropdown, SpinLoading, Tabs } from "antd-mobile";
import { DropdownRef } from "antd-mobile/es/components/dropdown";
import { user } from "../../api/index";
import styles from "./index.module.scss";
import { useSelector } from "react-redux";
import { Footer, TabBarFooter, Empty } from "../../components";
import { CoursesModel } from "./compenents/courses-model";

const IndexPage = () => {
  const ref = useRef<DropdownRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState("0");
  const [coursesList, setCoursesList] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryText, setCategoryText] = useState<string>("所有分类");
  const [learnCourseRecords, setLearnCourseRecords] = useState<any>({});
  const [learnCourseHourCount, setLearnCourseHourCount] = useState<any>({});
  const systemConfig = useSelector((state: any) => state.systemConfig.value);
  const currentDepId = useSelector(
    (state: any) => state.loginUser.value.currentDepId
  );

  const items = [
    {
      key: "0",
      label: `全部`,
    },
    {
      key: "1",
      label: `必修课`,
    },
    {
      key: "2",
      label: `选修课`,
    },
    {
      key: "3",
      label: `已学完`,
    },
    {
      key: "4",
      label: `未学完`,
    },
  ];

  useEffect(() => {
    document.title = systemConfig.systemName || "首页";
  }, [systemConfig]);

  useEffect(() => {
    getParams();
  }, []);

  useEffect(() => {
    if (currentDepId === 0) {
      return;
    }
    getData();
  }, [tabKey, currentDepId, categoryId]);

  const getData = () => {
    setLoading(true);
    user.courses(currentDepId, categoryId).then((res: any) => {
      const records = res.data.learn_course_records;
      setLearnCourseRecords(records);
      setLearnCourseHourCount(res.data.user_course_hour_count);
      if (Number(tabKey) === 0) {
        setCoursesList(res.data.courses);
      } else if (Number(tabKey) === 1) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (item.is_required === 1) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (Number(tabKey) === 2) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (item.is_required === 0) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (Number(tabKey) === 3) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (records[item.id] && records[item.id].progress >= 10000) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      } else if (Number(tabKey) === 4) {
        const arr: any = [];
        res.data.courses.map((item: any) => {
          if (
            !records[item.id] ||
            (records[item.id] && records[item.id].progress < 10000)
          ) {
            arr.push(item);
          }
        });
        setCoursesList(arr);
      }
      setLoading(false);
    });
  };

  const getParams = () => {
    user.coursesCategories().then((res: any) => {
      const categories = res.data.categories;
      if (JSON.stringify(categories) !== "{}") {
        const new_arr: any[] = checkArr(categories, 0);
        new_arr.unshift({
          key: 0,
          title: "所有分类",
        });
        setCategories(new_arr);
      }
    });
  };

  const checkArr = (categories: any[], id: number) => {
    const arr = [];
    for (let i = 0; i < categories[id].length; i++) {
      if (!categories[categories[id][i].id]) {
        arr.push({
          title: categories[id][i].name,
          key: categories[id][i].id,
        });
      } else {
        const new_arr: any[] = checkArr(categories, categories[id][i].id);
        arr.push({
          title: categories[id][i].name,
          key: categories[id][i].id,
          children: new_arr,
        });
      }
    }
    return arr;
  };

  const renderChildCategory = (data: any) => {
    return (
      <>
        {data.map((item: any) => (
          <div
            key={item.key}
            className={
              item.key === categoryId
                ? styles["active-child-item"]
                : styles["child-item"]
            }
          >
            <div
              className={styles["category-tit"]}
              onClick={() => {
                setCategoryId(item.key);
                setCategoryText(item.title);
                ref.current?.close();
              }}
            >
              {item.title}
            </div>
            {item.children &&
              item.children.length > 0 &&
              renderChildCategory(item.children)}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="main-body">
      <div className={styles["tabs-box"]}>
        <Tabs
          activeKey={tabKey}
          onChange={(key: any) => {
            setTabKey(key);
          }}
          style={{
            "--fixed-active-line-width": "20px",
            "--active-line-height": "3px",
            "--active-title-color": "rgba(0,0,0,0.88)",
            "--title-font-size": "16px",
          }}
        >
          {items.map((item) => (
            <Tabs.Tab title={item.label} key={item.key} />
          ))}
        </Tabs>
      </div>
      <div className={styles["category-content"]}>
        <Dropdown ref={ref}>
          <Dropdown.Item key="sorter" title={categoryText}>
            <div className={styles["category-box"]}>
              {categories.map((item: any) => (
                <div
                  key={item.key}
                  className={
                    item.key === categoryId
                      ? styles["active-category-item"]
                      : styles["category-item"]
                  }
                >
                  <div
                    className={styles["category-tit"]}
                    onClick={() => {
                      setCategoryId(item.key);
                      setCategoryText(item.title);
                      ref.current?.close();
                    }}
                  >
                    {item.title}
                  </div>
                  {item.children &&
                    item.children.length > 0 &&
                    renderChildCategory(item.children)}
                </div>
              ))}
            </div>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className={styles["list-box"]}>
        {loading && (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <SpinLoading color="primary" />
          </div>
        )}
        {!loading && coursesList.length === 0 && <Empty></Empty>}
        {!loading && coursesList.length > 0 && (
          <>
            {coursesList.map((item: any) => (
              <div className={styles["item"]} key={item.id}>
                {learnCourseRecords[item.id] && (
                  <CoursesModel
                    id={item.id}
                    title={item.title}
                    thumb={item.thumb}
                    isRequired={item.is_required}
                    progress={Math.floor(
                      learnCourseRecords[item.id].progress / 100
                    )}
                  ></CoursesModel>
                )}
                {!learnCourseRecords[item.id] &&
                  learnCourseHourCount[item.id] &&
                  learnCourseHourCount[item.id] > 0 && (
                    <CoursesModel
                      id={item.id}
                      title={item.title}
                      thumb={item.thumb}
                      isRequired={item.is_required}
                      progress={1}
                    ></CoursesModel>
                  )}
                {!learnCourseRecords[item.id] &&
                  !learnCourseHourCount[item.id] && (
                    <CoursesModel
                      id={item.id}
                      title={item.title}
                      thumb={item.thumb}
                      isRequired={item.is_required}
                      progress={0}
                    ></CoursesModel>
                  )}
              </div>
            ))}
            <Footer></Footer>
          </>
        )}
      </div>
      <TabBarFooter></TabBarFooter>
    </div>
  );
};

export default IndexPage;
