import { NextApiRequestCookies } from "next/dist/server/api-utils";

const cookiesUtil = {
  getLocaleCookieValue: (cookies: NextApiRequestCookies) => {
    if (cookies?.locale) {
      return cookies.locale;
    } else {
      return "en";
    }
  },
};

export default cookiesUtil;
