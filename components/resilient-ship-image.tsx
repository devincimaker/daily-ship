"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE_SRC = "/ships/site-preview.png";

type ResilientShipImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function ResilientShipImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: ResilientShipImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [retryNonce, setRetryNonce] = useState(0);
  const [showFallbackPanel, setShowFallbackPanel] = useState(false);

  function handleError() {
    if (imageSrc !== FALLBACK_IMAGE_SRC) {
      setImageSrc(FALLBACK_IMAGE_SRC);
      return;
    }

    setShowFallbackPanel(true);
  }

  function handleRetry() {
    setShowFallbackPanel(false);
    setImageSrc(src);
    setRetryNonce((value) => value + 1);
  }

  if (showFallbackPanel) {
    return (
      <div className="ship-image-fallback" role="status" aria-live="polite">
        <p>Preview unavailable right now.</p>
        <button type="button" className="ship-image-retry" onClick={handleRetry}>
          Retry image
        </button>
      </div>
    );
  }

  return (
    <Image
      key={`${imageSrc}-${retryNonce}`}
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes={sizes}
      onError={handleError}
    />
  );
}
