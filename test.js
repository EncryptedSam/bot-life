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
console.log(getXposList(300, 10, 4, 15));
