# ts-react-without-cra

### CRA 없이 타입스크립트 리액트 환경 구성하기

### 1. package.json 생성 및 디렉터리 구조잡기

- [x] _yarn init -y_
- [x] _mkdir src public build_
- [x] public폴더에 index.html, src폴더에 index.tsx, App.tsx 생성

### 2. typescript & react 환경구성

- [x] _yarn add typescript -D_
- [x] _yarn add react @types/react react-dom @types/react-dom_
- [x] html, index.tsx, App.tsx 연결
- [x] tsconfig.json 생성

_tsconfig.json 구성_

```
{
  "compilerOptions": {
    "target": "ES5",
    "module":"ES6",
    "allowJs": true,
    "jsx": "react",
    "sourceMap": true,
    "outDir": "./build",

    /* Strict Type-checking Options */
    "strict": true,

    /* Module Resolution Option */
    "moduleResolution": "node",
    "esModuleInterop": true,

    /* Advanced Option */
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true

  },
  "include": ["./src/**/*"]
}
```

### 3. webpack 설치 및 webpack.config.js 생성

- [x] _yarn add webpack webpack-cli -D_
- [x] webpack.config.js 파일생성

_초기 webpack.config.js 구성_

```
const path = require('path');
const appIndex = path.resolve(__dirname, 'src', 'index.tsx');
const appBuild = path.resolve(__dirname, 'build');

module.exports = (webpackEnv) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  return {
    mode: webpackEnv,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isProd
        ? 'static/js/[name].[contenthash].js'
        : isDev && 'static/js/[name].bundle.js',
    },
  };
};

```

- [x] ts-loader 설치 _yarn add ts-loader -D_
- [x] webpack 설정에 loader 추가!

_webpack.config.js ts-loader 추가한 코드_

```
const path = require('path');
const appIndex = path.resolve(__dirname, 'src', 'index.tsx');
const appBuild = path.resolve(__dirname, 'build');

module.exports = (webpackEnv) => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  return {
    mode: webpackEnv,
    entry: appIndex,
    output: {
      path: appBuild,
      filename: isProd
        ? 'static/js/[name].[contenthash].js'
        : isDev && 'static/js/[name].bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isDev ? true : false,
              },
            },
          ],
        },
      ],
    },
  };
};
```

### 4. Optional loaders

- [ ] _yarn add cache-loader -D_ : 최초 build 시에만 모든 파일을 읽고 다음 build 부터 cache로 읽어 변경사항이 있는 파일만 build 하여 빠른 production build를 얻을 수 있다.

- [ ] _yarn add file-loader -D_ : 이미지를 import 하기위해 필요한 로더
- [ ] _yarn add url-loader -D_ : 바이트 제한보다 작은 경우 DataURL를 반환하는 로더 (base64) file-loader와 같은 기능으로 동작

### 5. eslint 설정

- [x] _yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -D_
- [x] .eslintrc.json 파일 설정

```
vscode에서 ESLint extension 설치 후 아래 설정 적용

{
  "eslint.validate": [
    { "language": "typescript", "autoFix": true },
    { "language": "typescriptreact", "autoFix": true }
  ]
}
```

### 6. prettier와 eslint를 함께 사용하기 위한 설정

- [x] _yarn add prettier eslint-plugin-prettier eslint-config-prettier -D_
- [x] .eslintrc.json 설정 추가

_eslint + prettier 한 .eslintrc.json 코드_

```
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project":"./tsconfig.json",
  },
  "env": {
    "node": true
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ]
}
```

```
vscode에서 Prettier extension 설치 후 아래 설정 적용

{
  "javascript.format.enable": false,
  "typescript.format.enable": false
}
```

### 7. html-webpack-plugin 설치

- [x] _yarn add html-webpack-plugin -D_

_webpack.config.js에 플러그인 추가_

```
const appHtml = path.resolve(__dirname, 'public', 'index.html');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (webpackEnv) => {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        template: appHtml,
      }),
    ],
  };
};
```

### 8. 브라우저 캐싱 사용을 위해 manifest 플러그인 설정

- [x] _yarn add webpack-manifest-plugin -D_
- [x] webpack.config.js에 설정추가

```

const ManifestPlugin = require('webpack-manifest-plugin');
.
.
.
plugins: [
      new ManifestPlugin({
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce(
            (manifest, { name, path }) => ({ ...manifest, [name]: path }),
            seed
          );
          const entryFiles = entrypoints.main.filter(
            (filename) => !/\.map/.test(filename)
          );
          return { files: manifestFiles, entrypoints: entryFiles };
        },
      }),
    ],
```

### 9. 개발환경 설정

- [x] _yarn add webpack-dev-server -D_

```
const appPublic = path.resolve(__dirname, 'public');
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

 return {
    devServer: {
      port: 3000,
      contentBase: appPublic,
      open: true,
      historyApiFallback: true,
      overlay: true,
      stats: 'error-warnings',
    },
    devtool: isProd
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isDev && 'cheap-module-source-map',
```

### 10. npm script 작성
