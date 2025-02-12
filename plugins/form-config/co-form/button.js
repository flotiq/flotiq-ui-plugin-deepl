import { generateTranslation } from './generate-translation';
import i18n from '../../../i18n';

/**
 *
 * Create an HTML element that calls DeepL API
 *
 * @param {*} buttonData
 * @param toast
 * @returns HTMLButtonElement
 */

export const createTranslateButton = (buttonData, toast) => {
  let button = null;
  button = document.createElement('button');
  button.setAttribute('class', 'plugin-translation-deepl__button');
  button.type = 'button';

  button.onclick = () => {
    button.disabled = true;

    generateTranslation(buttonData, toast)
      .catch((error) => {
        console.error('Error translating content:', error);
        toast.error(i18n.t('TranslationError'), { duration: 5000 });
      })
      .finally(() => {
        button.disabled = false;
      });
  };
  return button;
};
