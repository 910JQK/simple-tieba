const path = require("path");
const WriteFilePlugin = require('write-file-webpack-plugin')


module.exports = {
    outputDir: path.resolve(__dirname, "../www"),
    configureWebpack: {
        plugins: [
            new WriteFilePlugin()
        ],
    }
}
