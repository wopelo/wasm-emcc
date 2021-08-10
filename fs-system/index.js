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
