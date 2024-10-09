// data.ts
export const items = [
  { id: 1, group: "group1", value: "Item 1" },
  { id: 2, group: "group1", value: "Item 2" },
  { id: 3, group: "group1", value: "Item 3" },
  { id: 4, group: "group2", value: "Item 4" },
  { id: 5, group: "group2", value: "Item 5" },
];

export const groups = ["group1", "group2"];

export const biggroups = ["group1", "group2", "group3", "group4", "group5"];

export const bigitems = Array.from({ length: 30 }, (_, index) => {
  const groupIndex = Math.floor(Math.random() * biggroups.length);
  return {
    id: index + 1,
    group: biggroups[groupIndex],
    value: `Item ${index + 1}`,
  };
});
