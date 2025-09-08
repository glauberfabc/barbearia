import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.29 14.29L19.54 19.54" />
      <path d="M10.83 10.83L13.17 13.17" />
      <path d="M12 2L12 5" />
      <path d="M12 19L12 22" />
      <path d="M22 12L19 12" />
      <path d="M5 12L2 12" />
      <path d="M19.07 4.93L17.66 6.34" />
      <path d="M6.34 17.66L4.93 19.07" />
      <path d="M4.93 4.93L6.34 6.34" />
      <path d="M17.66 17.66L19.07 19.07" />
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}
