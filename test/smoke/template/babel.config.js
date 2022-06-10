// 默认配置文件参考：https://babeljs.io/docs/en/config-files。多种写法
// prettier-ignore
module.exports = {
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
    ],
    "plugins": [
        "@babel/proposal-class-properties",
        "@babel/plugin-syntax-dynamic-import", // 动态 import
        // "transform-es3-member-expression-literals" // 转换为es3
    ]
};
