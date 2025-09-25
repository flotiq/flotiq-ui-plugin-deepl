import { getCachedElement } from '../../../common/plugin-element-cache';
import { validFieldsCacheKey } from '../../../common/valid-fields';
import { lngDictionary } from '../..';

export const handlePluginFormConfig = ({ name, config, form }) => {
  const { index, type } =
    name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

  if (index == null || !type) return;

  if (type === 'fields') {
    const fieldOptions =
      getCachedElement(validFieldsCacheKey)?.element?.fieldOptions;

    const ctd = form.getValue(`config[${index}].content_type`);

    config.options = fieldOptions?.[ctd] || [];
    config.additionalHelpTextClasses = 'break-normal';
  } else if (type === 'default_language') {
    config.options = form.getValue(`config[${index}].languages`).map((lng) => ({
      value: lng,
      label: lngDictionary.current[lng],
    }));
  }
};
