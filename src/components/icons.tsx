import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
      <path d="M16.24 7.76L12.76 11.24" />
      <path d="M12 2L12 6" />
      <path d="M12 18L12 22" />
      <path d="M22 12L18 12" />
      <path d="M6 12L2 12" />
      <path d="M11.24 12.76L7.76 16.24" />
    </svg>
  );
}
