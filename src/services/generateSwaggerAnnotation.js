/* eslint-disable security/detect-non-literal-fs-filename */
// generateSwaggerAnnotations.js
const fs = require('fs');

function generateSwaggerAnnotations(components, routeConfig) {
  // eslint-disable-next-line prettier/prettier
    const { route, method, summary, tags, requestBodySchema, responseSchemas } = routeConfig;

  // Generate request body schema annotation
  const requestBodyAnnotation = `
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/${requestBodySchema}'
`;

  console.log("responseSchemas", responseSchemas);
  // Generate response schemas annotation
  const responsesAnnotation = Object.entries(responseSchemas)
    .map(
      ([status, schema]) => `
 *       "${status}":
 *         description: ${schema.description}
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/${schema.ref}'
`
    )
    .join('');

  // Generate full Swagger annotation
  const swaggerAnnotation = `
/**
 * @swagger
 * ${route}:
 *   ${method}:
 *     summary: ${summary}
 *     tags: ${JSON.stringify(tags)}
${requestBodyAnnotation}${responsesAnnotation}
 */
`;

  return swaggerAnnotation;
}

function updateOrAddAnnotationsToFile(filePath, annotations, route, method) {
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Define start and end markers for the annotation block
  const startMarker = `/**
 * @swagger
 * ${route}:
 *   ${method}:`;
  const endMarker = ' */';

  const startIndex = fileContent.indexOf(startMarker);
  const endIndex = fileContent.indexOf(endMarker, startIndex) + endMarker.length;

  if (startIndex !== -1 && endIndex !== -1) {
    // Replace existing annotation
    const updatedContent = fileContent.slice(0, startIndex) + annotations + fileContent.slice(endIndex);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  } else {
    // Append new annotation if not found
    const updatedContent = `${annotations}\n${fileContent}`;
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }
}

module.exports = {
  generateSwaggerAnnotations,
  updateOrAddAnnotationsToFile,
};
