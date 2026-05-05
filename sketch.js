let capture;
let faceMesh;
let faces = [];
let stars = []; // 用於儲存星空座標

// --- 點位編號設定 ---
let lipOuter = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
let lipInner = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
let leftEyeOuter = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112];
let leftEyeInner = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
let rightEyeOuter = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
let rightEyeInner = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

function preload() {
  faceMesh = ml5.faceMesh({ flipped: true });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  faceMesh.detectStart(capture, gotFaces);

  // 初始化星空背景
  for (let i = 0; i < 200; i++) {
    stars.push({ x: random(width), y: random(height), size: random(1, 3) });
  }
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 1. 繪製星空背景
  background(10, 10, 30); // 深藍色夜空背景
  noStroke();
  fill(255);
  for (let s of stars) {
    ellipse(s.x, s.y, s.size);
  }

  // 2. 顯示個人資訊 (白色文字以契合星空)
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 20);

  let imgW = width * 0.6;
  let imgH = height * 0.6;
  let offsetX = (width - imgW) / 2;
  let offsetY = (height - imgH) / 2;

  // 3. 繪製攝影機影像 (置中且鏡像)
  push();
  translate(width / 2, height / 2);
  scale(-1, 1);
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    image(capture, 0, 0, imgW, imgH);
  }
  pop();

  // 4. 繪製臉部辨識線條
  if (faces.length > 0) {
    let face = faces[0];

    // --- A. 先畫全臉黃色網格 (細線) ---
    stroke(255, 255, 0); 
    strokeWeight(1); // 網格用細一點比較精緻
    for (let i = 0; i < face.keypoints.length; i++) {
      let kp = face.keypoints[i];
      let x = map(kp.x, 0, capture.width, offsetX, offsetX + imgW);
      let y = map(kp.y, 0, capture.height, offsetY, offsetY + imgH);
      point(x, y); // 畫出黃色網格點
    }

    // --- B. 繪製紅色重點部位 (粗線 10) ---
    stroke(255, 0, 0); 
    strokeWeight(10);
    strokeJoin(ROUND);
    noFill();

    drawFeature(face, lipOuter, offsetX, offsetY, imgW, imgH);
    drawFeature(face, lipInner, offsetX, offsetY, imgW, imgH);
    drawFeature(face, leftEyeOuter, offsetX, offsetY, imgW, imgH);
    drawFeature(face, leftEyeInner, offsetX, offsetY, imgW, imgH);
    drawFeature(face, rightEyeOuter, offsetX, offsetY, imgW, imgH);
    drawFeature(face, rightEyeInner, offsetX, offsetY, imgW, imgH);
  }
}

function drawFeature(faceData, indices, offsetX, offsetY, imgW, imgH) {
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    let keypoint = faceData.keypoints[index];
    if (keypoint) {
      let x = map(keypoint.x, 0, capture.width, offsetX, offsetX + imgW);
      let y = map(keypoint.y, 0, capture.height, offsetY, offsetY + imgH);
      vertex(x, y);
    }
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}