import pluginInfo from '../../plugin-manifest.json';

export const handleFormFieldListenersAdd = ({ form, name, contentType }) => {
  if (contentType?.id === pluginInfo.id && contentType?.nonCtdSchema && name) {
    const { index, type } =
      name.match(/config\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index == null || !type) return;

    if (type === 'languages') {
      return {
        onChange: ({ value }) => {
          if (value.length === 0) {
            form.setFieldValue('default_language', '');
          } else {
            form.rerenderForm();
          }
        },
      };
    } else if (type === 'content_type') {
      return {
        onChange: () => {
          form.setFieldValue(`config[${index}].fields`, []);
        },
      };
    }
  }
};
