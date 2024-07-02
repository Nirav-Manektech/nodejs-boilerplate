// readYaml.js
const fs = require('fs');
const yaml = require('js-yaml');

function readYamlFile(filePath) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    console.error(`Failed to read YAML file: ${e.message}`);
    return null;
  }
}

module.exports = { readYamlFile };
