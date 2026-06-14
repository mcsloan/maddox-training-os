const plainJsScript = `
(function () {
  var status = document.getElementById("plain-js-status");
  var button = document.getElementById("plain-js-button");
  var log = document.getElementById("plain-js-log");

  function append(label, value) {
    log.value += "[" + new Date().toISOString() + "] " + label + ": " + value + "\\n";
  }

  function reportError(error) {
    status.textContent = "Plain JS status: error";
    append("ERROR", error && error.message ? error.message : String(error));
    if (error && error.stack) append("STACK", error.stack);
  }

  try {
    status.textContent = "Plain JS status: running";
    append("inline script", "executed");
    button.addEventListener("click", function () {
      try {
        append("timestamp", new Date().toISOString());
        append("userAgent", navigator.userAgent);
        append("current URL", window.location.href);
        var key = "maddox-training-os:plain-js-test";
        localStorage.setItem(key, "ok");
        var read = localStorage.getItem(key);
        localStorage.removeItem(key);
        append("localStorage set/get/remove", read === "ok" && localStorage.getItem(key) === null);
        append("crypto.randomUUID availability", !!(window.crypto && typeof window.crypto.randomUUID === "function"));
        append("structuredClone availability", typeof window.structuredClone === "function");
        append("Object.fromEntries availability", typeof Object.fromEntries === "function");
        append("Promise availability", typeof Promise === "function");
        append("fetch availability", typeof fetch === "function");
        status.textContent = "Plain JS status: click test completed";
      } catch (error) {
        reportError(error);
      }
    });
    status.textContent = "Plain JS status: listener attached";
  } catch (error) {
    reportError(error);
  }
})();
`;

export default function PlainJsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <article className="card">
        <p className="label">No React client state</p>
        <h1 className="text-3xl font-black">Plain JavaScript Diagnostic</h1>
        <p id="plain-js-status" className="mt-4 rounded-xl bg-ice p-4 font-black">Plain JS status: not run yet</p>
        <button id="plain-js-button" className="btn-primary mt-4">Run Plain JS Test</button>
        <label className="mt-5 block"><span className="label">Plain JavaScript log</span><textarea id="plain-js-log" className="field min-h-72 font-mono text-xs" readOnly defaultValue="" /></label>
      </article>
      <script dangerouslySetInnerHTML={{ __html: plainJsScript }} />
    </div>
  );
}
