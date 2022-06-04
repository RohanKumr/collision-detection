const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("#canvas")
);
const ctx = canvas.getContext("2d");

let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;
let isMobile = WIDTH < 600 ? true : false;

canvas.width = WIDTH;
canvas.height = HEIGHT;

canvas.style.background = "rgb(29 82 135)";

class Circle {
  constructor(x, y, r, c, num, speed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.num = num;
    this.speed = speed;

    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }
  update() {
    //right || left
    if (this.x + this.r > WIDTH || this.x - this.r < 0) {
      this.dx = -this.dx;
    }
    //bottom || top
    if (this.y + this.r > HEIGHT || this.y - this.r < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
  draw() {
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.color;
    ctx.fillText(this.num, this.x, this.y);
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
  }
}

const circles = [];
function createCircles() {
  circles.push(
    new Circle(WIDTH / 2, HEIGHT / 2, isMobile ? 100 : 200, "black", 0, 0)
  );
  const randomSpeed = () => randomNumber(1, 6);
  const randomNumber = (min, max) => Math.random() * (max - min) + min;
  const randomPos = (axis, RAD) => {
    switch (axis) {
      case "x":
        return randomNumber(RAD, WIDTH - RAD);
      case "y":
        return randomNumber(RAD, HEIGHT - RAD);
      default:
        return 100;
    }
  };
  for (let index = 1; index < WIDTH / 2; index++) {
    const max = isMobile ? 8 : 10;
    const min = isMobile ? 1 : 1;
    const RAD = Math.floor(Math.random() * (max - min + 1) + min);

    circles.push(
      new Circle(
        randomPos("x", RAD),
        randomPos("y", RAD),
        RAD,
        "black",
        1,
        randomSpeed()
      )
    );
  }
}
function handleCircles() {
  circles.forEach((c, i) => {
    if (i >= 1) {
      const s = circles[0];
      const m = c;

      const didCollide = circleCollision(s, m);
      const colorDef = "rgb(54 192 134)";
      const colorCenter = "black";
      if (didCollide) {
        m.color = "white";
        s.color = colorCenter;
      } else {
        m.color = colorDef;
        s.color = colorCenter;
      }
    }
    c.draw();
    c.update();
  });

  function circleCollision(c1, c2) {
    const dis = Math.sqrt(Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2));
    const res = dis < c1.r + c2.r;
    return res;
  }
}

function animate() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  requestAnimationFrame(animate);
  handleCircles();
}
createCircles();
animate();
