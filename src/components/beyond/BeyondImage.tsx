"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className={className} style={{ position: "relative" }}>
      {!loaded && (
        <div
          className="beyond-img-placeholder"
          style={{ position: "absolute", inset: 0 }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        quality={80}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </div>
  );
}
