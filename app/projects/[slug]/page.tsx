export default function ProjectPage({ params }: { params: { slug: string } }) {
  return (
    <div className="py-20">
      <h1 className="text-4xl font-bold">{params.slug}</h1>

      <p className="text-gray-400 mt-4">
        Problem → Solution → System Design → Outcome
      </p>

      <div className="mt-10">
        <h2 className="font-semibold">Architecture</h2>
        <p className="text-gray-400">
          Scalable API design, optimized backend, real-time communication,
          caching strategy, and deployment pipeline.
        </p>
      </div>
    </div>
  );
}
