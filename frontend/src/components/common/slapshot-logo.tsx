import Image from 'next/image';
import logo from '@/assets/images/logo/ssc_logo_2.webp';
import { cn } from '@/lib/utils';
import React from 'react';

interface SlapshotLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fetchPriority?: 'high' | 'low' | 'auto';
  alt?: string;
  sizes?: string;
}

export function SlapshotLogo({
  width = 256,
  height = 256,
  className,
  priority = true,
  quality = 85,
  fetchPriority = 'high',
  alt = 'Slapshot Club',
  sizes,
}: SlapshotLogoProps) {
  return (
    <Image
      src={logo}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-contain', className)}
      priority={priority}
      quality={quality}
      fetchPriority={fetchPriority}
      sizes={sizes}
    />
  );
}
