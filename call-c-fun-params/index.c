#include <stdio.h>
#include <malloc.h>
#include <string.h>
#include <emscripten.h>

// 定义函数导出宏
// __EMSCRIPTEN__宏用于探测是否是Emscripten环境
// __cplusplus用于探测是否C++环境
// EMSCRIPTEN_KEEPALIVE是Emscripten特有的宏，用于告知编译器后续函数在优化时必须保留，并且该函数将被导出至JavaScript
#ifndef EM_PORT_API
#	if defined(__EMSCRIPTEN__)
#		include <emscripten.h>
#		if defined(__cplusplus)
#			define EM_PORT_API(rettype) extern "C" rettype EMSCRIPTEN_KEEPALIVE
#		else
#			define EM_PORT_API(rettype) rettype EMSCRIPTEN_KEEPALIVE
#		endif
#	else
#		if defined(__cplusplus)
#			define EM_PORT_API(rettype) extern "C" rettype
#		else
#			define EM_PORT_API(rettype) rettype
#		endif
#	endif
#endif

void emscripten_run_script(const char *script);

int main(int argc, char ** argv) {
	emscripten_run_script("console.log('From emscripten_run_script', [{a: true}]);");
	EM_ASM(console.log('From EM_ASM', [{a: true}]));
  printf("Hello World\n");
}

EM_PORT_API(int) g_int = 42;
EM_PORT_API(double) g_double = 3.1415926;

EM_PORT_API(int*) get_int_ptr() {
	return &g_int;
}

EM_PORT_API(double*) get_double_ptr() {
	return &g_double;
}

EM_PORT_API(void) print_data() {
	printf("C{g_int:%d}\n", g_int);
	printf("C{g_double:%lf}\n", g_double);
}

EM_PORT_API(void) print_int(int a) {
	printf("C{print_int() a:%d}\n", a);
}

EM_PORT_API(void) print_float(float a) {
	printf("C{print_float() a:%f}\n", a);
}

EM_PORT_API(void) print_double(double a) {
	printf("C{print_double() a:%lf}\n", a);
}

// 生成斐波那契数列
EM_PORT_API(int*) fibonacci(int count) {
	if (count <= 0) return NULL;

	int* re = (int*)malloc(count * 4);
	if (NULL == re) {
		printf("Not enough memory.\n");
		return NULL;
	}

	re[0] = 1;
	int i0 = 0, i1 = 1;
	for (int i = 1; i < count; i++){
		re[i] = i0 + i1;
		i0 = i1;
		i1 = re[i];
	}
	
	return re;
}

// 求数组前count项的和
EM_PORT_API(int) sum(int* ptr, int count) {
	int total = 0;
	for (int i = 0; i < count; i++){
		total += ptr[i];
	}
	return total;
}

// 向js传递字符串
EM_PORT_API(const char*) get_string() {
	static const char str[] = "Hello, wolrd! 你好，世界！";
	return str;
}

// 打印js通过内存传递的字符串
EM_PORT_API(void) print_string(char* str) {
	printf("%s\n", str);
}

// c调用js函数
EM_PORT_API(int) js_add(int a, int b);
EM_PORT_API(float) js_addF(float a, float b);
EM_PORT_API(void) js_console_log_int(int param);
EM_PORT_API(void) js_console_log_float(float param);
EM_PORT_API(void) js_console_log_string(char* str);

EM_PORT_API(void) print_the_answer() {
	int i = js_add(21, 21);
	float j = js_addF(1.1, 1.1);
	js_console_log_int(i);
	js_console_log_float(j);
	js_console_log_string("Hello, wolrd! 你好，世界！");
}

// 通过ccall传递Uint8Array
EM_PORT_API(int) getTotal(uint8_t* ptr, int count) {
	int total = 0, temp;
	for (int i = 0; i < count; i++){
		memcpy(&temp, ptr + i * 4, 4);
		total += temp;
	}
	return total;
}
