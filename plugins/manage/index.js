import pluginInfo from "../../plugin-manifest.json";
import {
  addElementToCache,
  getCachedElement,
  removeRoot,
} from "../../common/plugin-element-cache";
import { getSchema } from "./lib/form-schema";
import { getSubmitHandler } from "./lib/submit";
import { getValidator } from "./lib/validator";
import { getValidFields, validFieldsCacheKey } from "../../common/valid-fields";

export const handleManageSchema = (
  { contentTypes, modalInstance, reload },
  client,
  toast,
) => {
  const formSchemaCacheKey = `${pluginInfo.id}-form-schema`;
  let formSchema = getCachedElement(formSchemaCacheKey)?.element;

  if (!formSchema) {
    const validFields = getValidFields(contentTypes);
    addElementToCache(validFields, validFieldsCacheKey);

    const ctds = contentTypes
      ?.filter(({ internal }) => !internal)
      .map(({ name, label }) => ({ value: name, label }));

    const onSubmit = getSubmitHandler(
      contentTypes,
      client,
      reload,
      modalInstance,
      toast,
    );

    formSchema = {
      options: {
        disbaledBuildInValidation: true,
        onValidate: getValidator(validFields.fieldKeys),
        onSubmit,
      },
      schema: getSchema(ctds),
    };
  }

  modalInstance.promise.then(() => removeRoot(formSchemaCacheKey));

  return formSchema;
};
