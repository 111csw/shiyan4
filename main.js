const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let ballSpeed = 2; // 小球初始速度

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const brickRowCount = 5;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;
let lives = 3;
let bricks = [];
let items = []; // 存储道具
let backgroundColor = "#eee"; // 背景颜色

// 生成砖块并为一些砖块随机生成道具或敌人
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, item: Math.random() < 0.1 ? 'speed' : Math.random() < 0.1 ? 'life' : Math.random() < 0.1 ? 'enemy' : null };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;

          // 道具或敌人
          if (b.item === 'speed') {
            ballSpeed += 1; // 加速
          } else if (b.item === 'life') {
            lives++; // 增加生命
          } else if (b.item === 'enemy') {
            lives--; // 减少生命
            explode(b.x + brickWidth / 2, b.y + brickHeight / 2); // 触发爆炸
          }

          // 背景变化
          if (score >= 10 && score < 20) {
            backgroundColor = "#FFEB3B";
          } else if (score >= 20) {
            backgroundColor = "#8BC34A";
          }

          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// 爆炸效果
function explode(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();

  setTimeout(() => {
    ctx.clearRect(x - 35, y - 35, 70, 70); // 清除爆炸效果
  }, 200);
}

// 小球渐变效果
function drawBall() {
  let gradient = ctx.createRadialGradient(x, y, 0, x, y, ballRadius);
  gradient.addColorStop(0, "yellow");
  gradient.addColorStop(1, "red");

  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
}

// 绘制挡板
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 绘制砖块，包含不同的颜色、样式和阴影
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        // 根据砖块状态设置不同的颜色
        let brickColor = "lightblue";
        if (score < 10) {
          brickColor = "lightblue";
        } else if (score >= 10 && score < 20) {
          brickColor = "orange";
        } else {
          brickColor = "green";
        }

        // 绘制砖块
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = brickColor;
        ctx.shadowColor = "black";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.closePath();

        // 绘制道具
        if (bricks[c][r].item === 'speed') {
          ctx.beginPath();
          ctx.fillStyle = "red";
          ctx.arc(brickX + brickWidth / 2, brickY + brickHeight / 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        } else if (bricks[c][r].item === 'life') {
          ctx.beginPath();
          ctx.fillStyle = "green";
          ctx.arc(brickX + brickWidth / 2, brickY + brickHeight / 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        } else if (bricks[c][r].item === 'enemy') {
          ctx.beginPath();
          ctx.fillStyle = "black";
          ctx.arc(brickX + brickWidth / 2, brickY + brickHeight / 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
}

// 绘制分数
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// 绘制生命
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// 设置动态渐变背景
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#FF6F61");
  gradient.addColorStop(1, "#6a11cb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
  drawBackground(); // 绘制背景

  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
   
    }  }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }
  
    x += dx * ballSpeed;
    y += dy;
  
    requestAnimationFrame(draw);
  }
  
  draw(); // 开始绘制游戏
  