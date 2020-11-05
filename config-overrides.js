const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#4990DD',
      '@link-color': '#4990DD',
      '@font-size-base': '14px',
      '@heading-color': '#4A4A4A',
      '@text-color': '#4A4A4A',
      '@text-color-secondary': '#747D7D',
      '@disabled-color': '#D8D8D8',
      '@border-radius-base': '4px',
      '@border-color-base': '#D8D8D8',
      '@box-shadow-base': '0 1px 3px rgba(0, 0, 0, 0.10), 0 2px 6px rgba(0, 0, 0, 0.10), 0 3px 8px rgba(0, 0, 0, 0.10)',
    },
  }),
  function(config) {
    const alias = config.resolve.alias || {};
    alias['@ant-design/icons/lib/dist$'] = path.resolve(__dirname, './src/icons.js');
    config.resolve.alias = alias;
    return config;
  }
);
