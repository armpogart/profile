const sortCSSMq = require('sort-css-media-queries');
// const uncss = require('uncss').postcssPlugin;

module.exports = ({file, options, env}) => {
    return {
        map: options.map,
        syntax: file.extname === '.scss' ? 'postcss-scss' : false,
        plugins: {
            'postcss-unprefix': env === 'production' ? {} : false,
            'autoprefixer': env === 'production' ? {} : false,
            'css-mqpacker': env === 'production' ? {sort: sortCSSMq} : false,
            'postcss-uncss': {html: ['dist/**/*.html'], ignoreSheets : [/fonts.googleapis/], "ignore": [".tag.hover"]},
            'cssnano': env === 'production' ? {} : false,
        },
    };
};
