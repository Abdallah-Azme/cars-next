"use client";

import NextImage, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/stores/settings";

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc,
  ...props
}: FallbackImageProps) {
  const settings = useSettingsStore((state) => state.settings);
  const logoPlaceholder = settings?.siteLogo || "/logo-icon.jpeg";
  
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const finalSrc = hasError ? (fallbackSrc || logoPlaceholder) : (imgSrc || logoPlaceholder);

  return (
    <NextImage
      {...props}
      src={finalSrc}
      alt={alt}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
