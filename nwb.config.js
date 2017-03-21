module.exports = {
    type: 'react-component',
    babel: {
        plugins: ['transform-class-constructor-call']
    },
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
