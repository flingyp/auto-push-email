/**
 * 计算两天之间的日期差值
 * @param {*} sDate1
 * @param {*} sDate2
 * @returns
 */
// 输入格式：yyyy-MM-DD
export function daysBetween(sDate1: any, sDate2: any) {
  //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
  var time1 = Date.parse(new Date(sDate1));
  var time2 = Date.parse(new Date(sDate2));
  var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
  return nDays;
}

/**
 * 计算两个日期之间的月数
 * @param {*} date1
 * @param {*} date2
 * @returns
 */
// 输入格式：yyyy-MM-DD或yyyy-MM
export function datemonth(date1: any, date2: any) {
  // 拆分年月日
  date1 = date1.split("-");
  // 得到月数
  date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
  // 拆分年月日
  date2 = date2.split("-");
  // 得到月数
  date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
  var m = Math.abs(date1 - date2); //Math.abs()取绝对值
  return m;
}

/**
 * 比较两个日期大小
 * @param d1 {dateString} 第一个日期
 * @param d2 {dateString} 第二个日期
 *
 * @return Boolean
 * */
export const compareDate = (d1: any, d2: any) => {
  let date1 = new Date(Date.parse(d1));
  let date2 = new Date(Date.parse(d2));
  return date1 > date2;
};
