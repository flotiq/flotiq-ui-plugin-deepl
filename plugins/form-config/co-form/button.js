import { generateTranslation } from "./generate-translation";

/**
 *
 * Create a HTML element that calls DeepL API
 *
 * @param {*} buttonData
 * @returns
 */

export const createTranslateButton = (buttonData) => {
  let button = null;
  button = document.createElement("button");
  button.setAttribute("class", "plugin-chatgpt-faq__button");
  button.type = "button";

  button.onclick = () => {
    const loadingClass = "plugin-chatgpt-faq__button--loading";
    button.classList.add(loadingClass);
    button.disabled = true;

    generateTranslation(buttonData)
      .catch((error) => {
        console.log("Error translating content:", error);
      })
      .finally(() => {
        button.classList.remove(loadingClass);
        button.disabled = false;
      });
  };
  return button;
};
