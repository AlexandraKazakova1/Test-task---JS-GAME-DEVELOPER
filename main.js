import { Application } from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });

  // Додавання канваса в DOM
  document.body.appendChild(app.canvas); // app.canvas замість app.view

  let player;
  let bullets = [];
  let asteroids = [];
  let score = 0;
  let shotsLeft = 10;
  let gameOver = false;
  let countdown = 60;

  const shotsText = new PIXI.Text(`Постріли: ${shotsLeft}`, {
    fill: "white",
    fontSize: 24,
  });
  shotsText.position.set(10, 10);

  const timerText = new PIXI.Text(`Час: ${countdown}`, {
    fill: "white",
    fontSize: 24,
  });
  timerText.position.set(10, 40);

  app.stage.addChild(shotsText, timerText);

  function createPlayer() {
    player = new PIXI.Graphics();
    player.beginFill(0x00ff00);
    player.drawPolygon([-20, 20, 0, -20, 20, 20]);
    player.endFill();
    player.x = app.canvas.width / 2;
    player.y = app.canvas.height - 50;
    app.stage.addChild(player);
  }
  createPlayer();

  function createAsteroids() {
    for (let i = 0; i < 10; i++) {
      const asteroid = new PIXI.Graphics();
      asteroid.beginFill(0xff0000);
      asteroid.drawCircle(0, 0, 20);
      asteroid.endFill();
      asteroid.x = Math.random() * app.canvas.width;
      asteroid.y = (Math.random() * app.canvas.height) / 2;
      app.stage.addChild(asteroid);
      asteroids.push(asteroid);
    }
  }
  createAsteroids();

  let keys = {};
  window.addEventListener("keydown", (e) => (keys[e.code] = true));
  window.addEventListener("keyup", (e) => (keys[e.code] = false));

  app.ticker.add(() => {
    if (gameOver) return;

    if (keys["Space"] && shotsLeft > 0) {
      shootBullet();
      shotsLeft--;
      shotsText.text = `Постріли: ${shotsLeft}`;
      keys["Space"] = false;
    }

    bullets.forEach((bullet, bulletIndex) => {
      bullet.y -= 7;
      if (bullet.y < 0) {
        app.stage.removeChild(bullet);
        bullets.splice(bulletIndex, 1);
      }

      asteroids.forEach((asteroid, asteroidIndex) => {
        if (hitTestRectangle(bullet, asteroid)) {
          app.stage.removeChild(bullet, asteroid);
          bullets.splice(bulletIndex, 1);
          asteroids.splice(asteroidIndex, 1);
          score++;
        }
      });
    });

    if (asteroids.length === 0) endGame("YOU WIN");
  });

  function shootBullet() {
    const bullet = new PIXI.Graphics();
    bullet.beginFill(0xffff00);
    bullet.drawRect(-3, -10, 6, 10);
    bullet.endFill();
    bullet.x = player.x;
    bullet.y = player.y;
    app.stage.addChild(bullet);
    bullets.push(bullet);
  }

  function hitTestRectangle(r1, r2) {
    const r1Bounds = r1.getBounds();
    const r2Bounds = r2.getBounds();
    return (
      r1Bounds.x < r2Bounds.x + r2Bounds.width &&
      r1Bounds.x + r1Bounds.width > r2Bounds.x &&
      r1Bounds.y < r2Bounds.y + r2Bounds.height &&
      r1Bounds.y + r1Bounds.height > r2Bounds.y
    );
  }

  const timer = setInterval(() => {
    if (gameOver) return;
    countdown--;
    timerText.text = `Час: ${countdown}`;
    if (countdown <= 0) endGame("YOU LOSE");
  }, 1000);

  function endGame(message) {
    gameOver = true;
    clearInterval(timer);

    const endText = new PIXI.Text(message, { fill: "white", fontSize: 72 });
    endText.anchor.set(0.5);
    endText.x = app.canvas.width / 2;
    endText.y = app.canvas.height / 2;
    app.stage.addChild(endText);
  }
})();
