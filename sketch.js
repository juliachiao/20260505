let capture;
let faceMesh;
let faces = [];

// --- 點位編號設定 ---
let lipOuter = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
let lipInner = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];
let leftEyeOuter = [243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112];
let leftEyeInner = [133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155];
let rightEyeOuter = [359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255];
let rightEyeInner = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

function preload() {
  // 核心修正 1：在這裡就設定 flipped: true，讓偵測點位直接與鏡像後的影像同步
  faceMesh = ml5.faceMesh({ flipped: true });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff');
  
  // 顯示個人資訊
  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 20);

  // 計算 60% 影像尺寸
  let imgW = width * 0.6;
  let imgH = height * 0.6;
  
  // 計算影像在畫布上的左上角起始點 (用於座標補償)
  let offsetX = (width - imgW) / 2;
  let offsetY = (height - imgH) / 2;

  // 1. 繪製攝影機影像 (置中且鏡像)
  push();
  translate(width / 2, height / 2);
  scale(-1, 1); // 水平翻轉
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    image(capture, 0, 0, imgW, imgH);
  }
  pop();

  // 2. 繪製臉部特徵
  if (faces.length > 0) {
    let face = faces[0];
    noFill();
    stroke(255, 0, 0); 
    strokeWeight(10);
    strokeJoin(ROUND);

    // 繪製所有部位
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
      // 核心修正 2：
      // 因為 preload 已經設定 flipped: true，所以偵測到的 x 已經是鏡像後的。
      // 我們直接將偵測點映射到畫布上影像所在的實際區域即可。
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