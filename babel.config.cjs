// Renombra a babel.config.cjs
module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { 
        node: 'current' 
      },
      modules: 'auto'
    }],
    '@babel/preset-react'
  ]
};