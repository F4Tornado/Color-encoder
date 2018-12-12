document.addEventListener('contextmenu', event => event.preventDefault());
const encoded = [];
let keyframes = [{
  r: 255,
  b: 255,
  g: 255,
  t: 0
}];
let songIn, song, fft, inColor, z1, z2, testing;

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
      for (let frame of keyframes) {
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
    test = createButton("Test").position(80, 16).mousePressed(test);
    fft = song.getPeaks(width * 64);
  });
}

function mousePressed() {
  if (mouseY > height * 3 / 4 && mouseButton == LEFT) {
    c = hexToRGB(inColor.value());
    keyframes.push({
      r: c[0],
      g: c[1],
      b: c[2],
      t: floor((mouseX / width) * song.duration() * 1000 * (z2 - z1) + z1 * song.duration())
    })
    console.log(keyframes)
  } else if (mouseButton == RIGHT) {
    for (var i = keyframes.length - 1; i >= 0; i--) {
      if (collidePointRect(mouseX, mouseY, map(keyframes[i].t, 0, song.duration() * 1000, 0, width) - width / 128, height * 3 / 4 - width / 128, width / 64, width / 64)) {
        keyframes.splice(i, 1);
      }
    }
  }
}

const generate = () => {
  encoded.splice(0, encoded.length);
  keyframes.sort((a, b) => {
    return a.t - b.t
  })
  for (let i = 0; i < keyframes.length; i++) {
    let r = keyframes[i].r;
    let g = keyframes[i].g;
    let b = keyframes[i].b;
    let w;
    w = r;
    if (g < w) {
      w = g;
    }
    if (b < w) {
      w = b;
    }
    encoded.push(r - w);
    encoded.push(g - w);
    encoded.push(b - w);
    encoded.push(w);
    if (keyframes[i + 1]) {
      encoded.push(keyframes[i + 1].t - keyframes[i].t)
    } else {
      encoded.push((song.duration() * 1000) - keyframes[i].t)
    }
    console.log(encoded)
  }
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