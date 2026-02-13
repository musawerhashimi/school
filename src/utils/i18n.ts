import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../locales/en.json";
import da from "../locales/da.json";
import pa from "../locales/pa.json";


// MIS module translations
import misEn from "../mis/locales/en.json";
import misDa from "../mis/locales/da.json";
import misPa from "../mis/locales/pa.json";

// Merge global and MIS translations
const enTranslations = { ...en, ...misEn };
const daTranslations = { ...da, ...misDa };
const paTranslations = { ...pa, ...misPa };








i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "en", // ✅ DEFAULT LANGUAGE (FARSI / DARI)
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
   resources: {
      en: { translation: enTranslations },
      da: { translation: daTranslations },
      pa: { translation: paTranslations },
    },
  });

export default i18n;
