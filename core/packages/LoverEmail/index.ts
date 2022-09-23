import { resolve } from "path";

import { readHtmlTemplateToPath } from "../../utils/readHtmlTemplate";
import { baseRequest } from "../../utils/request";
import { sendEmail } from "../../utils/autoSendEmail";
import { daysBetween } from "../../utils/handleDateUtil";
import { calendar } from "../../utils/calendarChangeUtil";

// const templatePath = resolve(__dirname, "../../templates/LoverTemplate.html");
// readHtmlTemplateToPath(templatePath);

const emailConfig = {
  address: "邢台",
};

const handleBirthday = function (options: any) {
  let data = {};
  // 如果传了公历，公历转农历
  if (options.solar) {
    let handleDate = options.solar.split("-");
    data = calendar.solar2lunar(
      Number(handleDate[0]),
      Number(handleDate[1]),
      Number(handleDate[2])
    );
  }
  // 如果传了农历，农历转公历
  if (options.lunar) {
    let handleDate = options.lunar.split("-");
    data = calendar.lunar2solar(
      Number(handleDate[0]),
      Number(handleDate[1]),
      Number(handleDate[2]),
      null
    );
  }
  return data;
};

const renderHtmlTemplate = async () => {
  let currentDate,
    birthdayNumber,
    togetherNumber,
    currentPlace,
    currentWeather,
    currentTemperature,
    currentWear,
    todayTitle,
    todayImg;

  // 今日气温相关-聚合数据
  const queryData = await baseRequest({
    requestUrl: "http://apis.juhe.cn/simpleWeather/query",
    requestMethod: "GET",
    urlParams: {
      city: emailConfig.address,
      key: "8fcfcf648f35220d66bfdcfc61b47550",
    },
  });

  // 随机文案图片-天行数据
  const sentenceImgData = await baseRequest({
    requestUrl: "http://api.tianapi.com/one/index",
    requestMethod: "GET",
    urlParams: {
      key: "fab107c8fb24c66b75cd67558f5b6394",
      rand: 1,
    },
  });
  let sentenceImg = "";
  if (sentenceImgData.code == 200) {
    sentenceImg = sentenceImgData.newslist[0].imgurl;
  }

  // 今日事宜-聚合数据
  const lifeData = await baseRequest({
    requestUrl: "http://apis.juhe.cn/simpleWeather/life",
    requestMethod: "GET",
    urlParams: {
      city: emailConfig.address,
      key: "8fcfcf648f35220d66bfdcfc61b47550",
    },
  });
  let deliverData = {};
  if (queryData.error_code === 0 && lifeData.error_code === 0) {
    Object.assign(deliverData, queryData.result.realtime, lifeData.result.life);
  }

  // 早安心语-天行数据
  const sentenceData = await baseRequest({
    requestUrl: "http://api.tianapi.com/zaoan/index",
    requestMethod: "GET",
    urlParams: {
      key: "fab107c8fb24c66b75cd67558f5b6394",
    },
  });
  let sentence = "";
  if (sentenceData.code == 200) {
    sentence = sentenceData.newslist[0].content;
  }

  // 获取当前年份
  currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

  currentPlace = queryData.result.city;
  currentWeather = queryData.result.realtime.info;
  currentTemperature = queryData.result.realtime.temperature;
  todayImg = sentenceImg;
  //   @ts-ignore
  currentWear = deliverData.yundong.des;
  todayTitle = sentence;

  const girlFriendInfo = handleBirthday({ lunar: `${currentYear}-12-26` });
  birthdayNumber = daysBetween(
    currentDate,
    `${girlFriendInfo.cYear}-${girlFriendInfo.cMonth}-${girlFriendInfo.cDay}`
  );

  const togetherInfo = handleBirthday({ solar: "2022-07-25" });
  togetherNumber = daysBetween(
    currentDate,
    `${togetherInfo.cYear}-${togetherInfo.cMonth}-${togetherInfo.cDay}`
  );

  console.log(
    currentPlace,
    currentWeather,
    currentTemperature,
    todayImg,
    currentWear,
    todayTitle
  );

  const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Daily Love Email</title>
      </head>
      <body style="margin: 0; padding: 0">
          <div class="page-container" style="background-color: #fafafa; width: 100vw; height: 100vh;">
          <h1 style="text-align: center; font-size: 18px; font-weight: 400; padding: 10px;">${todayTitle}</h1>
          <div class="today-img">
              <img src="${todayImg}" style=" width: 100%; min-height: 160px; border-radius: 5px;" />
          </div>
          <div class="today-info" 
                style="
                margin-top: 10px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: left;
                    font-size: 14px;
                    padding: 0 10px;
                "
            >
              <div style="text-align: center;">${currentDate}
  }</div>
              <div style="text-align: center;">距离你的生日还有${birthdayNumber}天</div>
              <div style="text-align: center;">今天是我们在一起的${togetherNumber}天</div>
              <div style="margin: 4px 0px">当前城市：${currentPlace}</div>
              <div style="margin: 4px 0px">今日天气：${currentWeather}</div>
              <div style="margin: 4px 0px">今日温度：${currentTemperature}度</div>
              <div style="margin: 4px 0px">
              是否需要运动：${currentWear}
              </div>
          </div>
          </div>
      </body>
      </html>
      `;

  console.log("htmlTemplate->", htmlTemplate);

  sendEmail({
    authUser: "2595723575@qq.com",
    authPass: "ichwndgfrbbgdjhd",
    // authUser: "1213563369@qq.com",
    // authPass: "sftmjrgwknmwgcdg",
    emailTitle: "爱你的鹏鹏",
    emailSubject: "每日提醒",
    receiveUsers: ["1213563369@qq.com"],
    emailContent: htmlTemplate,
  });
};

renderHtmlTemplate();
