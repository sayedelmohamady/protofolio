"use client";

import { useRef, useEffect, useState } from "react";

interface BeyondVideoProps {
  src: string;
  className?: string;
  overlayClassName?: string;
}

export function BeyondVideo({
  src,
  className,
  overlayClassName,
}: BeyondVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (error) return null;

  return (
    <div
      className={className}
      style={className ? undefined : { position: "relative" }}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setError(true)}
      />
      {overlayClassName && <div className={overlayClassName} />}
    </div>
  );
}
