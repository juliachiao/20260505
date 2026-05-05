let capture;
let faceMesh;
let predictions = [];
// 老師要求的指定點位編號
let targetIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 1. 擷取攝影機影像
  capture = createCapture(VIDEO);
  capture.size(640, 480); // 設定內部辨識解析度
  capture.hide();

  // 2. 初始化 FaceMesh
  faceMesh = ml5.faceMesh(capture, modelReady);
  
  // 3. 持續追蹤臉部點位
  faceMesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("FaceMesh 模型已就緒！");
}

function draw() {
  background('#e7c6ff');
  
  // 4. 顯示個人資訊文字
  fill(0);
  textSize(24);
  textAlign(CENTER);
  textStyle(BOLD);
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 50);

  // 5. 計算影像顯示尺寸 (60%)
  let imgW = width * 0.6;
  let imgH = height * 0.6;

  // 6. 處理影像與 FaceMesh 繪製
  push();
  // 移動到中心點並處理鏡像翻轉
  translate(width / 2, height / 2);
  scale(-1, 1);
  
  // 繪製攝影機影像
  if (capture.loadedmetadata) {
    imageMode(CENTER);
    image(capture, 0, 0, imgW, imgH);
  }

  // 7. 繪製 FaceMesh 指定點位連線
  if (predictions.length > 0) {
    let face = predictions[0]; // 取得第一張臉
    
    noFill();
    stroke(255, 0, 0);      // 線條採用紅色
    strokeWeight(10);       // 線條粗細為 10
    strokeJoin(ROUND);      // 讓線條轉折處較平滑

    beginShape();
    for (let i = 0; i < targetIndices.length; i++) {
      let index = targetIndices[i];
      let keypoint = face.keypoints[index];

      // 關鍵：將原始影像座標轉換為畫布上的 60% 縮放座標
      // 因為原始 capture 是 640x480，需映射到 (-imgW/2 到 imgW/2) 區間
      let x = map(keypoint.x, 0, capture.width, -imgW / 2, imgW / 2);
      let y = map(keypoint.y, 0, capture.height, -imgH / 2, imgH / 2);
      
      vertex(x, y);
    }
    // 如果需要閉合線條可以加上 endShape(CLOSE)，老師需求目前是串接在一起
    endShape();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// 7. 當瀏覽器視窗大小改變時，動態調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}