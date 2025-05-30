interface BanknoteSvgProps {
  className?: string
}

export function BanknoteSvg({ className = "" }: BanknoteSvgProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <path d="M6 12h.01M18 12h.01" />
      <g transform="translate(0,-0.04747867)">
        <path
          d="m 8.0269266,15.374299 h 2.8848884 c 1.537341,0 2.685603,-0.427038 3.482743,-1.224179 0.711732,-0.711731 1.091322,-1.622749 1.091322,-2.619174 0,-0.80663 -0.227754,-1.451935 -0.721221,-1.9454026 C 14.261701,9.0825864 13.455071,8.7314647 12.164463,8.7314647 H 9.8110023 Z"
          style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra';stroke-width:1.77933"
        />
      </g>
    </svg>
  )
}

