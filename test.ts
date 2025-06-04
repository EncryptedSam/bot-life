/**
 *
 * [ ] filterInputKeys
 *
 *
 *
 *
 */

let pressedKeys = [
  " ",
  "ArrowDown",
  "Control",
  "f",
  "d",
  "ArrowLeft",
  "s",
  "ArrowRight",
  "a",
  "ArrowUp",
];

function filterInputKeys(keys: string[]) {
  const res: string[] = [];
  const requiredKeys = [
    " ",
    "ArrowUp",
    "ArrowRight",
    "ArrowLeft",
    "Control",
    "ArrowDown",
  ];

  const filteredKeys = keys.filter((key) => {
    return requiredKeys.includes(key);
  });

  const rightIndex = filteredKeys.indexOf("ArrowRight");
  const leftIndex = filteredKeys.indexOf("ArrowLeft");
  const upIndex = filteredKeys.indexOf("ArrowUp");
  const downIndex = filteredKeys.indexOf("ArrowDown");
  const spaceIndex = filteredKeys.indexOf(" ");
  const ctrlIndex = filteredKeys.indexOf("Control");

  if (rightIndex != leftIndex) {
    if (rightIndex > leftIndex) {
      res.push("ArrowRight");
    } else {
      res.push("ArrowLeft");
    }
  }

  if (upIndex != downIndex) {
    if (upIndex > downIndex) {
      res.push("ArrowUp");
    } else {
      res.push("ArrowDown");
    }
  }

  if (spaceIndex != ctrlIndex) {
    if (spaceIndex > ctrlIndex) {
      res.push(" ");
    } else {
      res.push("Control");
    }
  }

  return res;
}

// console.log(filterInputKeys(pressedKeys));

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getXposList(
  width: number,
  radius: number,
  cols: number,
  px: number
): number[] {
  let res: number[] = [];
  let w: number = width - (2 * px + 2 * radius * (cols - 1));

  let seg: number = w / cols;

  let a: number = px;
  let dia: number = 2 * radius;

  for (let i = 0; i < cols; i++) {
    res.push(getRandomInRange(a, a + seg));
    a = a + seg + dia;
  }

  return res;
}

function getCoordList(
  width: number,
  radius: number,
  cols: number,
  yRange: { from: number; to: number },
  px?: number
): { x: number; y: number }[] {
  px = px ?? radius;

  let res: { x: number; y: number }[] = [];
  let w: number = width - (2 * px + 2 * radius * (cols - 1));

  let seg: number = w / cols;

  let a: number = px;
  let dia: number = 2 * radius;

  for (let i = 0; i < cols; i++) {
    let x = getRandomInRange(a, a + seg);
    let y = getRandomInRange(yRange.from, yRange.to);
    res.push({ x, y });
    a = a + seg + dia;
  }

  return res;
}

// console.log(getCoordList(300, 10, 4, {from:-10, to:-100}));

// -------------------
type Categories = Record<string, string>;
type Items = Record<string, number>;

function pickRandomItems(
  categories: Categories,
  items: Items
): Record<string, number> {
  const grouped: Record<string, { name: string; value: number }[]> = {};

  // Group items by category type
  for (const [item, type] of Object.entries(categories)) {
    const value = items[item] ?? 0;
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push({ name: item, value });
  }

  const result: Record<string, number> = {};

  for (const itemList of Object.values(grouped)) {
    // Filter items with value > 0
    const validItems = itemList.filter((i) => i.value > 0);
    if (validItems.length === 0) continue;

    // Pick a random item from the valid items
    const randomItem =
      validItems[Math.floor(Math.random() * validItems.length)];
    result[randomItem.name] = randomItem.value;
  }

  return result;
}

const categories = {
  food: "resource",
  water: "resource",
  drinks: "resource",
  bullets: "resource",

  bathroom: "utility",
  sleep: "utility",

  "paid work": "activity",
  work: "activity",

  "medi kit": "medical",

  chat: "entertainment",
  music: "entertainment",
  alcohol: "entertainment",
  "family time": "entertainment",
};

const items = {
  food: 1000,
  water: 1000,
  drinks: 1000,
  bullets: 1000,

  bathroom: 1000,
  sleep: 1000,
  "paid work": 1000,
  work: 1000,
  "medi kit": 10,
  chat: 1000,
  music: 1000,
  alcohol: 1000,
  "family time": 1000,
};

// console.log(pickRandomItems(categories, items));

for (let key in items) {
  console.log(typeof key);
}
