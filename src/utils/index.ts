import moment from "moment";

export function getToken(): string {
  return window.localStorage.getItem("playedu-h5-token") || "";
}

export function setToken(token: string) {
  window.localStorage.setItem("playedu-h5-token", token);
}

export function clearToken() {
  window.localStorage.removeItem("playedu-h5-token");
}

export function dateFormat(dateStr: string) {
  return moment(dateStr).format("YYYY-MM-DD HH:mm");
}

export function getHost() {
  return window.location.protocol + "//" + window.location.host + "/";
}
export function getDepKey(): string {
  return window.localStorage.getItem("playedu-h5-depatmentKey") || "";
}

export function setDepKey(token: string) {
  window.localStorage.setItem("playedu-h5-depatmentKey", token);
}

export function clearDepKey() {
  window.localStorage.removeItem("playedu-h5-depatmentKey");
}
export function getDepName(): string {
  return window.localStorage.getItem("playedu-h5-depatmentName") || "";
}

export function setDepName(token: string) {
  window.localStorage.setItem("playedu-h5-depatmentName", token);
}

export function clearDepName() {
  window.localStorage.removeItem("playedu-frontend-depatmentName");
}

export function changeAppUrl(str: string) {
  let key = str.slice(str.length - 1);
  if (key === "/") {
    return str;
  } else {
    return str + "/";
  }
}

export function studyTimeFormat(dateStr: number) {
  var d = moment.duration(dateStr / 1000, "seconds");
  let value = [];
  value.push(Math.floor(d.asDays()));
  value.push(d.hours());
  value.push(d.minutes());
  value.push(d.seconds());
  return value;
}

export function durationFormat(dateStr: number) {
  var d = moment.duration(dateStr, "seconds");
  let hour = d.hours() === 0 ? "" : d.hours() + ":";
  let minute = d.minutes() >= 10 ? d.minutes() + ":" : "0" + d.minutes() + ":";
  let second = d.seconds() >= 10 ? d.seconds() : "0" + d.seconds();

  return hour + minute + second;
}

export function getTab() {
  return window.localStorage.getItem("playedu-h5-tabKey") || "0";
}

export function setTab(token: string) {
  window.localStorage.setItem("playedu-h5-tabKey", token);
}

export function clearTab() {
  window.localStorage.removeItem("playedu-h5-tabKey");
}

export function getCategory() {
  return window.localStorage.getItem("playedu-h5-category") || 0;
}

export function setCategory(token: string) {
  window.localStorage.setItem("playedu-h5-category", token);
}

export function clearCategory() {
  window.localStorage.removeItem("playedu-h5-category");
}
export function getCategoryName(): string {
  return window.localStorage.getItem("playedu-h5-categoryName") || "所有分类";
}

export function setCategoryName(token: string) {
  window.localStorage.setItem("playedu-h5-categoryName", token);
}

export function clearCategoryName() {
  window.localStorage.removeItem("playedu-h5-categoryName");
}
