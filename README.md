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
emcc ../index.c -o index.html -O3 -s WASM=1 --shell-file ../html_template/template.html
```

--shell-file ../html_template/template.html - 这指定了要运行的例子使用 HTML 页面模板。

使用一个支持 WebAssembly 的浏览器，加载生成的index.html即可。
