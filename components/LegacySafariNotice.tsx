const legacySafariScript = `
(function () {
  try {
    var ua = navigator.userAgent || "";
    var iosMatch = ua.match(/(?:iPhone|iPad|iPod).*OS (\\d+)[._](\\d+)/);
    if (iosMatch) {
      var iosMajor = parseInt(iosMatch[1], 10);
      var iosMinor = parseInt(iosMatch[2] || "0", 10);
      if (iosMajor < 16 || (iosMajor === 16 && iosMinor < 4)) {
        var iosNotice = document.getElementById("legacy-safari-notice");
        if (iosNotice) iosNotice.style.display = "block";
      }
      return;
    }
    var isSafari = /Safari\\//.test(ua) && !/(Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|FxiOS)\\//.test(ua);
    var match = ua.match(/Version\\/(\\d+)(?:\\.(\\d+))?/);
    if (!isSafari || !match) return;
    var major = parseInt(match[1], 10);
    var minor = parseInt(match[2] || "0", 10);
    if (major < 16 || (major === 16 && minor < 4)) {
      var notice = document.getElementById("legacy-safari-notice");
      if (notice) notice.style.display = "block";
    }
  } catch (error) {
    var notice = document.getElementById("legacy-safari-notice");
    if (notice) {
      notice.style.display = "block";
      notice.setAttribute("data-detection-error", error && error.message ? error.message : String(error));
    }
  }
})();
`;

export function LegacySafariNotice() {
  return (
    <>
      <aside id="legacy-safari-notice" style={{ display: "none" }} className="border-b-2 border-red-700 bg-red-100 px-4 py-3 text-center text-sm font-bold text-red-900">
        This browser is too old for Maddox Training OS. Please use Chrome on this Mac, or update iPhone/iPad to iOS/iPadOS 16.4+. <a className="underline" href="/compatibility">Compatibility details</a>
      </aside>
      <script dangerouslySetInnerHTML={{ __html: legacySafariScript }} />
    </>
  );
}
