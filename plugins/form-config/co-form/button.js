import { generateTranslation } from './generate-translation';

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
        toast.error('Error translating content');
      })
      .finally(() => {
        button.disabled = false;
      });
  };
  return button;
};
