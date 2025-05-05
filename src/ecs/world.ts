import heroImage from "../assets/pd1/mc/vr-guy/Idle (32x32).png";
import { Entity } from "./components";

export const entities: Entity[] = [];

export function createHero(): Entity {
  const img = new Image();
  img.src = heroImage;

  const hero: Entity = {
    id: 1,
    position: { x: 100, y: 100 },
    velocity: { dx: 0, dy: 0 },
    sprite: {
      image: img,
      frameWidth: 32,
      frameHeight: 32,
      currentFrame: 0,
      totalFrames: 7,
      frameTime: 100,
      elapsedTime: 0,
    },
  };

  entities.push(hero);
  return hero;
}
