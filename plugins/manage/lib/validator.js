import i18n from '../../../i18n';

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
          errors[`config[${index}].${field}`] = i18n.t('FieldRequired');
        }
      }

      if (ctdConfig.languages?.length < 2) {
        errors[`config[${index}].languages`] = i18n.t('MinLanguages');
      }

      (ctdConfig.fields || []).map((field) => {
        if (!(fieldKeys[ctdConfig.content_type] || []).includes(field)) {
          errors[`config[${index}].fields`] = i18n.t('WrongField');
        }
      });
    });

    return errors;
  };

  return onValidate;
};
