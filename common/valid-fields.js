import pluginInfo from '../plugin-manifest.json';

export const validFieldsTypes = ['text', 'textarea', 'richtext'];
const invalidKeys = ['__translations', 'slug'];

export const getValidFields = (contentTypes) => {
  const fieldKeys = {};
  const fieldOptions = {};

  contentTypes
    ?.filter(({ internal }) => !internal)
    .map(({ name, label }) => ({ value: name, label }));

  (contentTypes || []).forEach(({ name, metaDefinition }) => {
    fieldKeys[name] = [];
    fieldOptions[name] = [];

    Object.entries(metaDefinition?.propertiesConfig || {}).forEach(
      ([key, value]) => {
        const inputType = value?.inputType;
        if (
          !invalidKeys.includes(key) &&
          validFieldsTypes.includes(inputType)
        ) {
          fieldOptions[name].push({ value: key, label: value.label });
          fieldKeys[name].push(key);
        }
      },
    );
  });

  return { fieldKeys, fieldOptions };
};

export const validFieldsCacheKey = `${pluginInfo.id}-form-valid-fields`;
