let capture;
let faceMesh;
let faces = [];
// 老師要求的指定點位編號
let targetIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function preload() {
  // 載入 FaceMesh 模型
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
  
  // 顯示個人資訊
  fill(0);
  textSize(24);
  textAlign(CENTER);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 50);

  let imgW = width * 0.6;
  let imgH = height * 0.6;

  push();
  translate(width / 2, height / 2);
  
  // 影像鏡像處理並繪製在中間
  push();
  scale(-1, 1);
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    image(capture, 0, 0, imgW, imgH);
  }
  pop();

  // 繪製紅色臉部連線，粗度 10
  if (faces.length > 0) {
    let face = faces[0];
    noFill();
    stroke(255, 0, 0); 
    strokeWeight(10);
    strokeJoin(ROUND);

    beginShape();
    for (let i = 0; i < targetIndices.length; i++) {
      let index = targetIndices[i];
      let keypoint = face.keypoints[index];
      if (keypoint) {
        // 將攝影機座標映射到 60% 的影像畫布區域
        let x = map(keypoint.x, 0, capture.width, -imgW / 2, imgW / 2);
        let y = map(keypoint.y, 0, capture.height, -imgH / 2, imgH / 2);
        vertex(x, y);
      }
    }
    endShape();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}