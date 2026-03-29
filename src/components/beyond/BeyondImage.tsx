"use client";

import { useState } from "react";

interface BeyondImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Eager load + high fetch priority (hero, first grid rows). */
  priority?: boolean;
}

export function BeyondImage({
  src,
  alt,
  className,
  priority = false,
}: BeyondImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={className}>
        <div
          className="beyond-img-placeholder beyond-img-placeholder--error"
          role="img"
          aria-label={
            alt ? `Image could not load (${alt})` : "Image could not load"
          }
        >
          <span className="beyond-img-error-hint">Unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {!loaded && (
        <div
          className="beyond-img-placeholder"
          style={{ position: "absolute", inset: 0 }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}
      />
    </div>
  );
}
