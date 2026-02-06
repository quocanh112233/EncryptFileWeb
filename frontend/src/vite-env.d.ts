/// <reference types="vite/client" />

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    strokeWidth?: string | number;
    color?: string;
    className?: string;
  }
  export type Icon = FC<IconProps>;
  
  // Previously used
  export const Upload: Icon;
  export const FileText: Icon;
  export const CheckCircle: Icon;
  export const Copy: Icon;
  export const ShieldCheck: Icon;
  export const Lock: Icon;
  export const Unlock: Icon;
  export const Key: Icon;
  export const Search: Icon;
  export const RefreshCw: Icon;
  export const Download: Icon;

  // Newly used
  export const Shield: Icon;
  export const FileKey: Icon;
}
