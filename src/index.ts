import renderAudio from "./audio";

function app(): void {
  const app = <HTMLDivElement>document.getElementById("app");
  app.appendChild(renderAudio);
}
window.onload = () => app();
