export function revealChart() {
  const node = document.getElementById("kabu-chart");
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
}
