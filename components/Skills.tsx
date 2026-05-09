const skills = [
  "Next.js",
  "React",
  "Node.js",
  "MongoDB",
  "PostgreSQL",
  "System Design",
  "Socket.io",
  "AI APIs",
];

export default function Skills() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl font-bold">Tech Stack</h2>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {skills.map((s) => (
          <span
            key={s}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded"
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}
