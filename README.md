# Color Encoder

## What it is

This is a website you can use to synchronize lights to music.

## How to use

1. Import a song
2. Choose a color in the color selector in the top left.
3. Click on the waveform to add that color to the sequence. You can drag the white lines above the waveform to zoom, they willl start on either side if the screen.
4. Click the test button to see your lights in action.
5. Export (GUI IN DEVELOPMENT) In the javascript console, type generate(), then type encoded.toString and copy the output, but not the quotation marks.
6. Go to the Arduino IDE and paste the contents of lights.ino into a new sketch.
7. Inside, set seq[] to what you copied form step five, but in braces {}.
8. Use [these instructions](https://www.makeuseof.com/tag/connect-led-light-strips-arduino/) to make the lights. Make sure you set white to pin 10, red to 12, green to 13, and blue to 11. Then upload the code to the arduino.
9. Press the reset button on the arduino, It will test all the colors then the internal light will count you down, when it gets to the third light, press the play button on an audio player.
