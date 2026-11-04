// Leaf positions along the branch: [x, y, rotation in degrees].
const leaves = [
  [17, 40, -55],
  [12, 33, -35],
  [9, 25, -20],
  [8, 17, -5],
  [10, 9, 15],
  [20, 35, 60],
  [16, 27, 45],
  [14, 19, 35],
  [14, 11, 30],
];

export default function Laurel({ flip = false }) {
  return (
    <svg
      viewBox="0 0 28 48"
      aria-hidden="true"
      className={`h-12 w-7 shrink-0 fill-gold text-gold ${flip ? "-scale-x-100" : ""}`}
    >
      <path
        d="M22 46 C10 38 8 22 13 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, rotation]) => (
        <ellipse
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          rx="1.7"
          ry="4"
          transform={`rotate(${rotation} ${x} ${y})`}
        />
      ))}
    </svg>
  );
}