let capture;

function setup() {
  // 1. 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 2. 擷取攝影機影像
  capture = createCapture(VIDEO);
  
  // 3. 隱藏預設產生的 HTML 影片元素，避免重複顯示在畫布下方
  capture.hide();
  
  // 4. 將影像繪製模式設定為中心點，方便後續在畫布正中間對齊
  imageMode(CENTER);
}

function draw() {
  // 5. 設定畫布背景顏色為 e7c6ff (粉紫色)
  background('#e7c6ff');
  
  // 6. 計算影像寬高，設定為整個畫布寬高的 60%
  let imgW = width * 0.6;
  let imgH = height * 0.6;
  
  // 7. 在畫布正中間 (width/2, height/2) 繪製攝影機影像
  // 即使你現在沒攝影機看到的是空白，這段程式在老師電腦上會正常運作
  if (capture) {
    image(capture, width / 2, height / 2, imgW, imgH);
  }
}

// 8. 當瀏覽器視窗大小改變時，動態調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}