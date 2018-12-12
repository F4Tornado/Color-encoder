importScripts("https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.js");
onmessage = (song) => {
  console.log("Ehhhhhh!")
  postMessage(song.getPeaks(width * 64));
}