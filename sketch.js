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
  // 初始化 FaceMesh，這裡暫時不設定 flipped: true，我們在 draw 裡面手動處理
  faceMesh = ml5.faceMesh();
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
  
  // 1. 顯示個人資訊
  push();
  fill(0);
  textSize(24);
  textAlign(CENTER);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 50);
  pop();

  // 2. 計算 60% 影像尺寸
  let imgW = width * 0.6;
  let imgH = height * 0.6;

  // 3. 繪製區塊
  push();
  translate(width / 2, height / 2); // 移到畫布中心
  
  // 先畫攝影機影像 (置中且鏡像)
  push();
  scale(-1, 1); 
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    image(capture, 0, 0, imgW, imgH);
  }
  pop();

  // 4. 繪製臉部特徵 (關鍵修正：座標映射)
  if (faces.length > 0) {
    let face = faces[0];
    noFill();
    stroke(255, 0, 0); 
    strokeWeight(10);
    strokeJoin(ROUND);

    // 同步繪製所有特徵
    drawFeature(face, lipOuter, imgW, imgH);
    drawFeature(face, lipInner, imgW, imgH);
    drawFeature(face, leftEyeOuter, imgW, imgH);
    drawFeature(face, leftEyeInner, imgW, imgH);
    drawFeature(face, rightEyeOuter, imgW, imgH);
    drawFeature(face, rightEyeInner, imgW, imgH);
  }
  pop();
}

function drawFeature(faceData, indices, imgW, imgH) {
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    let keypoint = faceData.keypoints[index];
    if (keypoint) {
      // 關鍵修正：
      // 因為外面影像用了 scale(-1, 1)，座標映射時 X 軸要反向映射，線條才會對準翻轉後的臉
      // 映射範圍從 (0, capture.width) 對應到 (imgW/2, -imgW/2)
      let x = map(keypoint.x, 0, capture.width, imgW / 2, -imgW / 2);
      let y = map(keypoint.y, 0, capture.height, -imgH / 2, imgH / 2);
      vertex(x, y);
    }
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}