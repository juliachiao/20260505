let capture;
let faceMesh;
let faces = [];
let targetIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function preload() {
  // 初始化 FaceMesh，手機建議開啟 flipped: true 符合鏡像習慣
  faceMesh = ml5.faceMesh({ flipped: true });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 針對手機相機的設定
  let constraints = {
    video: {
      facingMode: "user" // 使用前鏡頭
    },
    audio: false
  };
  
  capture = createCapture(constraints);
  capture.size(640, 480);
  capture.hide();

  faceMesh.detectStart(capture, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background('#e7c6ff');
  
  // 個人資訊文字
  fill(0);
  textSize(width * 0.04); // 根據螢幕寬度調整字體大小，適合手機
  textAlign(CENTER);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 50);

  let imgW = width * 0.6;
  let imgH = height * 0.6;

  push();
  translate(width / 2, height / 2);
  
  // 繪製相機畫面
  imageMode(CENTER);
  if (capture.loadedmetadata) {
    image(capture, 0, 0, imgW, imgH);
  }

  // 繪製 FaceMesh 紅線
  if (faces.length > 0) {
    let face = faces[0];
    noFill();
    stroke(255, 0, 0); 
    strokeWeight(8); // 手機端稍微細一點
    strokeJoin(ROUND);

    beginShape();
    for (let i = 0; i < targetIndices.length; i++) {
      let index = targetIndices[i];
      let keypoint = face.keypoints[index];
      if (keypoint) {
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