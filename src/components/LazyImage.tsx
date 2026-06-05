import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  fallback?: React.ReactNode;
}

export default function LazyImage({ src, alt, className = '', aspectRatio = '16/9', fallback }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => setLoaded(true);
    const onError = () => setError(true);
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    return () => { img.removeEventListener('load', onLoad); img.removeEventListener('error', onError); };
  }, []);

  return (
    <div className={`relative overflow-hidden bg-[var(--surface-1)] ${className}`} style={{ aspectRatio }}>
      {/* 占位符 shimmer */}
      {!loaded && !error && (
        <div className="absolute inset-0 skeleton" />
      )}
      {/* 图片 */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-400 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* 错误 fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-1)]">
          {fallback || (
            <div className="text-center text-slate-500">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v12A2.25 2.25 0 003.75 21z" />
              </svg>
              <span className="text-xs">加载失败</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
