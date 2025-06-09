import { registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import cssString from 'inline:./styles/style.css';
import { handleManageSchema } from './manage';
import { handleFormFieldConfig } from './form-config';
import { handleFormFieldListenersAdd } from './field-listeners';

import i18n from '../i18n';
import languages from '@cospired/i18n-iso-languages';
import enLocaleLng from '@cospired/i18n-iso-languages/langs/en.json';
import plLocaleLng from '@cospired/i18n-iso-languages/langs/pl.json';

languages.registerLocale(enLocaleLng);
languages.registerLocale(plLocaleLng);

export const lngDictionary = { current: {} };

/**
 * Register the plugin
 */

registerFn(pluginInfo, (handler, client, globals) => {
  /**
   * Add plugin styles to the head of the document
   */
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement('style');
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }

  const language = globals.getLanguage();
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  lngDictionary.current = languages.getNames(language);

  handler.on('flotiq.language::changed', ({ language }) => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
      lngDictionary.current = languages.getNames(language);
    }
  });

  /**
   * Plugin configuration
   */
  handler.on('flotiq.plugins.manage::form-schema', (data) =>
    handleManageSchema(data, client, globals),
  );

  /**
   * Extend the Content Object forms
   */
  handler.on('flotiq.form.field::config', (data) =>
    handleFormFieldConfig(data, globals.getPluginSettings, globals.toast),
  );

  handler.on('flotiq.form.field.listeners::add', (data) =>
    handleFormFieldListenersAdd(data),
  );
});
