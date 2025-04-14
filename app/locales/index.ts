import en from "./en.json";
import zh from "./zh.json";

export const locales = {
  zh,
  en
};
export type Locale = keyof typeof locales;
export type LocaleType = (typeof locales)[Locale];
