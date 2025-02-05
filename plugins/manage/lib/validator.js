import i18n from '../../../i18n';

const addToErrors = (errors, index, field, error) => {
  if (!errors.config) errors.config = [];
  if (!errors.config[index]) errors.config[index] = {};
  errors.config[index][field] = error;
};

export const getValidator = (fieldKeys) => {
  const onValidate = (values) => {
    const errors = {};

    values.config?.forEach((ctdConfig, index) => {
      const requiredFields = [
        'content_type',
        'default_language',
        'languages',
        'fields',
      ];

      for (const field of requiredFields) {
        const value = ctdConfig[field];
        if (!value || (Array.isArray(value) && !value.length)) {
          addToErrors(errors, index, 'field', i18n.t('FieldRequired'));
        }
      }

      if (ctdConfig.languages?.length < 2) {
        addToErrors(errors, index, 'languages', i18n.t('MinLanguages'));
      }

      (ctdConfig.fields || []).map((field) => {
        if (!(fieldKeys[ctdConfig.content_type] || []).includes(field)) {
          addToErrors(errors, index, 'fields', i18n.t('WrongField'));
        }
      });
    });

    return errors;
  };

  return onValidate;
};
