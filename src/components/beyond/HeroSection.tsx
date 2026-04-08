"use client";

import { motion } from "framer-motion";
import { BeyondImage } from "./BeyondImage";

export function HeroSection() {
  return (
    <section className="beyond-hero--rich" id="beyond-hero">
      <div className="beyond-hero-media">
        <BeyondImage
          src="/images/beyond/hero/hero.jpg"
          alt=""
          className="beyond-hero-cover"
          priority
        />
        <div className="beyond-hero-scrim" aria-hidden />
      </div>

      <div className="beyond-hero-inner">
        <motion.div
          className="beyond-hero-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="beyond-hero-eyebrow">Life outside design</p>
          <h1 className="beyond-hero-title">
            Beyond
            <br />
            the Interface
          </h1>
          <p className="beyond-hero-lead">
            A visual diary of hobbies and interests — plants, games, film,
            history, and music.
          </p>
        </motion.div>

        <motion.div
          className="beyond-hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          aria-hidden
        >
          <span>Scroll</span>
          <span className="beyond-hero-scroll-line" />
        </motion.div>
      </div>
    </section>
  );
}
