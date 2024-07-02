const path = require('path');
const { generateSwaggerAnnotations, updateOrAddAnnotationsToFile } = require('./generateSwaggerAnnotation');
const { readYamlFile } = require('./swagger.service');

const yamlFilePath = path.join(__dirname, '../docs/components.yml');
const components = readYamlFile(yamlFilePath);

if (components && components.routes) {
  components.routes.forEach((routeConfig) => {
    const annotations = generateSwaggerAnnotations(components.components, routeConfig);
    const routeFilePath = path.join(__dirname, '../routes/v1/', `${routeConfig.route.split('/')[1]}.route.js`);
    updateOrAddAnnotationsToFile(routeFilePath, annotations, routeConfig.route, routeConfig.method);
  });
}
