let capture;

function setup() {
  // 1. 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 擷取攝影機影像
  capture = createCapture(VIDEO);
  
  // 3. 隱藏預設產生的 HTML 影片元素
  capture.hide();
}

function draw() {
  // 4. 設定畫布背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 5. 在背景上顯示個人資訊文字 (左右置中)
  fill(0);                // 文字顏色 (黑色)
  textSize(24);           // 文字大小
  textAlign(CENTER);      // 左右置中
  textStyle(BOLD);        // 文字加粗
  
  // 繪製字串，y 座標設定在 50，讓它距離頂部有一點點空間
  text("科系:教育科技學系  學號: 413737015  姓名: 季子蕎", width / 2, 50);

  // 6. 計算影像顯示寬高 (畫布寬高的 60%)
  let imgW = width * 0.6;
  let imgH = height * 0.6;
  
  // 7. 處理影像置中與鏡像翻轉 (修正左右顛倒)
  push();
  
  // 移動座標原點到畫布中心
  translate(width / 2, height / 2);
  
  // 水平翻轉影像 (修正左右顛倒)
  scale(-1, 1);
  
  // 繪製攝影機影像 (座標需補償寬高的一半以達成中心對齊)
  if (capture && capture.loadedmetadata) {
    image(capture, -imgW / 2, -imgH / 2, imgW, imgH);
  }
  
  pop();
}

// 8. 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// 8. 當瀏覽器視窗大小改變時，動態調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 7. 當瀏覽器視窗大小改變時，動態調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}