let capture;

function setup() {
  // 1. 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 擷取攝影機影像
  capture = createCapture(VIDEO);
  
  // 3. 隱藏預設的 HTML 影片元素
  capture.hide();
}

function draw() {
  // 4. 設定畫布背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 5. 繪製文字 (顯示在影像上方，畫布的背景上)
  // ----------------------------------------------------
  fill(0);                // 設定文字顏色為黑色 (可依喜好修改)
  textSize(24);           // 設定文字大小
  textAlign(CENTER);      // 設定文字左右置中
  textStyle(BOLD);        // 設定文字加粗 (選用)
  
  // 繪製字串：內容為科系與學號
  // 座標：x = width/2 (畫布寬度一半), y = 40 (距離頂部 40 像素)
  text("科系:教育科技學系  學號: 413737015", width / 2, 40);
  // ----------------------------------------------------

  // 6. 計算影像要顯示的寬高 (整個畫布寬高的 60%)
  let imgW = width * 0.6;
  let imgH = height * 0.6;
  
  // 7. 座標系統轉換 - 修正左右顛倒並置中
  push();
  
  // 將繪製起點平移到畫布正中間
  translate(width / 2, height / 2);
  
  // 修正左右顛倒 (鏡像翻轉)
  scale(-1, 1);
  
  // 在新的中心點繪製影像 (座標需補償寬高的一半)
  if (capture && capture.loadedmetadata) {
    image(capture, -imgW / 2, -imgH / 2, imgW, imgH);
  }
  
  pop();
}

// 8. 當瀏覽器視窗大小改變時，動態調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 7. 當瀏覽器視窗大小改變時，動態調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}