[[_TOC_]]

# DeepL Translation Plugin

## Overview
This plugin provides automated translation using the DeepL API. It requires that the [Multilingual plugin](https://github.com/flotiq/flotiq-ui-plugin-multilingual) is installed and configured. It supports multiple languages and enables users to define and manage their own language sets.

## Configuration Steps

1. Go to your Flotiq UI and select `Plugins` from the left side menu.
2. Find the `DeepL translation plugin` and enable it, wait for the UI to reload.
3. Click `Manage` and then `Add item` in the configuration window.
4. Select the Content Type, where you want to configure the plugin.
5. Next select the fields, that will be translated. Only text and rich-text fields are supported for now.
6. Enter the list of available languages, including the original one (the one which you will use to enter the content). Please use 2-letter language codes, [as supported by DeepL](https://developers.deepl.com/docs/resources/supported-languages).
7. Select the original language in the `Default language` field.

## Using the plugin

1. Once the plugin is configured - go to the configured Content Type and edit one of the objects. 
2. There will be a magic icon displayed next to the first field of the form - once you're done entering your content and you want to translate - click on it.
3. You can now browse to the other language tabs to see your translated content!

## Development

### Quick start

1. `yarn` - to install dependencies
2. `yarn start` - to start development mode - rebuild on file modifications
3. update your `plugin-manifest.json` file to contain the production URL and other plugin information
4. `yarn build` - to build plugins

### Dev environment

Dev environment is configured to use:

* `prettier` - best used with automatic format on save in IDE
* `eslint` - it is built into both `start` and `build` commands

### Output

The plugins are built into a single `dist/index.js` file. The manifest is copied to `dist/plugin-manifest.json` file.

### Deployment

<!-- TO DO -->

### Loading the plugin

**Warning:** While developing, you can use  `https://localhost:3053/plugin-manifest.json` address to load the plugin manifest. Make sure your browser trusts the local certificate on the latter, to be able to use it e.g. with `https://editor.flotiq.com`

#### URL

**Hint**: You can use localhost url from development mode `https://localhost:3053/index.js`

1. Open Flotiq editor
2. Open Chrome Dev console
3. Execute the following script
   ```javascript
   FlotiqPlugins.loadPlugin('plugin-id', '<URL TO COMPILED JS>')
   ```
4. Navigate to the view that is modified by the plugin

#### Directly

1. Open Flotiq editor
2. Open Chrome Dev console
3. Paste the content of `dist/index.js` 
4. Navigate to the view that is modified by the plugin

#### Deployment

**Hint**: You can use localhost url from development mode `https://localhost:3053/plugin-manifest.json`

1. Open Flotiq editor
2. Add a new plugin and paste the URL to the hosted `plugin-manifest.json` file
3. Navigate to the view that is modified by the plugin
