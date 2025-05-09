import { Entity } from "./components";

export function updatePosition(entities: Entity[], delta: number) {
  entities.forEach((e) => {
    if (e.velocity) {
      e.position.x += e.velocity.dx * delta;
      e.position.y += e.velocity.dy * delta;
    }
  });
}

export function updateOscillators(entities: Entity[], delta: number): void {
  for (const entity of entities) {
    const osc = entity.oscillator;
    if (!osc) continue;

    const { pointA, pointB, speed } = osc;
    const pos = entity.position;

    // Determine target
    const target = osc.direction === 1 ? pointB : pointA;

    // Calculate direction vector
    const dx = target.x - pos.x;
    const dy = target.y - pos.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 1) {
      osc.direction *= -1; // reverse direction
      continue;
    }

    // Normalize and move
    const vx = (dx / distance) * speed * (delta / 1000);
    const vy = (dy / distance) * speed * (delta / 1000);

    pos.x += vx;
    pos.y += vy;
  }
}

export function updateAnimation(entities: Entity[], delta: number): void {
  for (const entity of entities) {
    const sprite = entity.sprite;
    const state = entity.state || "idle";

    if (!sprite || !sprite.images[state] || !sprite.totalFrames[state])
      continue;

    sprite.currentAnimation = state;
    sprite.elapsedTime += delta;

    if (sprite.elapsedTime >= sprite.frameTime) {
      sprite.elapsedTime = 0;

      if (state === "collected") {
        if (sprite.currentFrame < sprite.totalFrames[state] - 1) {
          sprite.currentFrame++;
        } else {
          entity.type = "remove";
        }
      } else {
        // loop normal animations
        sprite.currentFrame =
          (sprite.currentFrame + 1) % sprite.totalFrames[state];
      }
    }
  }
}

// Helper function to render an entity's sprite (this would be adapted to your rendering framework, like canvas)
export function render(
  entities: Entity[],
  ctx: CanvasRenderingContext2D
): void {
  entities.forEach((entity) => {
    const { x, y } = entity.position;
    const sprite = entity.sprite;

    if (!sprite) return;

    const currentState = entity.sprite.currentAnimation || "idle";

    const image = sprite.images[currentState];
    if (!image) return;

    const frameX = sprite.currentFrame * sprite.frameWidth;
    const frameY = 0;
    const width = sprite.frameWidth;
    const height = sprite.frameHeight;

    ctx.save(); // Save canvas state

    if (entity.direction === "left") {
      // Flip horizontally around the vertical axis
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
      ctx.drawImage(image, frameX, frameY, width, height, 0, 0, width, height);
    } else {
      ctx.translate(x, y);
      ctx.drawImage(image, frameX, frameY, width, height, 0, 0, width, height);
    }

    ctx.restore(); // Restore canvas state
  });
}
