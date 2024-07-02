const parse = require('joi-to-json');
const validationSchema = require('../../validations/auth.validation');

const jsonSchema = parse(validationSchema.login.body);

console.log('json schema', jsonSchema);
