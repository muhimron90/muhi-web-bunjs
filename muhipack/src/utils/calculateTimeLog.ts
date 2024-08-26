function getFormatTime(times: string[]) {
  const [delimiter, separator] = [",", "."];
  const formatTime = times.map((v) =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter),
  );
  return formatTime.join(separator);
}
function calculateTimeLog(now: number): string {
  const deltaTime = Date.now() - now;
  const result = getFormatTime([
    deltaTime < 1000 ? deltaTime + "ms" : Math.abs(deltaTime / 1000) + "s",
  ]);
  return result;
}
export default calculateTimeLog;
