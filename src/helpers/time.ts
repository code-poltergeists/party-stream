export default class TimeHelper {
  static formatTime(time: number | null) {
    if (time === null) {
      return "";
    }
    var formattedTime = "";
    if (time / 60 < 10) {
      formattedTime += 0;
    }
    formattedTime += Math.floor(time / 60);
    formattedTime += ":";
    const seconds = time - Math.floor(time / 60) * 60;
    if (seconds < 10) {
      formattedTime += 0;
    }
    formattedTime += seconds;
    return formattedTime;
  }

  static iso8601toNumber(time: string): number {
    const minutes = parseInt(time.substring(time.lastIndexOf("T") + 1, time.lastIndexOf("M")));
    const seconds = parseInt(time.substring(time.lastIndexOf("M") + 1, time.lastIndexOf("S")));
    return minutes * 60 + seconds;
  };
}
