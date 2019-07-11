export default class FullScreenHelper {
  static enable(element: { requestFullscreen: () => void; webkitRequestFullscreen: () => void; mozRequestFullScreen: () => void; msRequestFullscreen: () => void; }) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  static disable() {
    if ((document as any).exitFullscreen) {
      (document as any).exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  static get isFullScreen() {
    return (
      (document as any).fullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
  }

  static onFullscreenChange(callback: any) {
    (document as any).addEventListener("fullscreenchange", callback);
    (document as any).addEventListener("webkitfullscreenchange", callback);
    (document as any).addEventListener("mozfullscreenchange", callback);
    (document as any).addEventListener("MSFullscreenChange", callback);
  }

  static dispose(callback: any) {
    (document as any).removeEventListener("fullscreenchange", callback);
    (document as any).removeEventListener("webkitfullscreenchange", callback);
    (document as any).removeEventListener("mozfullscreenchange", callback);
    (document as any).removeEventListener("MSFullscreenChange", callback);
  }
}
