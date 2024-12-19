import * as PIXI from "pixi.js";

// Создаем приложение
const app = new PIXI.Application({
  width: 800,
  height: 600,
  backgroundColor: 0x1099bb,
});
document.body.appendChild(app.view);

// Добавляем текст
const message = new PIXI.Text("Hello, Pixi.js!", {
  fontSize: 36,
  fill: 0xffffff,
});
message.x = app.view.width / 2;
message.y = app.view.height / 2;
message.anchor.set(0.5);
app.stage.addChild(message);
