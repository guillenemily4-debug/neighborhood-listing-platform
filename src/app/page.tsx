export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">
          Neighborhood Listing Platform
        </h1>

        <p className="mt-4 text-lg">
          A community platform that helps neighbors discover local listings,
          neighborhood sponsors, and accessible voice assistance.
        </p>

        <section
          className="mt-10 grid gap-6 md:grid-cols-3"
          aria-label="Platform features"
        >
          <article className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Listings</h2>
            <p className="mt-2">
              Browse useful property and neighborhood listings in one place.
            </p>
          </article>

          <article className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">
              Neighborhood Sponsors
            </h2>
            <p className="mt-2">
              Discover local businesses and organizations that support the
              community.
            </p>
          </article>

          <article className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">Voice Help</h2>
            <p className="mt-2">
              Access voice-based assistance to help navigate the platform.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}