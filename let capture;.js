let capture;

function setup() {
  // 建立全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏 p5.js 預設產生的 HTML 影片元素，讓我們只在畫布內繪製影像
  capture.hide();
  
  // 將影像的繪製模式設定為中心點，方便對齊畫面正中間
  imageMode(CENTER);
}

function draw() {
  // 設定畫布背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 計算影像寬高，設定為整個畫布寬高的 60%
  let imgW = width * 0.6;
  let imgH = height * 0.6;
  
  // 在畫布正中間 (width/2, height/2) 繪製攝影機影像
  image(capture, width / 2, height / 2, imgW, imgH);
}

// 當瀏覽器視窗大小改變時，動態調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
