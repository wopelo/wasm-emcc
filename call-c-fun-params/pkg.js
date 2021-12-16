// 把js函数注入c
// mergeInto第二个参数为一个对象，mergeInto将该对象合并到LibraryManager.library中
// LibraryManager.library是JavaScript注入C环境的库
mergeInto(LibraryManager.library, {
  js_add: function (a, b) {
    console.log('js_add')
    return a + b
  },
  js_addF: function (a, b) {
    console.log('js_addF')
    return a + b
  },
  js_console_log_int: function (param) {
    console.log('js_console_log_int:' + param)
  },
  js_console_log_float: function (param) {
    console.log('js_console_log_float:' + param)
  },
  js_console_log_string: function (param) {
    console.log('js_console_log_string', param)
  }
})