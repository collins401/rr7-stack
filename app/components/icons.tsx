import { SVGProps } from "react";
export const Logo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="50" height="50" {...props} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="40"
        y="40"
        width="120"
        height="120"
        fill="none"
        stroke="#2563eb"
        strokeWidth="8"
        rx="15"
      />
      <path
        d="M60 80 L140 80 M60 120 L140 120"
        stroke="#60a5fa"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <rect x="85" y="85" width="30" height="30" transform="rotate(45 100 100)" fill="#3b82f6" />
    </svg>
  );
};
