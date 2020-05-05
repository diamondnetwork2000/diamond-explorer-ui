 const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
   style: true,
  }),
 addLessLoader({
   javascriptEnabled: true,
   modifyVars: { 
    
     '@font-size-base': '12px',
     '@table-padding-vertical' :'6px',
     '@table-padding-horizontal': '6px',
     '@layout-header-padding': '0 10px',
     '@table-header-bg' : '#474F74',
     '@table-header-color' : 'white',
     '@layout-footer-padding' : '0px 50px',
     
     
  },
 }),
);