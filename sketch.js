document.addEventListener('contextmenu', event => event.preventDefault());
const encoded = [];
const layers = [[{
  r: 0,
  b: 0,
  g: 0,
  t: 0
}]];
let selectedLayer = 0;
let songIn, song, fft, inColor, howTo, z1, z2, testing, addLayer;

function setup() {
  songIn = createFileInput(load).position(16, 16).style("color", "#ebebeb").style("z-index", 1000);
  z1 = 0;
  z2 = 1;
  createCanvas(windowWidth, windowHeight).position(0, 0).parent("#container").style("z-index", 0);
  angleMode(DEGREES);
  rectMode(CENTER);
}

function draw() {
  if (!testing) {
    background(51)
  }
  if (song) {
    if (!testing) {
      stroke(235);
      strokeWeight(2)
      line(0, height * 3 / 4, width, height * 3 / 4);
      strokeWeight(1);
      if (fft) {
        stroke(51, 128, 235);
        let use = fft.slice(floor(fft.length * z1), floor(fft.length * z2) + 1);

        for (let i = 0; i < use.length; i++) {
          line(i / (use.length / width), height, i / (use.length / width), map(abs(use[i]), 0, 1, height, height * 3 / 4));
        }
        stroke(235)
      }
      for (let frame of layers[selectedLayer]) {
        strokeWeight(2)
        fill(frame.r, frame.g, frame.b);
        line(map(frame.t, song.duration() * z1 * 1000, song.duration() * z2 * 1000, 0, width), height, map(frame.t, song.duration() * z1 * 1000, song.duration() * z2 * 1000, 0, width), height * 3 / 4)
        rect(map(frame.t, song.duration() * z1 * 1000, song.duration() * z2 * 1000, 0, width), height * 3 / 4, width / 64, width / 64);
      }
    }
    line(map(z1, 0, 1, 0, width), height * 3 / 4 * 7 / 8, map(z1, 0, 1, 0, width), height * 3 / 4 * 13 / 16)
    line(map(z2, 0, 1, 0, width), height * 3 / 4 * 7 / 8, map(z2, 0, 1, 0, width), height * 3 / 4 * 13 / 16)
    let clicky1;
    let clicky2;
    if (collidePointLine(mouseX, mouseY, map(z1, 0, 1, 0, width), height * 3 / 4 * 7 / 8, map(z1, 0, 1, 0, width), height * 3 / 4 * 13 / 16, 4) && mouseIsPressed && !clicky2) {
      clicky1 = setInterval(() => {
        if (mouseIsPressed) {
          z1 = map(mouseX, 0, width, 0, 1);
          if (z1 > z2 - 0.01) {
            z1 = z2 - 0.01
          }
          if (z1 < 0) {
            z1 = 0;
          }
        } else {
          clearInterval(clicky1)
          clicky1 = undefined
        }
      })
    }
    if (collidePointLine(mouseX, mouseY, map(z2, 0, 1, 0, width), height * 3 / 4 * 7 / 8, map(z2, 0, 1, 0, width), height * 3 / 4 * 13 / 16, 4) && mouseIsPressed && !clicky1) {
      clicky2 = setInterval(() => {
        if (mouseIsPressed) {
          z2 = map(mouseX, 0, width, 0, 1);
          if (z2 < z1 + 0.01) {
            z2 = z1 + 0.01
          }
          if (z2 > 1) {
            z2 = 1;
          }
        } else {
          clearInterval(clicky2)
          clicky2 = undefined
        }
      })
    }
  }
}

function load(file) {
  song = loadSound(file, () => {
    removeElements();
    inColor = createInput("", "color").position(16, 16).id("color-picker");
    addLayer = createButton("Add a layer").position(90, 16).mousePressed(() => {
      layers.push([{r:0, g:0, b:0, t:0}]);
    })
    nextLayer = createButton("Next layer").position(184, 16).mousePressed(() => {
      selectedLayer++;
      selectedLayer = selectedLayer%layers.length;
    })
    test = createButton("Test").position(272, 16).mousePressed(test);
    howTo = createButton("How To Use").position(336, 16).mousePressed(() => {
      window.open("https://github.com/F4Tornado/color-encoder#how-to-use")
    })
    copy = createButton("Copy code").position(430, 16).mousePressed(() => {
      generate()
      let text = createElement("textarea")
      text.value(encoded.toString());
      text.elt.select()
      document.execCommand("copy")
      text.remove()
    })
    fft = song.getPeaks(width * 64);
  });
}

function mousePressed() {
  if (mouseY > height * 3 / 4 && mouseButton == LEFT) {
    c = hexToRGB(inColor.value());
    layers[selectedLayer].push({
      r: c[0],
      g: c[1],
      b: c[2],
      t: floor((mouseX / width) * song.duration() * 1000 * (z2 - z1) + z1 * song.duration())
    })
    console.log(layers[selectedLayer])
  } else if (mouseButton == RIGHT) {
    for (var i = layers[selectedLayer].length - 1; i >= 0; i--) {
      if (collidePointRect(mouseX, mouseY, map(layers[selectedLayer][i].t, song.duration() * z1 * 1000, song.duration() * z2 * 1000, 0, width) - width / 128, height * 3 / 4 - width / 128, width / 64, width / 64)) {
        layers[selectedLayer].splice(i, 1);
      }
    }
  }
}

const generate = () => {
  encoded.splice(0, encoded.length);
  for (let i = 0; i < layers.length; i++) {
    layers[i].sort((a, b) => {
      return a.t-b.t
    })
  }
  const encodeds = [];
  for (let i = 0; i < layers.length; i++) {
    let thingoo = [];
    for (let j = 0; j < layers[i].length; j++) {
      let r = layers[i][j].r;
      let g = layers[i][j].g;
      let b = layers[i][j].b;
      let w = 255;
      if (w > r) {
        w = r;
      }
      if (w > g) {
        w = g;
      }
      if (w > b) {
        w = b;
      }
      thingoo.push(r-w);
      thingoo.push(g-w);
      thingoo.push(b-w);
      thingoo.push(w);
      thingoo.push(layers[i][j].t);
    }
    encodeds.push(thingoo);
  }
  const merged = merge(encodeds);
  console.log(merged)
}

function test() {
  testing = true;
  song.play()
  generate()

  function run(step) {
    console.log(encoded.length / 5)
    let r = encoded[step * 5];
    let g = encoded[step * 5 + 1];
    let b = encoded[step * 5 + 2];
    let w = encoded[step * 5 + 3];
    r += w;
    g += w;
    b += w;
    let t = encoded[step * 5 + 4];
    background(r, g, b)
    if (step < encoded.length / 5) {
      setTimeout(run, t, step + 1)
    } else {
      testing = false;
    }
  }
  run(0)
}

function hexToRGB(hex) {
  let c = color(hex);
  console.log(c);
  return [c.levels[0], c.levels[1], c.levels[2]]
}

function merge(thingoo) {
  let merged = [];
  for (let i = 0; i < thingoo.length; i++) {
    merged = merged.concat(thingoo[i]);
  }
  const testy = []
  for (let i = 0; i < merged.length/5; i++) {
    let thingy = [];
    let r = merged[i*5];
    let g = merged[i*5+1];
    let b = merged[i*5+2];
    let w = merged[i*5+3];
    let t = merged[i*5+4];
    let l;
    if (i == merged.length/5-1) {
      l = song.duration()*1000-t;
    } else {
      l = merged[(i+1)*5+4]-t;
    }
    thingy.push(r);
    thingy.push(g);
    thingy.push(b);
    thingy.push(w);
    thingy.push(t);
    thingy.push(l);
    testy.push(thingy);
  }
  testy.sort((a, b) => {
    return a.t-b.t;
  });
  let ret = [];
  for (let i = 0; i < testy.length; i++) {
    ret = ret.concat(testy[i])
  }
  return ret;
}
