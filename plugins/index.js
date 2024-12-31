import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";
import cssString from "inline:./styles/style.css";
import { handleManageSchema } from "./manage";
import { handleFormFieldConfig } from "./form-config";

/**
 * Register the plugin
 */

registerFn(pluginInfo, (handler, client, globals) => {
  /**
   * Add plugin styles to the head of the document
   */
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement("style");
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }

  /**
   * Plugin configuration
   */
  handler.on("flotiq.plugins.manage::form-schema", (data) =>
    handleManageSchema(data, client, globals),
  );

  /**
   * Extend the Content Object forms
   */
  handler.on("flotiq.form.field::config", (data) =>
    handleFormFieldConfig(data, globals.getPluginSettings),
  );
});
