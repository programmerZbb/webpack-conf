// 规则参考：https://eslint.bootcss.com/docs/rules/
// prettier-ignore，发现 prettier 兼容性不是很好，直接用eslint来做风格统一
module.exports = {
    // "root": true,
    "env": { // 环境
        "browser": true,
        "es2021": true,
        "node": true, // node 语法不会报错
    },
    "extends": [ // 继承的规则需要在 node_modules 中安装
        "eslint:recommended", // 看起来都是 recommend
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        'alloy',
        'alloy/react',
        'alloy/typescript',
        // // 'prettier', // prettier生效语句
        // // "prettier/@typescript-eslint",
        // "plugin:prettier/recommended"
        // 'plugin:prettier/recommended', // 只需要这一条！
    ],
    "parser": "@typescript-eslint/parser", // 指定解析器
    // "parserOptions": {
    //     "ecmaFeatures": { // 兼容react
    //         "jsx": true
    //     },
    //     "ecmaVersion": "latest", // 指定 es 版本
    //     "sourceType": "module", // es6 import 语法必须用 module
    //     "project": ["./tsconfig.json"], // tsconfig 位置
    //     // "createDefaultProgram": true,
    // },
    "plugins": [ // 省略 eslint-plugin
        "react", // eslint-plugin-react
        "@typescript-eslint", // 含有命名空间的，@typescript-eslint/eslint-plugin
        "eslint-plugin-import",
        "eslint-plugin-jsdoc",
        "eslint-plugin-prefer-arrow"
    ],
    overrides: [{
        files: ['*.ts', '*.tsx'],

        parserOptions: {
            project: ['./tsconfig.json'], // Specify it only for TypeScript files
            ecmaVersion: 2020,
            sourceType: "module",
            createDefaultProgram: true,
        },
        "rules":  {
            // 调整eslint:recommended
            "no-constant-condition": "off", // 允许判断为常量
        
            // 调整@typescript-eslint/eslint-recommended
            "prefer-const": "off", // 默认开启，关闭
        
            // 调整@typescript-eslint/recommended
            "@typescript-eslint/no-empty-function": "off", // 允许空函数
            "@typescript-eslint/no-empty-interface": ["error", { // 默认为error，允许extends时不做添加
              "allowSingleExtends": true
            }],
            "@typescript-eslint/no-namespace": "off", // 默认开启要求使用module代替namespace，和prefer-namespace-keyword冲突，关闭
            "@typescript-eslint/no-unused-vars": "off", // 关闭无用变量警告，自行编写的.d.ts文件会出现太多警告，变量未使用编辑器浅色提示
        
            // 调整@typescript-eslint/recommended-requiring-type-checking
            "@typescript-eslint/no-floating-promises": ["error", {
              "ignoreVoid": true, // void后可以跟promise
              "ignoreIIFE": true // iife函数可以返回promise
            }],
            "@typescript-eslint/no-misused-promises": ["error", {
              "checksConditionals": true,
              "checksVoidReturn": false // 默认为true，常见订阅函数使用async方便内部异步调用
            }],
            "@typescript-eslint/no-unsafe-argument": "off", // 允许any作为函数参数
            "@typescript-eslint/no-unsafe-assignment": "off", // 允许any赋值至其他变量
            "@typescript-eslint/no-unsafe-call": "off", // 允许调用any类型的方法
            "@typescript-eslint/no-unsafe-member-access": "off", // 允许访问any类型的属性
            "@typescript-eslint/no-unsafe-return": "off", // 允许返回any类型
            "@typescript-eslint/restrict-template-expressions": ["error", { // 模板插值允许类型
              "allowNumber": true,
              "allowBoolean": true,
              "allowAny": true,
              "allowNullish": true
            }],
            "@typescript-eslint/unbound-method": "off", // 绑定回调时无需bind this
        
            // 调整@angular-eslint/recommended
            "no-restricted-imports": ["error", {"paths": [{ // 默认
              "name": "rxjs/Rx",
              "message": "Please import directly from 'rxjs' instead"
            }, { // 新增lodash相关，不能直接使用，必须使用子文件
              "name": "lodash-es",
              "message": "Please import corresponding submodule instead"
            }]}],
            "@typescript-eslint/no-inferrable-types": "off", // 默认允许函数参数带有类型，此处完整关闭
            "@typescript-eslint/member-ordering": "off", // 自行设定顺序
            "max-len": ["warn", {"code": 200}], // 默认长度140，放大
            // "quote-props": ["error", "consistent"], // 默认为as-needed，修改为一致
        
            // 参考ng-cli-compat新增
            // "@angular-eslint/component-selector": ["error", { // 此处取消对prefix的限制
            //   "type": "element",
            //   // "prefix": "app",
            //   "style": "kebab-case"
            // }],
            // "@angular-eslint/directive-selector": ["error", {
            //   "type": "attribute",
            //   // "prefix": "app",
            //   "style": "camelCase"
            // }],
            "@typescript-eslint/consistent-type-assertions": "error",
            "dot-notation": "off", // 使用.而非[]访问属性
            // "@typescript-eslint/dot-notation": "error",
            "@typescript-eslint/dot-notation": "off", // 允许使用['aa']访问字段
            "@typescript-eslint/naming-convention": ["error", { // 默认变量命名为camelCase，增加PascalCase
              "selector": "variable",
              "format": ["camelCase", "PascalCase"],
              "leadingUnderscore": "allow" // 允许头部带下划线
            }],
            // "@typescript-eslint/no-parameter-properties": "off", // 默认即关闭
            "no-unused-expressions": "off", // 避免无效表达式
            "@typescript-eslint/no-unused-expressions": ["error"],
            "@typescript-eslint/no-use-before-define": "off", // 默认即关闭
            "@typescript-eslint/prefer-for-of": "error", // 优先使用for-of
            "@typescript-eslint/prefer-function-type": "error", // 优先使用函数类型，避免使用interface A { (): string }
            // "@typescript-eslint/unified-signatures": "error", // 如何分割有用户自行确定，暂不使用
            // "complexity": "off", // if..else路径数量，默认即关闭
            "eqeqeq": ["error", "smart"], // 限定比较使用===
            "guard-for-in": "error", // for-in必须额外guard
            "id-blacklist": [ // 变量名、函数名、对象属性黑名单
              "error",
              "any",
              "Number", "number",
              "String", "string",
              "Boolean", "boolean",
              "Undefined", "undefined"
            ],
            // "id-match": "error", // 变量名、函数名、对象属性允许范围，暂不使用
            "import/no-deprecated": "warn", // deprecated时警告
            "jsdoc/newline-after-description": "error", // 默认参数为always，描述后要求空行
            "jsdoc/no-types": "error", // @param和@returns不需要类型，类型由ts提供
            "no-bitwise": "error", // 禁止位运算
            // "no-caller": "error", // 避免caller和callee的使用，ES5严格模式已不允许
            "no-console": ["error", {"allow": [ // 限制console的使用
              "log", "warn", "dir", "timeLog", "assert",
              "clear", "count", "countReset", "group", "groupEnd",
              "table", "dirxml", "error", "groupCollapsed", "Console",
              "profile", "profileEnd", "timeStamp", "context"
            ]}],
            "no-eval": "error", // 不允许使用eval
            "no-invalid-this": "off", // 特定场合允许使用this
            "no-new-wrappers": "error", // 不允许new String('')这样的写法
            // "no-shadow": ["error", {"hoist": "all"}], // 允许覆盖外部变量名，很多callback使用类似的变量
            // "@typescript-eslint/no-shadow": "off", // 新增行，使用本功能时需要关闭eslint并打开tyescript的rule
            // "no-throw-literal": "error", // 仅允许抛出Error对象，方便跟踪和调试，项目中抛出R3TError
            "no-undef-init": "error", // 避免初始化为undefined
            // "no-underscore-dangle": "error", // 近期标识符以_开头
            // "object-shorthand": "error", // 对象属性和变量名一致时简写，暂不强制要求
            // "one-var": ["error", "never"], // 每次只能声明一个变量，因为没有合适的选项，暂不使用
            "prefer-arrow/prefer-arrow-functions": ["error", { // 调整参数
              "allowStandaloneDeclarations": true // 允许top-level函数
            }], // 要求使用箭头函数
            "radix": "error", // parseInt时要求指定数制，避免其自动检测
        
            // 参考ng-cli-compat--formatting-add-on新增
            "arrow-body-style": "error", // 限定什么时候允许使用箭头函数形态
            // "curly": "error", // if后必须带有{}，此处关闭
            // "eol-last": "error", // 要求文件最后为空行
            // "jsdoc/check-alignment": "error", // 检查jsdoc对齐，此次关闭
            "new-parens": "error", // new A时必须带有()
            "no-trailing-spaces": ["error", { // 避免尾部空白
              "ignoreComments": true // 允许comment中有空白
            }],
            "space-before-function-paren": ["error", {
              "anonymous": "never", // 无名函数参数紧贴function
              "named": "never", // 命名函数参数紧贴函数名
              "asyncArrow": "always" // async箭头函数参数之前有空格
            }],
            "@typescript-eslint/member-delimiter-style": ["error", { // 使用逗号分离interface成员
              "multiline": {
                "delimiter": "comma",
                "requireLast": true
              },
              "singleline": {
                "delimiter": "comma",
                "requireLast": false
              }
            }],
            "quotes": "off", // 仅使用单引号，且允许`xxx`字符串
            "@typescript-eslint/quotes": ["error", "single", {
              "allowTemplateLiterals": true
            }],
            "semi": "off", // 要求以;结尾
            "@typescript-eslint/semi": ["error", "always", {
              "omitLastInOneLineBlock": true // 单行block允许不带
            }],
            "@typescript-eslint/type-annotation-spacing": "error", // 类型注释要求空格
        
            // 新增
            "no-restricted-syntax": ["error",
              // "FunctionExpression", // 避免let a = function() {}，会影响class中的方法
              "WithStatement", // 避免with
              "BinaryExpression[operator='in']", // 避免foo in bar
              { // 使用@angular-eslint/recommended中设定
                "selector": "CallExpression[callee.object.name=\"console\"][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]",
                "message": "Unexpected property on console object was called"
              }
            ],
            "no-duplicate-imports": "warn",  // 禁止import重复的模块
            "no-return-await": "error", // 不允许return await这样的写法，默认off
            // ban forEach，不知道该怎么实现 TODO
            "@typescript-eslint/strict-boolean-expressions": ["error", { // 后续可以打开strictNullChecks进一步提高检查
              "allowString": false, // 默认允许，字符串为空时为false，此处关闭
              "allowNumber": false, // 默认允许，0和NaN时为false，此处关闭
              "allowNullableObject": false, // 默认允许，非null/undefined时为true，此处关闭
              "allowNullableBoolean": true,
              "allowNullableString": false,
              "allowNullableNumber": false,
              "allowAny": false,        
              "allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing": true
            }],
            "@typescript-eslint/prefer-literal-enum-member": "error" // 所有的enum声明都必须带有数字
        },
    }],
    "settings": { // react版本问题， 参考：https://github.com/yannickcr/eslint-plugin-react#configuration 
        "react": {
            "version": "detect"
        }
    }
}
