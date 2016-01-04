var image = url => {
  var i = new Image()
  i.src = url
  return i
}
//(url => (i => (i.src = url, i))(new Image))

var Thing = a => {
  var o = {}
  a.forEach(p =>
    p.slice(0, p.length - 1).forEach(k =>
      o[k] = p[p.length - 1]))
  return o
}

var randNPC = () => Thing([
  ["image", image(Math.round(Math.random()) ? (console.log("prometheus"), "/prometheus.png") : (console.log("bro"), "/bro.png"))]
])

var player = Thing([
  ["x", "y", 0]
  , ["type", "slider"]
  , ["width", "height", 8]
  , ["render", "image"]
  , ["image", "tile", image("/prometheus.png")]])

var cyclops = Thing([
  ["x", 40]
  , ["y", 0]
  , ["type", "tile"]
  , ["width", "height", 16]
  , ["render", "image"]
  , ["image", image("/cyclops.png")]
  , ["tile", image("/eye.png")]
])

var toStatic = (obj, shallow) =>
  (o => (Object.keys(obj).map(k => o[k] = obj[k].constructor == Object && !shallow
    ? toStatic(obj[k])
    : obj[k].constructor == Function
      ? obj[k]()
      : obj[k]), o))({})

binds = [
  {
    code: 13
    , action: [() => ctx.clearRect(0, 0, 96, 64)]
    , antiAction: []
  }
  , {
    code: 87
    , action: [() => player.y -= 0.1]
    , antiAction: []
  }
  , {
    code: 65
    , action: [() => player.x -= 0.1]
    , antiAction: []
  }
  , {
    code: 83
    , action: [() => player.y += 0.1]
    , antiAction: []
  }
  , {
    code: 68
    , action: [() => player.x += 0.1]
    , antiAction: []
  }
]

var count = 0

mainStack.push(() => {
  player.x = Math.max(0, Math.min(96 - player.width, player.x))
  player.y = Math.max(0, Math.min(64 - player.height, player.y))
  if (count % 10 == 0) {
    player.x = Math.round(player.x)
    player.y = Math.round(player.y)
    ctx.clearRect(0, 0, 96, 64)
    ctx.fillStyle = player.color
    ctx.drawImage(player.image, player.x, player.y)
  }
  count++
});

var timedWrite = (str, x, y, time, onDone) => setTimeout((function(str, x, y) {
  return function f() {
    putChar(str[0], x, y)
    x += 4
    str = str.substr(1)
    str ? setTimeout(f, time || 250) : (onDone || (x => x))()
  }
})(str, x, y), time || 250)

var room = 0

rooms = [
  [
    {
      type: "door"
      , to: {
        room: () => 1
        , x: () => 0
        , y: () => player.y
        , action: () => sequence([
          block,
          [player.image, "Look, Cyclops."],
          [player.image, "you ate lots of people."],
          [player.image, "Drink some wine so you"],
          [player.image, "know what kind of"],
          [player.image, "liquor we had on my"],
          [cyclops.image, "RAWR."],
          [player.image, "..."],
          unblock
        ])
      }
      , x: 92
      , y: 30
      , width: 4
      , height: 4
      , color: "#000000"
    }
  ]
  , [
    {
      type: "door"
      , to: {
        room: () => 2
        , x: () => 4
        , y: () => player.y
        , action: () => (sequence([
          block,
          [player.image, "Uh..."],
          [player.image, "Okay then."],
          [player.image, "I was bringing it to"],
          [player.image, "be nice, when all you"],
          [player.image, "do is behave badly."],
          [player.image, "You ought to be "],
          [player.image, "ashamed of yourself"],
          [player.image, "why would people visit"],
          [player.image, "any more if you treat"],
          [player.image, "them so badly?"],
          [image("/blank.png"), "(You have the wine.)"],
          [image("/blank.png"), "(Give it to)"],
          [image("/blank.png"), "(Polyphemus.)"],
          () => mainStack.push((() => {
            var wineGiven = false
            return () => {
              if (!wineGiven) {
                blocking = true
                if (colliding(player, cyclops)) {
                  wineGiven = true
                  sequence([
                    [cyclops.image, "THIS IS NICE. CAN I)"],
                    [cyclops.image, "HAVE MORE?"],
                    [player.image, "Yes, you may."],
                    [cyclops.image, "THANK YOU."],
                    () => null,
                    [cyclops.image, "SORRY, DIDN'T CATCH"],
                    [cyclops.image, "YOUR NAME."],
                    [player.image, "My name is Nobody."],
                    [cyclops.image, "WELL, I'M GOING TO"],
                    [cyclops.image, "EAT ALL OF NOBODY'S"],
                    [cyclops.image, "FRIENDS, THEN EAT"],
                    [cyclops.image, "NOBODY."],
                    () => null,
                    [cyclops.image, "lol."],
                    () => null,
                    [cyclops.image, "*falls over drunk*"],
                    unblock
                  ])
                }
              }
            }
          })())
        ]))
      }
      , x: 92
      , y: 30
      , width: 4
      , height: 4
      , color: "#000000"
    }
  ]
  , [
    {
      type: "door"
      , to: {
        room: () => 3
        , x: () => 0
        , y: () => player.y
        , action: () => (sequence([
          block,
          [player.image, "(Ready, guys?)"],
          [randNPC().image, "(Yep.)"],
          [randNPC().image, "(Yes.)"],
          [randNPC().image, "(We are ready.)"],
          () => mainStack.push((n => () => (ctx.fillStyle = "#D20", ctx.fillRect(Math.round(n / 10), 24, 8, 8), n++))(-660)),
          () => mainStack.push((n => () => (ctx.fillStyle = "#222", ctx.fillRect(Math.round(n / 10), 24, 96, 8), n++))(-1280)),
          () => mainStack.push(((n, carrier) => () => (ctx.drawImage(carrier.image, Math.round(n / 10), 30), n++))(-80, randNPC())),
          () => mainStack.push(((n, carrier) => () => (ctx.drawImage(carrier.image, Math.round(n / 10), 30), n++))(-80, randNPC())),
          () => mainStack.push(((n, carrier) => () => (ctx.drawImage(carrier.image, Math.round(n / 10), 30), n++))(-80, randNPC())),
          () => null,
          () => null,
          () => null,
          () => null,
          [cyclops.image, "OW THAT REALLY HURT"],
          [player.image, " :)"],
          () => null,
          [cyclops.image, "GRRRRRRRRR"],
          [image("/wut.png"), "YOUR NOISEY TONIHT"],
          [cyclops.image, "LEAVE ME ALONE, YOU"],
          [cyclops.image, "ILLITERATE JERK"],
          () => null,
          [cyclops.image, "HOW DO YOU EVEN"],
          [cyclops.image, "MANAGE TO MISSPELL"],
          [cyclops.image, "VERBAL COMMUNICATION"],
          () => null,
          [image("/wut.png"), "SO WHY ARE YOU SO"],
          [image("/wut.png"), "NOISEY TONIHGT"],
          () => null,
          [image("/wut.png"), "HAVE YOU BEN ROBED"],
          () => null,
          [cyclops.image, "I'VE BEEN ASSULTED"],
          () => null,
          [image("/wut.png"), "SO WHO DID IT"],
          [cyclops.image, "NOBODY!!!"],
          [image("/wut.png"), "YOUR MAKING NO"],
          [image("/wut.png"), "SENCE GO BACK TO"],
          [image("/wut.png"), "BED"],
          () => null,
          [cyclops.image, "ARGH BEING THE"],
          [cyclops.image, "SMARTEST CYCLOPS IS"],
          [cyclops.image, "A REAL BURDEN"],
          [cyclops.image, "LET ME TELL YOU"],
          unblock
        ]))
      }
      , x: 92
      , y: 30
      , width: 4
      , height: 4
      , color: "#000000"
    },
    cyclops
  ]
  , [
    {
      type: "door"
      , to: {
        room: () => 4
        , x: () => 0
        , y: () => player.y
        , action: () => sequence([
          block,
          [cyclops.image, "I BLOCKED THE EXIT"],
          [cyclops.image, "HAVE FUN WITH THAT"],
          unblock,
          () => null,
          () => null,
          () => null,
          () => null,
          [image("/blank.png"), "(Obtain the very)"],
          [image("/blank.png"), "(inaccurately)"],
          [image("/blank.png"), "(represented sheep to)"],
          [image("/blank.png"), "(the right.)"]
        ])
      }
      , x: 92
      , y: 30
      , width: 4
      , height: 4
      , color: "#000000"
    }
  ]
  , [
    {
      type: "door"
      , to: {
        room: () => 5
        , x: () => 0
        , y: () => player.y
        , action: () => sequence([
          block,
          [image("/blank.png"), "(hide under)"],
          [image("/blank.png"), "(the sheep square)"],
          [image("/blank.png"), "(note: there is no)"],
          [image("/blank.png"), "(consequence for not)"],
          [image("/blank.png"), "(hiding under the)"],
          [image("/blank.png"), "(sheep square.)"],
          () => mainStack.push((n => () => (ctx.fillStyle = "#FFF", ctx.fillRect(Math.round(n / 10), 12, 16, 16), n++))(-320)),
          () => null,
          () => null,
          () => null,
          unblock
        ])
      }
      , x: 92
      , y: 30
      , width: 4
      , height: 4
      , color: "#FFFFFF"
    }
  ]
  , [
    {
      type: "door"
      , to: {
        room: () => 6
        , x: () => 0
        , y: () => player.y
        , action: () => sequence([
          block,
          [player.image, "It appears that you"],
          [player.image, "have misunderestimated"],
          [player.image, "me :)"],
          [cyclops.image, "RAWR I HATE YOU"],
          () => mainStack.push((n => () => (ctx.fillStyle = "#222", ctx.fillRect(0, n, 96, 64), n++))(-64)),
          () => null,
          [image("/blank.png"), "(we should probably)"],
          [image("/blank.png"), "(skedaddle.)"],
          () => null,
          [player.image, "Nah."],
          [player.image, "I think I'll have..."],
          [player.image, "...a gloat."],
          [player.image, "YO POLYPHEMUS YOU JUST"],
          [player.image, "GOT 360 NOSCOPED"],
          [cyclops.image, "RAWR I HATE YOU"],
          [cyclops.image, "THE PROPHECY IS COMING"],
          [cyclops.image, "TRUE"],
          [cyclops.image, "NO, NO, NO..."],
          [player.image, "To be continued?"],
          [cyclops.image, "THE END"],
          [image("/wut.png"), "TEH END"],
          [image("/blank.png"), "(the (parenthetical))"],
          [image("/blank.png"), "(end.)"],
          [player.image, "To be continued?"],
          [cyclops.image, "I HOPE SO, I WANT"],
          [cyclops.image, "...REVENGE"],
          () => null,
          () => null,
          [cyclops.image, "RAWR"],
          [image("/wut.png"), "OK WERE DON TAWKING"],
          [cyclops.image, "IT'S SPELLED \"TALKING\""],
          () => null,
          [cyclops.image, "UGH"],
          unblock
        ])
      }
      , x: 92
      , y: 30
      , width: 4
      , height: 4
      , color: "#000000"
    }
  ]
]

var colliding = (a, b) =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y

mainStack.push(() => {
  for (var item in rooms[room]) {
    item = rooms[room][item]
    with (item) {
      if (item && type == "door") {
        ctx.fillStyle = color
        ctx.fillRect(x, y, width, height)
        if (colliding(player, item) && !blocking) {
          room = to.room()
          player.x = to.x()
          player.y = to.y()
          to.action()
        }
      } else if (item && type == "tile") {
        ctx.drawImage(tile || image, x, y)
      }
    }
  }
})

var block = () => blocking = true
var unblock = () => blocking = false
var blocking = false

var dialogue = (img, txt) => (textCtx.clearRect(0, 0, 96, 64), textCtx.drawImage(img, 1, 55), timedWrite(txt, 10, 56, 40))

var sequence = a => a.forEach((t, n) => setTimeout(t.constructor == Function? t : t ? () => dialogue(t[0], t[1]) : () => null, n * 1500))
