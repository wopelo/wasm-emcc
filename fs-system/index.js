console.log(Module, FS)

FS.mkdir('/working')
FS.mount(MEMFS, { root: '.' }, '/working')

function query(str) {
    return document.querySelector(str)
}

function bindEvent(selector, eventName, callBack) {
    const ele = query(selector)

    if (!ele) return

    ele.addEventListener(eventName, callBack)
}

function Uint8ArrayToString(fileData) {
    let dataString = ''
    for (let i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i])
    }

    return dataString
}

function stringToUint8Array(str) {
    let arr = []
    for (let i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i))
    }

    const tmpUint8Array = new Uint8Array(arr)
    return tmpUint8Array
}

bindEvent('#cwd', 'click', () => {
    // 获取当前路径
    console.log(FS.cwd())
})

bindEvent('#ls', 'click', () => {
    // 获取当前路径文件列表
    console.log(FS.readdir(FS.cwd()))
})

bindEvent('#cd', 'click', () => {
    // 进入文件夹，没有指定默认进入根路径
    const dir = query('#dirName').value || '/'
    FS.chdir(dir)
    console.log(`cd ${dir}`)
})

bindEvent('#mkdir', 'click', () => {
    const dir = query('#dirName').value

    if (!dir) {
        console.log('need dir name')
        return
    }

    FS.mkdir(dir)
    console.log(`mkdir ${dir}`)
})

// 读取文件
function readFile(type) {
    const fileName = query('#fileName').value

    if (!fileName) {
        console.log('need file name')
    } else if (FS.readdir(FS.cwd()).indexOf(fileName) >= 0) {
        console.log(FS.readFile(fileName, { encoding: type }))
    } else {
        console.log('file does not exist')
    }
}

bindEvent('#read', 'click', () => readFile('utf8'))
bindEvent('#readBinary', 'click', () => readFile('binary'))
bindEvent('#readStream', 'click', () => {
    const fileName = query('#fileName').value

    if (!fileName) {
        console.log('need file name')
        return
    }

    if (FS.readdir(FS.cwd()).indexOf(fileName) < 0) {
        console.log('file does not exist')
        return
    }
    
    const fsOpenStream = FS.open(fileName, 'r')
    const readStream =  new ReadableStream({
        start: (controller) => {
          const { usedBytes } = fsOpenStream.node
          const n = usedBytes < 100 ? usedBytes : 100
          const total = Math.ceil(usedBytes / n)
          let time = 0
  
          while (time < total) {
            const buf = new Uint8Array(n)
            FS.read(fsOpenStream, buf, 0, n, time * n)
            controller.enqueue(buf)
            time++
          }
  
          controller.close()
        },
    })

    const reader = readStream.getReader()
    let str = ''

    function processText({
      done,
      value,
    }) {
      if (done) {
        console.log('Stream complete', str)
        return
      }

      str += Uint8ArrayToString(value || new ArrayBuffer(0))
      return reader.read().then(processText)
    }

    reader.read().then(processText);
})


// 写入文件
function writeFile(type) {
    const fileName = query('#msgName').value

    if (!fileName) {
        console.log('need file name')
    } else {
        const msg = query('#msg').value
        FS.writeFile(fileName, type === 'utf8' ? msg : stringToUint8Array(msg))
        console.log('write success')
    }
}

bindEvent('#write', 'click', () => writeFile('uft8'))
bindEvent('#writeBinary', 'click', () => writeFile('binary'))
bindEvent('#writeStream', 'click', async () => {
    const fileName = query('#msgName').value
    if (!fileName) {
        console.log('need file name')
        return
    } 

    const url = query('#msg').value
    if (!url) {
        console.log('need file url')
        return
    }

    const response = await fetch(url)
    const reader = response.body.getReader()

    if (!reader) {
      return
    }

    const fsOpenStream = FS.open(fileName, 'w', 0o666)
    const writeStream = new WritableStream({
      write: (chunk) => {
        if (!chunk) {
          return
        }

        FS.write(fsOpenStream, chunk, 0, chunk.length, 0)
      },
      // To ensure that data is synced to the system
      close: async () => {
        FS.close(fsOpenStream)
      },
    })

    const defaultWriter = writeStream.getWriter()
    while (true) {
        const { value, done } = await reader.read()
        defaultWriter.write(value)
        if (done) {
          // because FS.syncfs is async
          await defaultWriter.close()
          break
        }
        console.log('Received', value)
    }
    console.log('Response fully received')
})

bindEvent('#stat', 'click', () => {
    const path = query('#path').value

    if (!path) {
        console.log('需要指定路径')
        return
    }

    console.log(FS.stat(path))
})
