import request from "request-promise";

export interface RequestOption {
  requestUrl: string;
  requestMethod: "GET" | "POST";
  urlParams: any;
}

export const baseRequest = async function (options: RequestOption) {
  const { requestUrl, requestMethod, urlParams } = options;
  const responseData = await request(requestUrl, {
    method: requestMethod,
    qs: urlParams,
  });

  return JSON.parse(responseData);
};
