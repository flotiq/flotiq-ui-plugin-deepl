import axios from 'axios';
import i18n from 'i18next';

/**
 * Helper function to translate content using the DeepL API
 * @param apiKey
 * @param {*} content
 * @param {*} targetLang
 * @returns
 */
const getTranslationForContent = async (apiKey, content, targetLang) => {
  const url = `https://api-free.deepl.com/v2/translate`;

  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }

  const params = new URLSearchParams();
  params.append('auth_key', apiKey);
  params.append('text', content);
  params.append('target_lang', targetLang);

  try {
    const response = await axios.post(url, params);
    return response.data.translations[0].text;
  } catch (error) {
    console.error('Error translating content:', error);
    throw new Error('Translation failed');
  }
};

/**
 *
 * Parse the plugin settings to find the default language
 * and the order of languages.
 *
 * @param {*} settings
 * @param toast
 * @returns
 */
const getMultilingualConfig = (settings, toast) => {
  const multilingualSettingsStr = window.FlotiqPlugins.getPluginSettings(
    'flotiq.multilingual',
  );

  if (!multilingualSettingsStr) {
    // TODO: add dependency on the Multilingual plugin
    toast.error(i18n.t('MultilingualConfigError'), { duration: 5000 });
    throw new Error('MultilingualConfigError');
  }

  /**
   * Align the order of languages in the DeepL plugin with the Multilingual plugin
   */
  const multilingualConfig = JSON.parse(multilingualSettingsStr);

  const defaultLanguage = multilingualConfig.default_language;
  const multilingualLanguages = multilingualConfig.languages
    .filter((lang) => lang !== defaultLanguage)
    .map((lang) => lang.toLowerCase());

  return { defaultLanguage, multilingualLanguages };
};

/**
 * Use the DeepL API to translate the content of the form fields
 * @param {*} param0
 * @param toast
 */

export const generateTranslation = async ({ settings, formik }, toast) => {
  const fieldValues = {};
  for (const field of settings.fields) {
    fieldValues[field] = formik.values[field];
  }

  const languages = [];
  for (const translation of formik.values.__translations){
    languages.push(translation.__language);
  }

  

  const { multilingualLanguages } = getMultilingualConfig(settings, toast);

  /**
   * For each language that the plugin is configured to translate to,
   * get the translation of each field and set it in the formik values.
   * Respect the order of languages in the Multilingual plugin settings.
   */

  for (const language of settings.languages) {
    const languageIndex = languages.indexOf(language.toLowerCase());
    if (languageIndex === -1) {
      continue;
    }

    for (const [field, value] of Object.entries(fieldValues)) {
      const translatedValue = await getTranslationForContent(
        settings.api_key,
        value,
        language,
      );
      
      await formik.setFieldValue(
        `__translations[${languageIndex}].${field}`,
        translatedValue,
      );
      
      formik.setFieldTouched(`__translations[${languageIndex}].${field}`, true);
    }
  }
  toast.success(i18n.t('Success'), { duration: 5000 });
};
