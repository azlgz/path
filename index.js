const ptSize = 3;
const ptColor = "#f00";
const textColor = "#000";
const lineColor = "#000";
const drawTime = 400;

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("myCanvas");
const step = document.getElementById("step");
const width = window.innerWidth;
const height = window.innerHeight;
const dpr = window.devicePixelRatio;

canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

let pts = [];
let idx = 0;
let frames = [];
let box = { x: 0, y: 0, w: 0, h: 0 };
let scale = 1;
let offset = 200;
let needClose = false;
let numberDigit = 0;

function init(_pts, _needClose = true, _numberDigit = 0) {
  pts = [..._pts];
  idx = 0;

  needClose = _needClose;
  numberDigit = _numberDigit;
  if (needClose) {
    pts.push(pts[0]);
  }

  box = calcBox(pts);
  scale = Math.max(box.w / (width - offset * 2), box.h / (height - offset * 2));

  ctx.clearRect(0, 0, width, height);
}

function drawNone() {
  display(0);
}

function drawNext() {
  display(idx + 1);
}

function drawPrev() {
  display(idx - 1);
}

function drawAll() {
  display(pts.length - 1);
}

function display(index) {
  if (pts.length === 0) return;
  idx = Math.max(0, Math.min(index, pts.length - 1));
  drawFrame();
  refreshStep();
}

function drawFrame() {
  ctx.clearRect(0, 0, width, height);
  for (let index = 0; index < pts.length; index++) {
    const pt = pts[index];
    if (index <= idx) {
      if (index < pts.length - 1 || !needClose) {
        drawPoint(pt);
        drawText(pt);
      }

      if (index > 0) {
        const pt0 = pts[index - 1];
        drawLine(pt0, pt);
      }
    }
  }
}

function drawPoint(pt) {
  pt = localPt(pt);
  ctx.beginPath();
  ctx.arc(pt[0], pt[1], ptSize, 0, Math.PI * 2);
  ctx.fillStyle = ptColor;
  ctx.fill();
}

function drawLine(pt1, pt2) {
  pt1 = localPt(pt1);
  pt2 = localPt(pt2);
  ctx.beginPath();
  ctx.moveTo(pt1[0], pt1[1]);
  ctx.lineTo(pt2[0], pt2[1]);
  ctx.strokeStyle = lineColor;
  ctx.stroke();
}

function drawText(pt) {
  const str = `(${pt[0].toFixed(numberDigit)},${pt[1].toFixed(numberDigit)})`;

  pt = localPt(pt);
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = textColor;
  ctx.fillText(str, pt[0], pt[1] + 14);
}

function localPt(pt) {
  const x1 = pt[0] - box.x;
  const y1 = pt[1] - box.y;

  return [x1 / scale + width / 2, y1 / scale + height / 2];
}

function refreshStep() {
  step.innerText = `${idx}/${pts.length - 1}`;
}

function animation() {
  requestAnimationFrame(animation);
}

function calcBox(pts) {
  let xmin = Infinity,
    ymin = Infinity,
    xmax = -Infinity,
    ymax = -Infinity;
  for (let index = 0; index < pts.length; index++) {
    const pt = pts[index];
    xmin = Math.min(xmin, pt[0]);
    ymin = Math.min(ymin, pt[1]);
    xmax = Math.max(xmax, pt[0]);
    ymax = Math.max(ymax, pt[1]);
  }

  return {
    x: xmin / 2 + xmax / 2,
    y: ymin / 2 + ymax / 2,
    w: xmax - xmin,
    h: ymax - ymin,
  };
}

function addOffset(delta) {
  const screen = Math.min(width, height) / 2;
  offset += delta;
  offset = Math.max(50, Math.min(offset, screen - 100));
  console.log(offset);
  scale = Math.max(box.w / (width - offset * 2), box.h / (height - offset * 2));

  display(idx);
}
