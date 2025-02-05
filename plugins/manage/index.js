import pluginInfo from '../../plugin-manifest.json';
import {
  addElementToCache,
  getCachedElement,
  removeRoot,
} from '../../common/plugin-element-cache';
import { getSchema } from './lib/form-schema';
import { getValidator } from './lib/validator';
import { getValidFields, validFieldsCacheKey } from '../../common/valid-fields';

export const handleManageSchema = (data) => {
  const formSchemaCacheKey = `${pluginInfo.id}-form-schema`;
  let formSchema = getCachedElement(formSchemaCacheKey)?.element;

  if (!formSchema) {
    const validFields = getValidFields(data.contentTypes);
    addElementToCache(validFields, validFieldsCacheKey);

    const ctds = data.contentTypes
      ?.filter(({ internal }) => !internal)
      .map(({ name, label }) => ({ value: name, label }));

    formSchema = {
      options: {
        disbaledBuildInValidation: true,
        onValidate: getValidator(validFields.fieldKeys),
      },
      schema: getSchema(ctds),
    };
  }

  data.modalInstance.promise.then(() => removeRoot(formSchemaCacheKey));

  return formSchema;
};
