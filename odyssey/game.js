var getColor = (canv, x, y) =>
  canv.getContext("2d").getImageData(x, y, 1, 1).data
var canvas = document.getElementById("real")
  , ctx = canvas.getContext("2d")
  , disp = document.getElementById("display")
  , dispCtx = disp.getContext("2d")
  , w = innerWidth < innerHeight * 1.5 ? innerWidth : innerHeight * 1.5
  , h = innerWidth < innerHeight * 1.5 ? Math.floor(innerWidth * 2 / 3) : innerHeight
  , setup = () => {
  window.onresize = () => {
    w = innerWidth < innerHeight * 1.5 ? innerWidth : innerHeight * 1.5
    , h = innerWidth < innerHeight * 1.5 ? Math.floor(innerWidth * 2 / 3) : innerHeight
    disp.style.width = (disp.width = Math.floor(w)) + "px"
    disp.style.height = (disp.height = Math.floor(h)) + "px"
    mainStack.push(finalStep)
    dispCtx.scale(w / 96, h / 64)
    dispCtx.imageSmoothingEnabled = false
    mainStack.push(() =>
      binds.map(e => keysDown[e.code] ? e.action.map(f => f()) : e.antiAction.map(f => f())))
  }
  window.onresize()
}

var textCanvas = document.createElement("canvas")
textCanvas.width = 96
textCanvas.height = 64
var textCtx = textCanvas.getContext("2d")
var getChar
var codepage = document.createElement("img")
codepage.src = "/letters.png"
getChar = (x, y, page) => {
  var canvas = document.createElement("canvas")
  canvas.width = 4
  canvas.height = 6
  var img = document.createElement("img")
  img.src = `/letters.png`
  canvas.getContext("2d").drawImage(codepage, 4 * x, 6 * y, 4, 6, 0, 0, 4, 6)
  return canvas
}
var putChar = (str, x, y) => {
  var codes = [
      Array(16)
    , Array(16) // todo
    , " !\"#$%&'()*+,-./".split("")
    , "0123456789:;<=>?".split("")
    , "@ABCDEFGHIJKLMNO".split("")
    , "PQRSTUVWXYZ[\\]^_".split("")
    , "`abcdefghijklmno".split("")
    , "pqrstuvwxyz{|}~\b".split("")
  ];
  for (var k = 0; k < str.length; k++) {
    for (var j = 0; j < codes.length; j++) {
      for (var i = 0; i < codes[j].length; i++) {
        if (str[k] == codes[j][i]) {
          textCtx.drawImage(getChar(i, j), x + 4 * k, y)
        }
      }
    }
  }
}

var keysDown = {}
addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true
	return false
}, false)
addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode]
	return false
}, false)

var binds = [

]

var finalStep = () => {
  dispCtx.clearRect(0, 0, w, h)
  var img = document.createElement("img")
  img.src = canvas.toDataURL()
  dispCtx.drawImage(img, 0, 0)
}
var mainStack = (() => {
  var init = false
  return [() => {
    !init ? (setup(), init = true) : null
    setTimeout(main, 1)
  }]
})()

mainStack.push(() => ctx.drawImage(textCanvas, 0, 0))

var main = () => mainStack.forEach(f => f())
main()
