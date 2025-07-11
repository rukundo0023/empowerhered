import React, { useState, useEffect } from 'react';
import offlineService from '../services/offlineService';

interface OfflineImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  width?: number | string;
  height?: number | string;
}

const OfflineImage: React.FC<OfflineImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder-image.svg',
  onLoad,
  onError,
  loading = 'lazy',
  width,
  height
}) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!src) {
        setImageSrc(fallbackSrc);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);

        // Try to load from offline service
        const cachedImage = await offlineService.loadImage(src);
        
        if (isMounted) {
          setImageSrc(cachedImage);
          setIsLoading(false);
          onLoad?.();
        }
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted) {
          setImageSrc(fallbackSrc);
          setHasError(true);
          setIsLoading(false);
          onError?.();
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src, fallbackSrc, onLoad, onError]);

  const handleImageError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
      onError?.();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={loading}
        width={width}
        height={height}
        onError={handleImageError}
        onLoad={() => {
          setIsLoading(false);
          onLoad?.();
        }}
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-xs text-center">
            <div>Image unavailable</div>
            <div>Offline mode</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineImage; 