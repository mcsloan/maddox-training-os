import Link from "next/link";

export default function CompatibilityPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <article className="card">
        <p className="label">Browser requirements</p>
        <h1 className="text-4xl font-black">Compatibility</h1>
        <p className="mt-4 text-lg">Maddox Training OS uses Next.js 16 and requires a modern browser capable of running its React client bundle.</p>
      </article>
      <article className="card">
        <h2 className="text-2xl font-black">Supported browsers</h2>
        <ul className="mt-4 list-inside list-disc space-y-2">
          <li>Current Chrome, Edge, and Firefox on macOS or desktop systems.</li>
          <li>Safari 16.4 or newer on supported macOS versions.</li>
          <li>Safari on iPhone and iPad running iOS/iPadOS 16.4 or newer.</li>
        </ul>
      </article>
      <article className="card border-2 border-red-200">
        <h2 className="text-2xl font-black">Unsupported Safari versions</h2>
        <p className="mt-4">Safari 15.6.1 on old macOS Catalina is not a valid Next.js 16 test target. Server-rendered pages and plain JavaScript may appear, but React controls may not hydrate or respond.</p>
        <p className="mt-3 font-bold">Use Chrome on that Mac, or test Safari on a device updated to Safari/iOS/iPadOS 16.4 or newer.</p>
      </article>
      <article className="card">
        <h2 className="text-2xl font-black">iPhone and iPad browsers</h2>
        <p className="mt-4">Chrome on iPhone and iPad uses Apple&apos;s WebKit engine. Its compatibility behavior follows the installed iOS/iPadOS version rather than desktop Chrome.</p>
      </article>
      <article className="card">
        <h2 className="text-2xl font-black">Recommended test targets</h2>
        <ul className="mt-4 list-inside list-disc space-y-2">
          <li>Current Chrome on the development Mac.</li>
          <li>Safari 16.4+ on a supported Mac.</li>
          <li>iPhone Safari and Chrome on iOS 16.4+.</li>
          <li>iPad Safari on iPadOS 16.4+.</li>
        </ul>
        <Link className="btn-primary mt-6" href="/today">Back to Today</Link>
      </article>
    </div>
  );
}
