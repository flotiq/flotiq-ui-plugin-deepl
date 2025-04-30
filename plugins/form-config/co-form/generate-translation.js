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
const getTranslations = async (apiKey, fieldValues, targetLang) => {
  const url = `https://deepl.flotiq.com/`;

  const values = Object.values(fieldValues).map((value) =>
    typeof value !== 'string' ? JSON.stringify(value) : value,
  );

  try {
    const response = await axios.post(
      url,
      {
        text: values,
        target_lang: targetLang,
      },
      { headers: { Authorization: `DeepL-Auth-Key ${apiKey}` } },
    );

    return Object.keys(fieldValues).reduce((acc, field, index) => {
      acc[field] = response.data.translations[index].text;
      return acc;
    }, {});
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

export const generateTranslation = async (
  { settings, formik, contentType, initialData, formUniqueKey },
  toast,
) => {
  const fieldValues = {};
  for (const field of settings.fields) {
    fieldValues[field] = formik.values[field];
  }

  checkDependencies(toast);

  /**
   * For each language that the plugin is configured to translate to,
   * get the translation of each language 
   * and send event to multilingual to update translations
   */
  const languages = settings.languages.filter(
    (lng) => lng !== settings.default_language,
  );

  for (const language of languages) {
    const values = await getTranslations(
      settings.api_key,
      fieldValues,
      language,
    );

    window.FlotiqPlugins.run('flotiq-multilingual.translation::update', {
      contentType,
      language,
      initialData,
      values,
      formUniqueKey,
    });
  }
  toast.success(i18n.t('Success'), { duration: 5000 });
};
