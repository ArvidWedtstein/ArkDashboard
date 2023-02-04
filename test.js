const { items } = require("./web/public/arkitems.json");
let data = [
  {
    id: 1,
    content: "aaaa",
    created_at: "2023-01-16T00:00:00.000Z",
    profile_id: 1,
  },
  {
    id: 3,
    content: "bbbbbbbbb",
    created_at: "2023-01-16T10:00:00.000Z",
    profile_id: 2,
  },
  {
    id: 2,
    content: "Hello",
    created_at: "2023-01-16T10:00:20.000Z",
    profile_id: 1,
  },
  {
    id: 4,
    content: "bruh",
    created_at: "2023-01-16T10:00:30.000Z",
    profile_id: 1,
  },
  {
    id: 5,
    content: "test123254346",
    created_at: "2023-01-16T11:00:00.000Z",
    profile_id: 1,
  },
  {
    id: 6,
    content: "test",
    created_at: "2023-01-16T12:00:00.000Z",
    profile_id: 2,
  },
];
let d = ["aaaa", "bbbbbbbbb", "Hello", "bruh", "aaaa"];
console.time("normal");
const remDupicates = (arr) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

console.log(remDupicates(d));
console.timeEnd("normal");

console.time("optimized");
const removeDuplicates = (arr) => {
  return [...new Set(arr)];
};
console.log(removeDuplicates(d));
console.timeEnd("optimized");
