window.onload = function(){
  console.log('Github Project found at https://github.com/CalebBlack/Colorspill');
  var canvas = document.getElementById('game');
  if (canvas) {
    setupGame(canvas);
  }
}
var renderCanvas = document.createElement('canvas');
renderCanvas.setAttribute('width',1000);
renderCanvas.setAttribute('height',1000);
var renderContext = renderCanvas.getContext('2d');
var context;
var width;
var height;
var imageData;
var gameData = {};
var mouseX, mouseY;
var frameNumber = 0;
var canvas;
var clickToggled = false;
function setupGame(canvasIn){
  canvas = canvasIn;
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click',()=>{frameNumber = 0;clickToggled = !clickToggled});
  canvas.imageSmoothingEnabled = false;
  imageData = renderContext.createImageData(canvas.width,canvas.height);
  width = canvas.width;
  height = canvas.height;
  context = canvas.getContext('2d');
  context.fillStyle = "black";
  setInterval(drawGame,50);
}
function drawGame(){
  frameNumber++;
  var pixels = new Uint8Array(width*height*4);
  // LOOP BODY

  context.fillRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < pixels.length; i+=4) {
    var percent = i / pixels.length;
    var x = i % 4000;
    var y = Math.floor(i/4000);
    var mouseDist = (Math.abs(mouseX - x) + Math.abs(mouseY - y)) / Math.sqrt(20000);
    pixels[i] = percent * (Math.random() * 155 + 100) *- (x>y ? 100 : 0);
    pixels[i+1] = (1-percent) * Math.random() * 255;
    pixels[i+2] = Math.random() * 255 * mouseDist * percent % y;
    pixels[i+3] = Math.max(255 * mouseDist / frameNumber * (x % (mouseY % mouseX)),Math.random()*100);
  }
  if (clickToggled){
    for (var i = 3; i < pixels.length; i+=8) {
      var before = [pixels[i-4],pixels[i-3],pixels[i-2],pixels[i-1]];
      var now = [pixels[i],pixels[i+1],pixels[i+2],pixels[i+3]];
      pixels[i] = before[3];
      pixels[i+1] = before[2];
      pixels[i+2] = before[1];
      pixels[i+3] = before[0];
      pixels[i-4] = now[0];
      pixels[i-3] = now[1];
      pixels[i-2] = now[2];
      pixels[i-1] = now[3];
    }
  }
  // END OF LOOP BODY
  imageData.data.set(pixels);
  renderContext.putImageData(imageData, 0, 0);
  context.drawImage(renderCanvas,0,0,width,height);
}
function onMouseMove(event){
        mouseX = Math.round(event.offsetX / event.target.clientWidth * 1000);
        mouseY = Math.round(event.offsetY / event.target.clientHeight * 1000);
}
