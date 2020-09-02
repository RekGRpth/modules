const { html } = just.library('html.so', 'html')
const { loop } = just.factory

function runbench (runs = 10, step = 1000) {
  const buf = ArrayBuffer.fromString('hello<this> is a test')
  const out = new ArrayBuffer(1024)
  let u32
  let rps = 0
  function bench () {
    for (let i = 0; i < step; i++) {
      //html.escape(buf)
      html.escape2(buf, out)
      rps++
    }
    if (--runs) {
      loop.poll(0)
      just.sys.nextTick(bench)
      just.sys.runMicroTasks()
      return
    }
    just.clearInterval(timer)
  }
  const timer = just.setInterval(() => {
    if (just.buffer) {
      u32 = new Uint32Array(just.buffer)
    }
    if (u32) {
      Atomics.exchange(u32, 0, rps)
    } else {
      const { user, system } = just.cpuUsage()
      const { rss } = just.memoryUsage()
      just.print(`rps ${rps} mem ${rss} cpu (${user.toFixed(2)}/${system.toFixed(2)}) ${(user + system).toFixed(2)}`)
    }
    rps = 0
  }, 1000)
  rps = 0
  bench()
}
const out = new ArrayBuffer(1024)
const dv = new DataView(out)
const buf = ArrayBuffer.fromString('hello<this> is a testhello<this> is a test')

let off = 0
const escaped = html.escape2(buf, out, buf.byteLength, 0, off)
just.print(escaped)
just.print(dv.getUint32(0, true))

off += dv.getUint32(off, true) + 4
just.print(off)
const escaped2 = html.escape2(buf, out, buf.byteLength, 0, off)
just.print(escaped2)
just.print(dv.getUint32(off, true))

off += dv.getUint32(off, true) + 4
const escaped3 = html.escape2(buf, out, 10, 0, off)
just.print(dv.getUint32(off, true))

just.print(escaped)
just.print(escaped2)
just.print(escaped3)

runbench(30000, 2000)
/*
const out = new ArrayBuffer(1024)
let buf = ArrayBuffer.fromString('hello<this> is a testhello<this> is a test')
const a = html.escape2(buf, out)
const b = html.escape(buf)
const c = html.escape2(buf, out, 10, 0, 0)
buf = ArrayBuffer.fromString('omg <cool>')
const d = html.escape2(buf, out, buf.byteLength, 0, 20)
just.print(a)
just.print(b)
just.print(c)
just.print(d)
*/