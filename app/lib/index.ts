import { data, Params } from "react-router";

export function getLang(params: Params<string>) {
  const lang = params.lang ?? "en";
  if (lang !== "zh" && lang !== "en") {
    throw data(null, {
      status: 404,
      statusText: `Not Found: Invalid language ${lang}`,
    });
  }
  return lang;
}