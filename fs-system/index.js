console.log(Module, FS)

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

FS.mkdir('/working')
FS.mount(MEMFS, { root: '.' }, '/working')

// 读写字符串文件
try {
    FS.writeFile('text_file', 'foobar')
    const text_file = FS.readFile('text_file', { encoding: 'utf8' })

    console.log(text_file)
} catch(err) {
    console.log(err)
}

// 读写Uint8Array文件
try {
    FS.writeFile('ua_file', stringToUint8Array('foobar'))
    const ua_file = FS.readFile('ua_file', { encoding: 'utf8' })

    console.log(ua_file)
} catch(err) {
    console.log(err)
}

console.log(FS.lookupPath('/working', { parent: true, follow: true }))