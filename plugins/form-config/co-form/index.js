import {
  addElementToCache,
  getCachedElement,
} from '../../../common/plugin-element-cache';
import pluginInfo from '../../../plugin-manifest.json';
import { createTranslateButton } from './button';

/**
 * Add the translate button to
 * @param {*} param0
 * @param {*} contentTypeSettings
 * @param toast
 */
export const handleCoFormConfig = (
  { contentType, name, config, form, initialData, formUniqueKey },
  contentTypeSettings,
  toast,
) => {
  // Add the Magic Button on first field in the form
  if (name === contentType.metaDefinition?.order[0]) {
    const cacheKey = `${pluginInfo.id}-${contentType.name}-${name}`;
    const cacheEntry = getCachedElement(cacheKey);

    let button = null;

    if (cacheEntry) {
      // Update cache entry with new form data
      cacheEntry.data.form = form;
      button = cacheEntry.element;
    } else {
      const buttonData = {
        settings: contentTypeSettings,
        form,
        contentType,
        initialData,
        formUniqueKey,
      };

      button = createTranslateButton(buttonData, toast);
      addElementToCache(button, cacheKey, buttonData);
    }

    config.additionalElements = [button];
  }
};
