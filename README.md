# 使用emcc编译 C/C++ 为 WebAssembly

## Emscripten 环境安装
https://developer.mozilla.org/zh-CN/docs/WebAssembly/C_to_wasm

## simple-demo
将C/C++编译为WebAssembly的简单演示

```shell
cd ./simple-demo/build
emcc ../index.c -s WASM=1 -o index.html -O3
```

-s WASM=1 — 指定wasm输出形式。如果不指定这个选项，Emscripten默认将只会生成asm.js。
-o index.html — 指定这个选项将会生成HTML页面来运行代码，并且会生成wasm模块，以及编译和实例化wasm模块所需要的“胶水”js代码，这样就可以直接在web环境中使用了。
-O3 - 对js进行优化，压缩代码

使用一个支持 WebAssembly 的浏览器，加载生成的index.html即可。

## custom-html
使用自定义HTML模板

```shell
cd ./custom-html/build
emcc ../index.c -o index.html -O3 -s WASM=1 --shell-file ../html-template/template.html
```

--shell-file ../html-template/template.html - 这指定了要运行的例子使用 HTML 页面模板。

使用一个支持 WebAssembly 的浏览器，加载生成的index.html即可。

## call-c-fun
调用在定义在c中的方法

```shell
cd ./call-c-fun/build
emcc ../index.c -o index.html -O3 -s WASM=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']" --shell-file ../html-template/template.html
```

index.c中，默认情况下，Emscripten 生成的代码只会调用 main() 函数，其它的函数将被视为无用代码。
在一个函数名之前添加 EMSCRIPTEN_KEEPALIVE 能够防止这样的事情发生。
需要导入 emscripten.h 库来使用 EMSCRIPTEN_KEEPALIVE。

使用一个支持 WebAssembly 的浏览器，加载生成的index.html即可。

## web-worker
在web worker中运行wasm

```shell
cd ./web-worker/build
emcc ../index.c -o index.html -O3 -s WASM=1 -s -pthread -s PROXY_TO_PTHREAD=1 --shell-file ../html-template/template.html -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"

cd ../
npm run dev
```
使用一个支持 WebAssembly 的浏览器，访问 http://localhost:3000 即可

-s -pthread -s PROXY_TO_PTHREAD=1 - 将原main()方法置于WebWorker中执行

chrome浏览器从92版本开始，ShareArrayBuffer的时候需要满足COOP、COEP跨域策略
https://developer.chrome.com/blog/enabling-shared-array-buffer/
页面需要支持跨域隔离，在响应头里添加

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```
 
设置完成后，资源需要添加 Cross-Origin-Resource-Policy 头或者 CORS 头才能正常加载

## only-js
只编译生成js

```shell
cd ./only-js/build
emcc ../index.c -o index.js  -s WASM=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']" 
```

使用一个支持 WebAssembly 的浏览器，加载生成的index.html即可。

## fs-system
文件系统

```shell
cd fs-system
emcc ./index.c -o ./build/index.js -O3 -s WASM=1 -s FORCE_FILESYSTEM=1
```

-s FORCE_FILESYSTEM=1 - 强制将文件系统添加进来，否则编译器将根据c/c++的需要，按需加载文件系统

使用一个支持 WebAssembly 的浏览器，加载生成的index.html即可。
全局下存在FS对象

## load-remote-wasm
模拟从远程加载wasm

```shell
# 前提工作，生成js/wasm
cd ./load-remote-wasm/build
emcc ../index.c -o index.html -O3 -s WASM=1 -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']" --shell-file ../html-template/template.html

cd ../
npm run dev
```

使用一个支持 WebAssembly 的浏览器，访问 http://localhost:3001/page 即可
