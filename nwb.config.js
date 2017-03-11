module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'StyloScope',
      externals: {
        react: 'React'
      }
    }
  }
}
