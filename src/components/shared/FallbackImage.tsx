"use client";

import NextImage, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { useSettingsStore } from "@/stores/settings";
import { fixImageUrl } from "@/lib/utils";

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
  
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const rawSrc = hasError ? (fallbackSrc || logoPlaceholder) : (src || logoPlaceholder);
  const finalSrc = fixImageUrl(typeof rawSrc === 'string' ? rawSrc : '');

  return (
    <NextImage
      {...props}
      src={finalSrc || logoPlaceholder}
      alt={alt}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
