import React from 'react';

interface PlatformLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only' | 'light' | 'dark';
  className?: string;
  subtitle?: string;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  subtitle = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-9 h-9', title: 'text-base', sub: 'text-[10px]', en: 'text-[9px]' },
    md: { icon: 'w-11 h-11', title: 'text-lg', sub: 'text-[11px]', en: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', title: 'text-xl', sub: 'text-xs', en: 'text-[11px]' },
    xl: { icon: 'w-20 h-20', title: 'text-2xl', sub: 'text-sm', en: 'text-xs' },
  };

  const currentSize = sizeMap[size];
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Transparent Cropped Zaid Calligraphic Emblem */}
      <div
        className={`relative flex-shrink-0 ${currentSize.icon} flex items-center justify-center`}
      >
        <img
          src="/zaid-logo-mark.png"
          alt="شعار منصة زيد الرقمية"
          className={`w-full h-full object-contain ${
            isLight ? 'brightness-0 invert' : ''
          }`}
        />
      </div>

      {/* Brand Typography */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col text-right leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight whitespace-nowrap ${currentSize.title} ${
                isLight ? 'text-white' : 'text-[#080C3A]'
              }`}
            >
              منصة زيد الرقمية
            </span>
            <span
              className={`font-semibold tracking-widest uppercase ${currentSize.en} ${
                isLight ? 'text-[#C5D0F0]' : 'text-[#111A5E]'
              }`}
            >
              · ZAID
            </span>
          </div>
          {subtitle && (
            <span
              className={`font-normal mt-0.5 ${currentSize.sub} ${
                isLight ? 'text-slate-200' : 'text-slate-500'
              }`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const PlatformWatermark: React.FC<{ subtitle?: string }> = ({
  subtitle = 'نسخة معاينة مجانية — ZAID DIGITAL PLATFORM'
}) => {
  return (
    <div className="watermark" aria-hidden="true">
      <div className="watermark-text">
        <img
          src="/zaid-logo-mark.png"
          alt=""
          className="w-32 h-32 object-contain opacity-[0.09] mb-2 pointer-events-none select-none"
        />
        <b>منصة زيد الرقمية</b>
        <span>{subtitle}</span>
      </div>
    </div>
  );
};

export default PlatformLogo;
