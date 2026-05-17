const skills = [
  "Next.js",
  "React",
  "Node.js",
  "MongoDB",
  "System Design",
  "Socket.io",
  "AI Tools",
];

export default function Skills() {
  return (
    <section>
      <h2>Skills</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        {skills.map((s) => (
          <span
            key={s}
            style={{
              padding: "6px 12px",
              border: "1px solid #333",
              borderRadius: 6,
              color: "#aaa",
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}