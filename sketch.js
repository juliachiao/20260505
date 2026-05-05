let capture;
let faceMesh;
let faces = [];

// 你提供的嘴唇點位編號
let outerLip = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
let innerLip = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

function preload() {
  // 初始化 FaceMesh，並設定水平翻轉 (flipped: true) 以符合鏡像習慣
  faceMesh = ml5.faceMesh({ flipped: true });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 建立攝影機畫面
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  // 開始臉部偵測
  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff'); // 指定背景色
  
  // 顯示個人資訊文字
  fill(0);
  textSize(24);
  textAlign(CENTER);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 50);

  // 設定顯示影像的寬高 (60%)
  let imgW = width * 0.6;
  let imgH = height * 0.6;

  push();
  translate(width / 2, height / 2); // 移動到畫布中心
  
  // 1. 繪製攝影機影像 (置中且鏡像)
  push();
  scale(-1, 1);
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    image(capture, 0, 0, imgW, imgH);
  }
  pop();

  // 2. 繪製嘴唇連線 (紅色粗線，粗度 10)
  if (faces.length > 0) {
    let face = faces[0];
    noFill();
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(10);  // 粗細 10
    strokeJoin(ROUND);

    // 繪製外唇
    drawLip(face, outerLip, imgW, imgH);
    // 繪製內唇
    drawLip(face, innerLip, imgW, imgH);
  }
  pop();
}

// 輔助函式：用來繪製指定的點位線條
function drawLip(faceData, indices, imgW, imgH) {
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    let index = indices[i];
    let keypoint = faceData.keypoints[index];
    if (keypoint) {
      // 將攝影機座標映射到 60% 影像大小的區域
      let x = map(keypoint.x, 0, capture.width, -imgW / 2, imgW / 2);
      let y = map(keypoint.y, 0, capture.height, -imgH / 2, imgH / 2);
      vertex(x, y);
    }
  }
  endShape(CLOSE); // 使用 CLOSE 讓最後一個點連回第一個點，形成完整的圓框
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}