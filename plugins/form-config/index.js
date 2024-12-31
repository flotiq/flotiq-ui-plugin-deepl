import pluginInfo from "../../plugin-manifest.json";
import { handleCoFormConfig } from "./co-form";
import { handlePluginFormConfig } from "./plugin-form";

export const handleFormFieldConfig = (data, getPluginSettings) => {
  // TODO: clarify if we need this
  if (
    data.contentType?.id === pluginInfo.id &&
    data.contentType?.nonCtdSchema &&
    data.name
  ) {
    return handlePluginFormConfig(data);
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");

  const contentTypeSettings = parsedSettings?.config?.find(
    ({ content_type }) => content_type === data?.contentType?.name,
  );

  if (!contentTypeSettings) return;

  handleCoFormConfig(data, contentTypeSettings);
};
