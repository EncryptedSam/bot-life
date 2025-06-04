/**
 *
 * [ ] filterInputKeys
 *
 *
 *
 *
 */
var pressedKeys = [
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
function filterInputKeys(keys) {
    var res = [];
    var requiredKeys = [
        " ",
        "ArrowUp",
        "ArrowRight",
        "ArrowLeft",
        "Control",
        "ArrowDown",
    ];
    var filteredKeys = keys.filter(function (key) {
        return requiredKeys.includes(key);
    });
    var rightIndex = filteredKeys.indexOf("ArrowRight");
    var leftIndex = filteredKeys.indexOf("ArrowLeft");
    var upIndex = filteredKeys.indexOf("ArrowUp");
    var downIndex = filteredKeys.indexOf("ArrowDown");
    var spaceIndex = filteredKeys.indexOf(" ");
    var ctrlIndex = filteredKeys.indexOf("Control");
    if (rightIndex != leftIndex) {
        if (rightIndex > leftIndex) {
            res.push("ArrowRight");
        }
        else {
            res.push("ArrowLeft");
        }
    }
    if (upIndex != downIndex) {
        if (upIndex > downIndex) {
            res.push("ArrowUp");
        }
        else {
            res.push("ArrowDown");
        }
    }
    if (spaceIndex != ctrlIndex) {
        if (spaceIndex > ctrlIndex) {
            res.push(" ");
        }
        else {
            res.push("Control");
        }
    }
    return res;
}
// console.log(filterInputKeys(pressedKeys));
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getXposList(width, radius, cols, px) {
    var res = [];
    var w = width - (2 * px + 2 * radius * (cols - 1));
    var seg = w / cols;
    var a = px;
    var dia = 2 * radius;
    for (var i = 0; i < cols; i++) {
        res.push(getRandomInRange(a, a + seg));
        a = a + seg + dia;
    }
    return res;
}
function getCoordList(width, radius, cols, yRange, px) {
    px = px !== null && px !== void 0 ? px : radius;
    var res = [];
    var w = width - (2 * px + 2 * radius * (cols - 1));
    var seg = w / cols;
    var a = px;
    var dia = 2 * radius;
    for (var i = 0; i < cols; i++) {
        var x = getRandomInRange(a, a + seg);
        var y = getRandomInRange(yRange.from, yRange.to);
        res.push({ x: x, y: y });
        a = a + seg + dia;
    }
    return res;
}
function pickRandomItems(categories, items) {
    var _a;
    var grouped = {};
    // Group items by category type
    for (var _i = 0, _b = Object.entries(categories); _i < _b.length; _i++) {
        var _c = _b[_i], item = _c[0], type = _c[1];
        var value = (_a = items[item]) !== null && _a !== void 0 ? _a : 0;
        if (!grouped[type])
            grouped[type] = [];
        grouped[type].push({ name: item, value: value });
    }
    var result = {};
    for (var _d = 0, _e = Object.values(grouped); _d < _e.length; _d++) {
        var itemList = _e[_d];
        // Filter items with value > 0
        var validItems = itemList.filter(function (i) { return i.value > 0; });
        if (validItems.length === 0)
            continue;
        // Pick a random item from the valid items
        var randomItem = validItems[Math.floor(Math.random() * validItems.length)];
        result[randomItem.name] = randomItem.value;
    }
    return result;
}
var categories = {
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
var items = {
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
for (var key in items) {
    console.log(typeof key);
}
