export default function Hero() {
  return (
    <section className="py-28 text-center">
      <h1 className="text-5xl font-bold leading-tight">
        I build scalable full-stack & AI-powered web systems
      </h1>

      <p className="text-gray-400 mt-5 max-w-xl mx-auto">
        Full-stack developer focused on building production-ready applications,
        real-time systems, and AI-powered tools.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a href="#projects" className="px-6 py-3 bg-white text-black rounded">
          View Projects
        </a>

        <a href="/contact" className="px-6 py-3 border border-white rounded">
          Contact Me
        </a>
      </div>
    </section>
  );
}
