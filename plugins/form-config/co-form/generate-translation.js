import axios from "axios";

/**
 * Helper function to translate content using the DeepL API
 * @param {*} content
 * @param {*} targetLang
 * @returns
 */
const getTranslationForContent = async (apiKey, content, targetLang) => {
  const url = `https://api-free.deepl.com/v2/translate`;

  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }

  const params = new URLSearchParams();
  params.append("auth_key", apiKey);
  params.append("text", content);
  params.append("target_lang", targetLang);

  try {
    const response = await axios.post(url, params);
    return response.data.translations[0].text;
  } catch (error) {
    console.log("Error translating content:", error);
    throw new Error("Translation failed");
  }
};

/**
 *
 * Helper function for fetching information about a field.
 *
 * @param {*} fieldName
 * @param {*} contentType
 * @returns
 */
const getFieldData = (fieldName, contentType) => {
  const config = contentType.metaDefinition?.propertiesConfig?.[fieldName];
  const schema =
    contentType.schemaDefinition?.allOf?.[1]?.properties?.[fieldName];

  return [config?.inputType, config, schema];
};

/**
 *
 * Parse the plugin settings to find the default language
 * and the order of languages.
 *
 * @param {*} settings
 * @returns
 */
const getMultilingualConfig = (settings) => {
  const multilingualSettingsStr = window.FlotiqPlugins.getPluginSettings(
    "flotiq.multilingual",
  );

  if (!multilingualSettingsStr) {
    // TODO: add dependency on the Multilingual plugin
    console.log("Multilingual plugin settings not found");
    return;
  }

  /**
   * Align the order of languages in the DeepL plugin with the Multilingual plugin
   */
  const multilingualSettings = JSON.parse(multilingualSettingsStr);
  const multilingualConfig = multilingualSettings.config.find(
    (config) => config.content_type === settings.content_type,
  );
  console.log(multilingualConfig);

  const defaultLanguage = multilingualConfig.default_language;
  const multilingualLanguages = multilingualConfig.languages
    .filter((lang) => lang !== defaultLanguage)
    .map((lang) => lang.toLowerCase());
  return { defaultLanguage, multilingualLanguages };
};

/**
 * Use the DeepL API to translate the content of the form fields
 * @param {*} param0
 */

export const generateTranslation = async ({
  settings,
  formik,
  contentType,
}) => {
  const fieldValues = {};
  for (const field of settings.fields) {
    fieldValues[field] = formik.values[field];
  }

  const { multilingualLanguages } = getMultilingualConfig(settings);

  /**
   * For each language that the plugin is configured to translate to,
   * get the translation of each field and set it in the formik values.
   * Respect the order of languages in the Multilingual plugin settings.
   * Skip field types that are not in `translatableTypes` array.
   */

  const translatableTypes = ["text", "richText"];

  for (const language of settings.languages) {
    const languageIndex = multilingualLanguages.indexOf(language.toLowerCase());
    if (languageIndex === -1) {
      console.log(`Language ${language} not found in the language order`);
      continue;
    }

    for (const [field, value] of Object.entries(fieldValues)) {
      const [inputType] = getFieldData(field, contentType);

      if (!translatableTypes.includes(inputType.toLowerCase())) {
        console.log(`Field ${field} of type ${inputType} is not translatable`);
        continue;
      }

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
};
