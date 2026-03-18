"use client";

import NextImage, { ImageProps } from "next/image";
import { useState } from "react";
import { fixImageUrl } from "@/lib/utils";

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
  DEFAULT?: string;
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc,
  DEFAULT = "/logo-icon.jpeg",
  ...props
}: FallbackImageProps) {
  const resolvedSrc = typeof src === "string" && src
    ? (fixImageUrl(src) || src)
    : DEFAULT;

  const [errored, setErrored] = useState(false);
  const [prevSrc, setPrevSrc] = useState(resolvedSrc);

  // Reset error when src changes (derived state update during render)
  if (resolvedSrc !== prevSrc) {
    setPrevSrc(resolvedSrc);
    setErrored(false);
  }

  const displaySrc = errored ? (fallbackSrc || DEFAULT) : resolvedSrc;

  return (
    <NextImage
      {...props}
      src={displaySrc}
      alt={alt}
      onError={() => setErrored(true)}
    />
  );
}
