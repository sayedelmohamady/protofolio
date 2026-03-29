"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function BeyondFooter() {
  return (
    <footer className="beyond-footer beyond-footer--minimal">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Link href="/" className="beyond-footer-link">
          &larr; Back to Portfolio
        </Link>
      </motion.div>
    </footer>
  );
}
