const Koa = require('koa')
const serve = require('koa-static')

const app = new Koa()

const home = serve('./build')

async function addHeader(ctx, next) {
  ctx.set('Cross-Origin-Resource-Policy', 'same-origin')
  ctx.set('Cross-Origin-Embedder-Policy', 'require-corp')
  ctx.set('Cross-Origin-Opener-Policy', 'same-origin')

  await next()
}

app.use(addHeader)
app.use(home)

app.listen(3000)

console.log(`serve listen at 3000`)