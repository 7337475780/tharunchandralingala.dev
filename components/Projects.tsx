import Link from "next/link";

const projects = [
  {
    slug: "weconnect",
    title: "WeConnect",
    desc: "Real-time chat system with WebSockets",
  },
  {
    slug: "ai-image",
    title: "AI Image Generator",
    desc: "Generates images using AI prompts",
  },
  {
    slug: "tube-fetcher",
    title: "Video Downloader System",
    desc: "High-performance media processing backend",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-10">Featured Work</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="p-6 border border-gray-800 rounded-xl hover:scale-105 transition"
          >
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-gray-400 mt-2">{p.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
