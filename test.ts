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

console.log(getXposList(300, 10, 4, 15));
