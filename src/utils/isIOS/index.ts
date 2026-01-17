// Util for detecting iOS devices

export default function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // Detects iPadOS 13+ which identifies as Macintosh but has touch points
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}
