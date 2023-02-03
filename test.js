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

console.time("normal");

const dynamicSort = (property) => {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};
console.log(data.sort(dynamicSort("content")));
console.timeEnd("normal");

console.time("optimized");
const dynamicSort2 = (property) => {
  const sortOrder = property[0] === "-" ? -1 : 1;
  const sortKey = property[0] === "-" ? property.substr(1) : property;

  return (a, b) => {
    const result =
      a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0;
    return result * sortOrder;
  };
};

console.log(data.sort(dynamicSort2("content")));
console.timeEnd("optimized");
