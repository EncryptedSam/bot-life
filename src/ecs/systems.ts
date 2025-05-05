import { Entity } from "./components";

export function updatePosition(entities: Entity[], delta: number) {
  entities.forEach((e) => {
    if (e.velocity) {
      e.position.x += e.velocity.dx * delta;
      e.position.y += e.velocity.dy * delta;
    }
  });
}

export function updateAnimation(entities: Entity[], delta: number) {
  entities.forEach((e) => {
    const sprite = e.sprite;
    sprite.elapsedTime += delta;

    if (sprite.elapsedTime >= sprite.frameTime) {
      sprite.currentFrame = (sprite.currentFrame + 1) % sprite.totalFrames;
      sprite.elapsedTime = 0;
    }
  });
}

export function render(entities: Entity[], ctx: CanvasRenderingContext2D) {
  entities.forEach((e) => {
    const { x, y } = e.position;
    const s = e.sprite;
    ctx.drawImage(
      s.image,
      s.currentFrame * s.frameWidth,
      0,
      s.frameWidth,
      s.frameHeight,
      x,
      y,
      s.frameWidth,
      s.frameHeight
    );
  });
}
