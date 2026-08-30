async function run() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}
run();
console.log("C");
