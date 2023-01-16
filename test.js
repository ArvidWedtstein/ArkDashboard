let data = [
  {
    id: 1,
    content: "aaaa",
    created_at: "2023-01-16T00:00:00.000Z",
    profile_id: 1,
  },
  {
    id: 2,
    content: "Hello",
    created_at: "2023-01-16T10:00:00.000Z",
    profile_id: 1,
  },
  {
    id: 3,
    content: "bbbbbbbbb",
    created_at: "2023-01-16T10:00:20.000Z",
    profile_id: 2,
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

function groupBy2(array, f) {
  let groups = {};
  array
    .sort((a, b) => {
      const diff =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (diff) return diff;
      return b.profile_id.toString().localeCompare(a.profile_id.toString());
    })
    .forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
  return Object.keys(groups).map(function (group) {
    return groups[group];
  });
}

let t = groupBy2(data, function (item) {
  return [new Date(item.created_at).setSeconds(0, 0), item.profile_id];
});

console.log(t);
