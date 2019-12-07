'use strict';

(function() {

  var canvas = document.getElementById('letter-canvas');
  var colors = document.getElementsByClassName('color');
  var context = canvas.getContext('2d');

  var defaultColor = 'black';
  var defaultSize = 4;
  var eraserSize = 150;

  var current = {
    color: defaultColor,
    size: defaultSize
  };
  var drawing = false;
  var verticalOffset = 64;

  canvas.addEventListener('mousedown', onMouseDown, false);
  canvas.addEventListener('mouseup', onMouseUp, false);
  canvas.addEventListener('mouseout', onMouseUp, false);
  canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
  
  //Touch support for mobile devices
  canvas.addEventListener('touchstart', onMouseDown, false);
  canvas.addEventListener('touchend', onMouseUp, false);
  canvas.addEventListener('touchcancel', onMouseUp, false);
  canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

  for (var i = 0; i < colors.length; i++){
    colors[i].addEventListener('click', onColorUpdate, false);
  }

  window.addEventListener('resize', onResize, false);
  onResize();

  function drawLine(x0, y0, x1, y1, color, size){
    context.beginPath();
    context.moveTo(x0, y0 - verticalOffset);
    context.lineTo(x1, y1 - verticalOffset);
    context.strokeStyle = color;
    context.lineWidth = size;
    context.stroke();
    context.closePath();

    var w = canvas.width;
    var h = canvas.height;
  }

  function onMouseDown(e){
    drawing = true;
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, current.size);
  }

  function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX||e.touches[0].clientX, e.clientY||e.touches[0].clientY, current.color, current.size);
    current.x = e.clientX||e.touches[0].clientX;
    current.y = e.clientY||e.touches[0].clientY;
  }

  function onColorUpdate(e){
    current.color = e.target.className.split(' ')[1];
    if (current.color == 'white')
    {
      current.size = eraserSize;
    }
    else
    {
      current.size = defaultSize;
    }
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

})();