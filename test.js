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
console.time("test");
let final = [];
const groupValues = (t, v, i, a) => {
  if (
    t.hasOwnProperty("profile_id") &&
    new Date(t.created_at).setSeconds(0, 0) ===
      new Date(v.created_at).setSeconds(0, 0) &&
    t.profile_id === v.profile_id
  ) {
    t.id.push(v.id);
    t.content.push(v.content);
    t.profile_id = v.profile_id;
    t.created_at = v.created_at;
  } else {
    if (t.hasOwnProperty("profile_id")) final.push(t);
    t = {
      id: [v.id],
      content: [v.content],
      profile_id: v.profile_id,
      created_at: v.created_at,
    };
  }
  if (i == a.length - 1) final.push(t);
  return t;
};
let final2 = [];
const groupValues2 = (t, v, i, a) => {
  if (
    t.hasOwnProperty("profile_id") &&
    new Date(t.created_at).setSeconds(0, 0) ===
      new Date(v.created_at).setSeconds(0, 0) &&
    t.profile_id === v.profile_id
  ) {
    t.id.push(v.id);
    t.content.push(v.content);
    t.profile_id = v.profile_id;
    t.created_at = v.created_at;
  } else {
    if (t.hasOwnProperty("profile_id")) final2.push(t);
    t = {
      id: [v.id],
      content: [v.content],
      profile_id: v.profile_id,
      created_at: v.created_at,
    };
  }
  if (i == a.length - 1) final2.push(t);
  return t;
};
// data.reduce(groupValues, {});
// console.log(final);

// final.reduce(groupValues, {});
// console.log(final2);
// console.timeEnd("test");
// console.log(d);

/**
 * Current
 */
console.time("test2");
const isUUID = (value) => {
  return (
    // !!value &&
    // typeof value === "string" &&
    // value.length === 36 &&
    // value.split("-").length === 5
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(
      value
    )
  );
};

console.log(isUUID("7a2878d1-4f61-456d-bcb6-edc707383ea8"));
console.timeEnd("test2");
