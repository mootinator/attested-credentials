const path = require('path');

module.exports = {
  entry: './src/replace_fields.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};