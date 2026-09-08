export default function Logo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      <rect width="64" height="64" rx="18" fill="#DC2626" />
      <circle
        cx="26"
        cy="34"
        r="14"
        fill="white"
        stroke="#7F1D1D"
        strokeWidth="1.5"
      />
      <path
        d="M26 25.5L30.2 28.6L28.6 33.6H23.4L21.8 28.6L26 25.5Z"
        fill="#0F172A"
      />
      <path
        d="M26 20V25.5M26 42.5V37.5M12 34H17.5M34.5 34H40M17 25L20.5 28.5M31.5 39.5L35 43M35 25L31.5 28.5M20.5 39.5L17 43"
        stroke="#0F172A"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <rect
        x="38"
        y="16"
        width="15"
        height="19"
        rx="2.5"
        transform="rotate(14 38 16)"
        fill="#FACC15"
        stroke="#7F1D1D"
        strokeWidth="1.2"
      />
      <text
        x="50"
        y="47"
        textAnchor="middle"
        fontSize="15"
        fontWeight="800"
        fill="white"
        fontFamily="sans-serif"
      >
        €
      </text>
    </svg>
  );
}
