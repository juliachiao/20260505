let capture;
let faceMesh;
let faces = [];

function preload() {
  // 初始化 FaceMesh 並設定水平翻轉 (flipped: true)，讓偵測點位與鏡像影像同步
  faceMesh = ml5.faceMesh({ flipped: true });
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 建立攝影機並設定內部辨識解析度
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
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 顯示個人資訊文字
  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 20);

  // 計算影像顯示尺寸 (畫布寬高的 60%)
  let imgW = width * 0.6;
  let imgH = height * 0.6;

  // 1. 繪製攝影機影像 (置中且鏡像)
  push();
  translate(width / 2, height / 2);
  scale(-1, 1); // 修正左右顛倒
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    image(capture, 0, 0, imgW, imgH);
  }
  pop();

  // 2. 繪製全臉臉部特徵線條
  if (faces.length > 0) {
    let face = faces[0];
    
    // 設定線條樣式：黃色、粗度 10
    noFill();
    stroke(255, 255, 0); // 黃色線條
    strokeWeight(10);    // 粗細 10
    strokeJoin(ROUND);

    // 繪製整張臉的所有網格線條
    // 使用 ml5.js 的臉部網格點位進行連線
    drawFaceMesh(face, imgW, imgH);
  }
}

function drawFaceMesh(faceData, imgW, imgH) {
  // 計算影像在畫布上的左上角起始點，用於座標映射
  let offsetX = (width - imgW) / 2;
  let offsetY = (height - imgH) / 2;

  // ml5.faceMesh 的 faceData.keypoints 包含 468 個點位
  // 我們利用預設的連線索引來畫出整張臉的輪廓
  for (let i = 0; i < faceData.keypoints.length; i++) {
    let keypoint = faceData.keypoints[i];
    
    // 將偵測到的原始座標映射到 60% 影像所在的區域內
    let x = map(keypoint.x, 0, capture.width, offsetX, offsetX + imgW);
    let y = map(keypoint.y, 0, capture.height, offsetY, offsetY + imgH);
    
    // 這裡我們用一個小點來表示點位，或使用指定的連線邏輯
    point(x, y);
    
    // 如果要畫出「整個臉的線條網格」，可以使用內建的三角形連線索引
    // 但為了效能與清晰度，我們畫出關鍵部位的輪廓
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}