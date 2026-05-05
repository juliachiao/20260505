let capture;
let faceMesh;
let faces = [];

// 點位編號
let lipOuter = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
let lipInner = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
let leftEyeOuter = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112];
let leftEyeInner = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
let rightEyeOuter = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
let rightEyeInner = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

function preload() {
  // 核心修正：開啟 flipped: true，讓 ml5 直接幫我們處理好鏡像點位
  faceMesh = ml5.faceMesh({ flipped: true });
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 建立攝影機並設定為手機比例 (自動適應)
  capture = createCapture(VIDEO);
  capture.size(width, height); // 讓攝影機原始尺寸就等於畫布尺寸
  capture.hide();

  // 開始偵測
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 背景色 #e7c6ff
  background('#e7c6ff');
  
  // 個人資訊文字
  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 20);

  // 計算 60% 影像尺寸
  let imgW = width * 0.6;
  let imgH = height * 0.6;

  // 1. 繪製攝影機影像 (置中且鏡像)
  push();
  translate(width / 2, height / 2);
  scale(-1, 1); 
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    // 這裡繪製影像
    image(capture, 0, 0, imgW, imgH);
  }
  pop();

  // 2. 繪製臉部特徵 (關鍵：直接映射到 60% 區域)
  if (faces.length > 0) {
    let face = faces[0];
    noFill();
    stroke(255, 0, 0); 
    strokeWeight(10);
    strokeJoin(ROUND);

    drawFeature(face, lipOuter, imgW, imgH);
    drawFeature(face, lipInner, imgW, imgH);
    drawFeature(face, leftEyeOuter, imgW, imgH);
    drawFeature(face, leftEyeInner, imgW, imgH);
    drawFeature(face, rightEyeOuter, imgW, imgH);
    drawFeature(face, rightEyeInner, imgW, imgH);
  }
}

function drawFeature(faceData, indices, imgW, imgH) {
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    let keypoint = faceData.keypoints[index];
    if (keypoint) {
      // 因為 capture 已經縮放至全螢幕偵測，我們只需要將點位
      // 從全螢幕空間「縮小」到畫布中央那 60% 的區塊即可
      let x = map(keypoint.x, 0, width, (width - imgW) / 2, (width - imgW) / 2 + imgW);
      let y = map(keypoint.y, 0, height, (height - imgH) / 2, (height - imgH) / 2 + imgH);
      vertex(x, y);
    }
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}