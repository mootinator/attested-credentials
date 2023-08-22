const path = require('path');

module.exports = {
  entry: { main: './src/replace_fields.js', in_page: './src/in_page.js' },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};