import axios from 'axios';
import i18n from 'i18next';

/**
 * Check if multilingual plugin is added
 * @param toast
 */
const checkDependencies = (toast) => {
  const multilingualSettingsStr = window.FlotiqPlugins.getPluginSettings(
    'flotiq.multilingual',
  );

  if (!multilingualSettingsStr) {
    toast.error(i18n.t('MultilingualConfigError'), { duration: 5000 });
    throw new Error('MultilingualConfigError');
  }
};

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
 * Use the DeepL API to translate the content of the form fields
 * @param {*} param0
 * @param toast
 */

export const generateTranslation = async ({ settings, formik }, toast) => {
  const fieldValues = {};
  for (const field of settings.fields) {
    fieldValues[field] = formik.values[field];
  }

  checkDependencies(toast);

  const languages = [];
  for (const translation of formik.values.__translations) {
    languages.push(translation.__language);
  }

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
