let iterators = "0123456789ABCDEF";
let iterators2 = "01234567";
iterators = iterators.split("");
iterators2 = iterators2.split("");
const emojis = [];
iterators.forEach((i) => {
  let emoji = "0x1F60" + i;
  emojis.push(emoji);
});
iterators.forEach((i) => {
  let emoji = "0x1F61" + i;
  emojis.push(emoji);
});
iterators.forEach((i) => {
  let emoji = "0x1F62" + i;
  emojis.push(emoji);
});
iterators2.forEach((i) => {
  let emoji = "0x1F63" + i;
  emojis.push(emoji);
});
export default emojis;
