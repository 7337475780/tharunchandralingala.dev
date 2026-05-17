"use client";
import { motion } from "framer-motion";

export default function Stats() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="py-12 grid grid-cols-3 text-center border-y border-gray-800"
    >
      <div>
        <h2 className="text-3xl font-bold">5+</h2>
        <p className="text-gray-400">Projects</p>
      </div>

      <div>
        <h2 className="text-3xl font-bold">300+</h2>
        <p className="text-gray-400">DSA Problems</p>
      </div>

      <div>
        <h2 className="text-3xl font-bold">2+</h2>
        <p className="text-gray-400">AI Tools</p>
      </div>
    </motion.section>
  );
}
