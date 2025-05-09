import { Entity, Position } from "./components";

import idleSheet from "../assets/pd1/mc/vr-guy/Idle (32x32).png";
import runSheet from "../assets/pd1/mc/vr-guy/Run (32x32).png";
import jumpSheet from "../assets/pd1/mc/vr-guy/Jump (32x32).png";
import doubleJumpSheet from "../assets/pd1/mc/vr-guy/Double Jump (32x32).png";
import fallSheet from "../assets/pd1/mc/vr-guy/Fall (32x32).png";
import wallJumpSheet from "../assets/pd1/mc/vr-guy/Wall Jump (32x32).png";
import hitSheet from "../assets/pd1/mc/vr-guy/Hit (32x32).png";
import collectedSheet from "../assets/pd1/items/Fruits/collected.png";
import appleSheet from "../assets/pd1/items/Fruits/apple.png";
import bananasSheet from "../assets/pd1/items/Fruits/bananas.png";
import cherriesSheet from "../assets/pd1/items/Fruits/cherries.png";
import kiwiSheet from "../assets/pd1/items/Fruits/kiwi.png";
import melonSheet from "../assets/pd1/items/Fruits/melon.png";
import orangeSheet from "../assets/pd1/items/Fruits/orange.png";
import pineappleSheet from "../assets/pd1/items/Fruits/pineapple.png";
import strawberrySheet from "../assets/pd1/items/Fruits/strawberry.png";
import sawSheet from "../assets/pd1/traps/Saw/On (38x38).png";

export const entities: Entity[] = [];

export function createHero(x: number, y: number): Entity {
  const load = (src: string): HTMLImageElement => {
    const img = new Image();
    img.src = src;
    return img;
  };

  const frameWidth = 32;
  const frameHeight = 32;

  let hero: Entity = {
    id: Math.random(),
    type: "hero",
    position: { x, y },
    velocity: { dx: 0, dy: 0 },
    direction: "right",
    state: "idle",
    sprite: {
      images: {
        idle: load(idleSheet),
        run: load(runSheet),
        jump: load(jumpSheet),
        "double-jump": load(doubleJumpSheet),
        fall: load(fallSheet),
        "wall-jump": load(wallJumpSheet),
        hit: load(hitSheet),
      },
      totalFrames: {
        idle: 11,
        run: 12,
        jump: 1,
        "double-jump": 6,
        fall: 1,
        "wall-jump": 5,
        hit: 7,
      },
      frameWidth,
      frameHeight,
      currentFrame: 0,
      currentAnimation: "run",
      frameTime: 100,
      elapsedTime: 0,
    },
  };

  entities.push(hero);

  return hero;
}

export function createFruit(
  x: number,
  y: number,
  kind:
    | "apple"
    | "bananas"
    | "cherries"
    | "collected"
    | "kiwi"
    | "melon"
    | "orange"
    | "pineapple"
    | "strawberry"
): Entity {
  const load = (src: string): HTMLImageElement => {
    const img = new Image();
    img.src = src;
    return img;
  };

  const frameSize = 32;

  const getSheet = (value: string) => {
    let obj: any = {
      apple: appleSheet,
      bananas: bananasSheet,
      cherries: cherriesSheet,
      kiwi: kiwiSheet,
      melon: melonSheet,
      orange: orangeSheet,
      pineapple: pineappleSheet,
      strawberry: strawberrySheet,
    };

    return obj[value];
  };

  let fruit: Entity = {
    id: Math.random(),
    type: "fruit",
    position: { x, y },
    state: "idle",
    sprite: {
      images: {
        // idle: load(`../assets/pd1/items/Fruits/${kind}.png`),
        idle: load(getSheet(kind)),
        collected: load(collectedSheet),
      },
      totalFrames: {
        idle: 17,
        collected: 6, // or however many frames your collected animation has
      },
      frameWidth: frameSize,
      frameHeight: frameSize,
      currentFrame: 0,
      currentAnimation: "idle",
      frameTime: 100,
      elapsedTime: 0,
    },
  };

  entities.push(fruit);

  return fruit;
}

export function createSaw(
  x: number,
  y: number,
  {
    pointA,
    pointB,
    speed = 50,
  }: { pointA: Position; pointB: Position; speed?: number }
): Entity {
  const image = new Image();
  image.src = sawSheet; // replace with actual path

  const saw: Entity = {
    id: Math.random(),
    type: "saw",
    position: { x, y },
    sprite: {
      images: { idle: image },
      totalFrames: { idle: 8 },
      frameWidth: 38,
      frameHeight: 38,
      currentFrame: 0,
      currentAnimation: "idle",
      frameTime: 80,
      elapsedTime: 0,
    },
    state: "idle",
    oscillator: {
      pointA,
      pointB,
      speed,
      direction: 1,
    },
  };

  entities.push(saw);

  return saw;
}
