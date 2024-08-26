function init(
  nS: string,
  rendering: string | undefined,
): HTMLCanvasElement | null {
  let content = rendering || "2d";
  let canvas = <HTMLCanvasElement | null>document.getElementById(nS);
  if (canvas) {
    canvas.width = 500;
    canvas.height = 600;

    const ctx = <CanvasRenderingContext2D>canvas.getContext(content);
    ctx.fillStyle = "rgb(200 0 0)";
    ctx.fillRect(10, 10, 50, 50);
    ctx.fillStyle = "rgb(0 0 200 / 50%)";
    ctx.fillRect(30, 30, 50, 50);
    return <HTMLCanvasElement>canvas;
  }
  return null;
}

function app(): void {
  const app = <HTMLDivElement>document.getElementById("app");
  const canvas = init("muhi-canvas", "2d");
  console.log("mantap coksss");
  if (!canvas) throw new Error("cannot load canvas");
  app.appendChild(canvas);
}
window.onload = () => app();
