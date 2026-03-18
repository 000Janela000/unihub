'use client';

interface RoomMiniMapProps {
  highlightSection?: string;
}

/**
 * Exam hall sections:
 * A: 001-069 (yellow)
 * B: 070-132 (green)
 * C: 133-162 (pink)
 * D: 163-186 (green)
 * E: 187-235 (blue)
 * F: 236-281 (red)
 * G: 282-305 (orange)
 */

interface Section {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  range: string;
}

const SECTIONS: Section[] = [
  { id: 'A', x: 4, y: 8, width: 54, height: 48, color: '#FBBF24', label: 'A', range: '001-069' },
  { id: 'B', x: 62, y: 8, width: 54, height: 48, color: '#34D399', label: 'B', range: '070-132' },
  { id: 'C', x: 120, y: 8, width: 36, height: 48, color: '#F472B6', label: 'C', range: '133-162' },
  { id: 'D', x: 4, y: 62, width: 36, height: 48, color: '#34D399', label: 'D', range: '163-186' },
  { id: 'E', x: 44, y: 62, width: 54, height: 48, color: '#60A5FA', label: 'E', range: '187-235' },
  { id: 'F', x: 102, y: 62, width: 54, height: 48, color: '#F87171', label: 'F', range: '236-281' },
  { id: 'G', x: 160, y: 8, width: 34, height: 102, color: '#FB923C', label: 'G', range: '282-305' },
];

export function RoomMiniMap({ highlightSection }: RoomMiniMapProps) {
  const highlighted = highlightSection?.toUpperCase();

  return (
    <svg
      viewBox="0 0 200 120"
      width={200}
      height={120}
      className="rounded-md border border-border bg-muted/30"
      role="img"
      aria-label="Exam hall section map"
    >
      {SECTIONS.map((section) => {
        const isHighlighted = highlighted === section.id;
        const isAnyHighlighted = !!highlighted;
        const opacity = isAnyHighlighted ? (isHighlighted ? 1 : 0.25) : 0.7;

        return (
          <g key={section.id}>
            <rect
              x={section.x}
              y={section.y}
              width={section.width}
              height={section.height}
              rx={4}
              ry={4}
              fill={section.color}
              opacity={opacity}
              stroke={isHighlighted ? 'currentColor' : 'transparent'}
              strokeWidth={isHighlighted ? 2 : 0}
              className={isHighlighted ? 'text-foreground' : ''}
            />
            <text
              x={section.x + section.width / 2}
              y={section.y + section.height / 2 - 4}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={14}
              fontWeight="bold"
              fill={isAnyHighlighted && !isHighlighted ? '#9CA3AF' : '#1F2937'}
              opacity={isAnyHighlighted && !isHighlighted ? 0.5 : 1}
            >
              {section.label}
            </text>
            <text
              x={section.x + section.width / 2}
              y={section.y + section.height / 2 + 10}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={7}
              fill={isAnyHighlighted && !isHighlighted ? '#9CA3AF' : '#374151'}
              opacity={isAnyHighlighted && !isHighlighted ? 0.4 : 0.7}
            >
              {section.range}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
