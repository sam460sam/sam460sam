import React from "react";

type P = { size?: number; color?: string; stroke?: number };
const S: React.FC<P & { children: React.ReactNode }> = ({ size = 40, color = "currentColor", stroke = 2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const IconBolt: React.FC<P> = (p) => <S {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></S>;
export const IconPhone: React.FC<P> = (p) => <S {...p}><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></S>;
export const IconSearch: React.FC<P> = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></S>;
export const IconPin: React.FC<P> = (p) => <S {...p}><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></S>;
export const IconCall: React.FC<P> = (p) => <S {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></S>;
export const IconWrench: React.FC<P> = (p) => <S {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z" /></S>;
export const IconFlame: React.FC<P> = (p) => <S {...p}><path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7Z" /></S>;
export const IconDrop: React.FC<P> = (p) => <S {...p}><path d="M12 2.7S5 10 5 15a7 7 0 0 0 14 0c0-5-7-12.3-7-12.3Z" /></S>;
export const IconCheck: React.FC<P> = (p) => <S {...p}><path d="m5 12 5 5L20 7" /></S>;
export const IconPlane: React.FC<P> = (p) => <S {...p}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></S>;
export const IconMenu: React.FC<P> = (p) => <S {...p}><path d="M4 7h16M4 12h16M4 17h16" /></S>;
