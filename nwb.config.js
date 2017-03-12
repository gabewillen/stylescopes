module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'StyleScopes',
      externals: {
        react: 'React'
      }
    }
  },
    webpack: {
        extra: {
            node: {
                fs: 'empty'
            }
        }
    }
};
