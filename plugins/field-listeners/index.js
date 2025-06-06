import pluginInfo from '../../plugin-manifest.json';

export const handleFormFieldListenrsAdd = ({ formik, name, contentType }) => {
  if (contentType?.id === pluginInfo.id && contentType?.nonCtdSchema && name) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type === 'content_type') {
      return {
        onChange: () => {
          formik.setFieldValue(`config[${index}].fields`, []);
        },
      };
    }
  }
};
