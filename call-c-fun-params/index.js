Module.onRuntimeInitialized = function() {
  const int_ptr = Module._get_int_ptr()
  // 获取了该地址对应的int32值。由于Module.HEAP32每个元素占用4字节，因此int_ptr需除以4（既右移2位）方为正确的索引
  const int_value = Module.HEAP32[int_ptr >> 2]
  console.log("JS{int_value:" + int_value + "}")

  const double_ptr = Module._get_double_ptr()
  const double_value = Module.HEAPF64[double_ptr >> 3]
  console.log("JS{double_value:" + double_value + "}")
  
  // js改动c中定义的变量
  Module.HEAP32[int_ptr >> 2] = 13
  Module.HEAPF64[double_ptr >> 3] = 123456.789      
  Module._print_data()
}

document.querySelector('#change').addEventListener('click', () => {
  // 由于C/C++是强类型语言，因此来自JavaScript的Number传入时，会发生隐式类型转换
  // Number传入时，若目标类型为int，将执行向0取整；若目标类型为float，类型转换时有可能损失精度
  Module._print_int(3.4)
  Module._print_int(4.6)
  Module._print_int(-3.4)
  Module._print_int(-4.6)
  Module._print_float(2000000.03125)
  Module._print_double(2000000.03125)
})

// c通过内存向js传递数据
document.querySelector('#fibonacci').addEventListener('click', () => {
  let ptr = Module._fibonacci(10)

  if (ptr == 0) return

  let str = ''

  for (let i = 0; i < 10; i++){
    str += Module.HEAP32[(ptr >> 2) + i]
    str += ' '
  }

  console.log(str)

  // C函数fibonacci()在堆上分配了空间，在JavaScript中调用后需要调用free_buf()将其释放以免内存泄漏
  Module._free_buf(ptr)
})

// js通过内存向c传递数据
document.querySelector('#sum').addEventListener('click', () => {
  const count = 50
  // 调用c malloc方法分配内存
  const ptr = Module._malloc_buf(4 * count)

  for (let i = 0; i < count; i++){
    Module.HEAP32[ptr / 4 + i] = i + 1
  }

  console.log(Module._sum(ptr, count))
  Module._free_buf(ptr)
})
