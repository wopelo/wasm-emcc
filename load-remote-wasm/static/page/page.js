function addScript(sourceBlobUrl) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = sourceBlobUrl

        script.onload = () => {
            console.log('added js script to dom')
            script.onload = script.onerror = null
            resolve()
        }

        script.onerror = (e) => {
            console.error('script failed to add to dom:', e)
            reject(e.message)
        }

        document.body.appendChild(script)
    })
}

(async () => {
    // 下载并加载/wasm/index.js
    const resp = await fetch('/wasm/index.js')
    const source = await resp.arrayBuffer()

    const sourceBlobUrl = URL.createObjectURL(
        // arrayBuffer转blob
        new Blob([source], { type: 'application/javascript' }),
    )

    let module = {}

    if (window.Module === undefined) {
        window.Module = module
    } else {
        module = window.Module
    }

    // 当wasm编译完成时
    module.onRuntimeInitialized = () => {
        document.querySelector('#call').addEventListener('click', () => {
            Module.ccall('myFunction', null, null, null)
        })
    }

    // 当需要加载文件时，匹配路径返回文件
    // 如果不设置，.wasm会到http://localhost:3001/index.wasm下获取，返回404
    module.locateFile = (path, scriptDirectory) => {
        if (path.endsWith('.worker.js')) {
          return '/wasm/index.worker.js'
        } else if (path.endsWith('.wasm')) {
          return '/wasm/index.wasm'
        } else {
          return scriptDirectory + path
        }
    }

    await addScript(sourceBlobUrl)
})()
