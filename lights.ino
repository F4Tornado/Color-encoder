int w = 10;
int r = 12;
int g = 13;
int b = 11; 
int brightness = 12;
//r, g, b, w, time
int seq[] = {};
int step = 0;

void setup() {
  pinMode(w, OUTPUT);
  pinMode(r, OUTPUT);
  pinMode(g, OUTPUT);
  pinMode(b, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  writeColor(255, 0, 0, 0);
  delay(250);
  writeColor(0, 255, 0, 0);
  delay(250);
  writeColor(0, 0, 255, 0);
  delay(250);
  writeColor(0, 0, 0, 255);
  delay(250);
  writeColor(0, 0, 0, 0);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(250);
  digitalWrite(LED_BUILTIN, LOW);
  delay(750);
  digitalWrite(LED_BUILTIN, HIGH);
  delay(250);
  digitalWrite(LED_BUILTIN, LOW);
  delay(750);
  digitalWrite(LED_BUILTIN, HIGH);
}

void loop() {
  if (step < (sizeof(seq) / sizeof(int))/5.0) {
    writeColor(seq[0+(step*5)], seq[1+(step*5)], seq[2+(step*5)], seq[3+(step*5)]);
    delay((int)seq[4+(step*5)]);
    step = step + 1;
  } else {
    writeColor(0, 0, 0, 255);  
  }
}

void writeColor(int ri, int gi, int bi, int wi) {
  analogWrite(r, (int)ri*(brightness/100.0));
  analogWrite(g, (int)gi*(brightness/400.0));
  analogWrite(b, (int)bi*(brightness/400.0));
  analogWrite(w, (int)wi*(brightness/100.0));
}
