const path = require("path");
const WriteFilePlugin = require('write-file-webpack-plugin')


module.exports = {
    outputDir: path.resolve(__dirname, "../www"),
    publicPath: '',
    configureWebpack: {
        plugins: [
            new WriteFilePlugin()
        ]
    }
}
