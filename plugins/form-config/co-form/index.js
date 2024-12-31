import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import pluginInfo from "../../../plugin-manifest.json";
import { createTranslateButton } from "./button";

/**
 * Add the translate button to
 * @param {*} param0
 * @param {*} contentTypeSettings
 */
export const handleCoFormConfig = (
  { contentType, name, config, formik },
  contentTypeSettings,
) => {
  // Add the Magic Button on first field in the form
  if (name == contentType.metaDefinition?.order[0]) {
    const cacheKey = `${pluginInfo.id}-${contentType.name}-${name}`;
    const cacheEntry = getCachedElement(cacheKey);

    let button = null;

    if (cacheEntry) {
      // Update cache entry with new formik data
      cacheEntry.data.formik = formik;
      button = cacheEntry.element;
    } else {
      const buttonData = {
        settings: contentTypeSettings,
        formik,
        contentType,
      };

      button = createTranslateButton(buttonData);
      addElementToCache(button, cacheKey, buttonData);
    }

    config.additionalElements = [button];
  }
};
