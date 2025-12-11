import { useMemo, useState } from "react";

type Label = "majority" | "minority";
type Source = "original" | "synthetic";

type Sample = {
  id: string;
  x: number;
  y: number;
  label: Label;
  source: Source;
};

export default function Page() {
  const [neighborCount, setNeighborCount] = useState(4);
  const [balanceRatio, setBalanceRatio] = useState(1);

  const baseData = useMemo(() => createToyDataset(), []);
  const majorityCount = baseData.filter((s) => s.label === "majority").length;
  const targetMinorityCount = Math.round(majorityCount * balanceRatio);

  const balancedData = useMemo(
    () =>
      smoteBalance({
        data: baseData,
        targetMinorityCount,
        k: neighborCount,
      }),
    [baseData, neighborCount, targetMinorityCount],
  );

  const minorityCount = baseData.length - majorityCount;
  const syntheticCount = balancedData.filter(
    (s) => s.source === "synthetic",
  ).length;

  return (
    <div className="grid gap-16">
      <section className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Why SMOTE?</p>
            <h2>Unbalanced vs balanced datasets</h2>
            <p className="lede">
              The original dataset is intentionally imbalanced (few minority
              samples). SMOTE synthesizes new minority points between nearest
              neighbors to close the gap while keeping the feature space
              structure intact.
            </p>
          </div>
          <Controls
            neighborCount={neighborCount}
            onNeighborChange={setNeighborCount}
            balanceRatio={balanceRatio}
            onBalanceRatioChange={setBalanceRatio}
          />
        </div>
        <StatsRow
          originalMinority={minorityCount}
          originalMajority={majorityCount}
          balancedMinority={targetMinorityCount}
          syntheticCount={syntheticCount}
        />
      </section>

      <section className="grid visual-grid">
        <PlotCard
          title="Original (imbalanced)"
          subtitle={`${majorityCount} majority vs ${minorityCount} minority samples`}
          data={baseData}
        />
        <PlotCard
          title="After SMOTE (balanced)"
          subtitle={`${majorityCount} majority vs ${targetMinorityCount} minority samples`}
          data={balancedData}
        />
      </section>
    </div>
  );
}

function Controls({
  neighborCount,
  onNeighborChange,
  balanceRatio,
  onBalanceRatioChange,
}: {
  neighborCount: number;
  onNeighborChange: (value: number) => void;
  balanceRatio: number;
  onBalanceRatioChange: (value: number) => void;
}) {
  return (
    <div className="controls">
      <div className="control">
        <label htmlFor="neighbors">SMOTE neighbors (k)</label>
        <div className="control__input">
          <input
            id="neighbors"
            type="range"
            min={2}
            max={6}
            step={1}
            value={neighborCount}
            onChange={(e) => onNeighborChange(Number(e.target.value))}
          />
          <span>{neighborCount}</span>
        </div>
        <p className="control__hint">
          Higher k averages over more minority neighbors for each synthetic
          sample.
        </p>
      </div>

      <div className="control">
        <label htmlFor="ratio">Target minority / majority</label>
        <div className="control__input">
          <input
            id="ratio"
            type="range"
            min={0.5}
            max={1.2}
            step={0.1}
            value={balanceRatio}
            onChange={(e) => onBalanceRatioChange(Number(e.target.value))}
          />
          <span>{balanceRatio.toFixed(1)}x</span>
        </div>
        <p className="control__hint">
          1.0 = balance to parity. Increase to oversample minority slightly.
        </p>
      </div>
    </div>
  );
}

function StatsRow({
  originalMinority,
  originalMajority,
  balancedMinority,
  syntheticCount,
}: {
  originalMinority: number;
  originalMajority: number;
  balancedMinority: number;
  syntheticCount: number;
}) {
  return (
    <div className="stats">
      <StatCard
        label="Original class counts"
        value={`${originalMajority} majority / ${originalMinority} minority`}
      />
      <StatCard
        label="Target minority after SMOTE"
        value={`${balancedMinority} samples`}
      />
      <StatCard
        label="Synthetic points generated"
        value={`${syntheticCount}`}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
    </div>
  );
}

function PlotCard({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Sample[];
}) {
  return (
    <div className="panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">{title}</p>
          <h3>{subtitle}</h3>
        </div>
        <Legend />
      </div>
      <ScatterPlot data={data} />
    </div>
  );
}

function Legend() {
  return (
    <div className="legend">
      <LegendItem color="#0ea5e9" label="Majority (original)" />
      <LegendItem color="#f97316" label="Minority (original)" />
      <LegendItem
        color="#fb923c"
        label="Minority (synthetic)"
        dashed
      />
    </div>
  );
}

function LegendItem({
  color,
  label,
  dashed,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <div className="legend__item">
      <span
        className="legend__swatch"
        style={{
          backgroundColor: dashed ? "transparent" : color,
          border: dashed ? `2px dashed ${color}` : `2px solid ${color}`,
        }}
      />
      <span>{label}</span>
    </div>
  );
}

function ScatterPlot({ data }: { data: Sample[] }) {
  const width = 520;
  const height = 360;
  const padding = 24;

  const [minX, maxX, minY, maxY] = useMemo(() => {
    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.y);
    return [
      Math.min(...xs) - 0.5,
      Math.max(...xs) + 0.5,
      Math.min(...ys) - 0.5,
      Math.max(...ys) + 0.5,
    ];
  }, [data]);

  const xScale = (x: number) =>
    padding +
    ((x - minX) / Math.max(maxX - minX, 1e-3)) * (width - padding * 2);
  const yScale = (y: number) =>
    height -
    padding -
    ((y - minY) / Math.max(maxY - minY, 1e-3)) * (height - padding * 2);

  return (
    <div className="plot">
      <svg width={width} height={height} role="img" aria-label="Scatter plot">
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={14}
          fill="#ffffff"
          stroke="#e2e8f0"
        />
        <g stroke="#e2e8f0" strokeWidth={1}>
          <line
            x1={padding}
            x2={width - padding}
            y1={height - padding}
            y2={height - padding}
          />
          <line
            x1={padding}
            x2={padding}
            y1={padding}
            y2={height - padding}
          />
        </g>
        {data.map((point) => {
          const isMinority = point.label === "minority";
          const isSynthetic = point.source === "synthetic";
          const color = isMinority ? "#f97316" : "#0ea5e9";
          const radius = isSynthetic ? 6 : 7.5;

          return (
            <g key={point.id}>
              {isSynthetic ? (
                <circle
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r={radius + 3}
                  fill="none"
                  stroke={color}
                  strokeDasharray="5 3"
                  strokeWidth={2}
                  opacity={0.8}
                />
              ) : null}
              <circle
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={radius}
                fill={color}
                stroke={isSynthetic ? color : "#0f172a"}
                strokeWidth={isSynthetic ? 0 : 1}
                opacity={isSynthetic ? 0.7 : 0.95}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function createToyDataset(): Sample[] {
  const majority: Sample[] = [
    { id: "m1", x: 1.1, y: 1.2, label: "majority", source: "original" },
    { id: "m2", x: 1.4, y: 1.5, label: "majority", source: "original" },
    { id: "m3", x: 1.3, y: 1.9, label: "majority", source: "original" },
    { id: "m4", x: 1.6, y: 2.2, label: "majority", source: "original" },
    { id: "m5", x: 1.8, y: 1.8, label: "majority", source: "original" },
    { id: "m6", x: 2.1, y: 2.1, label: "majority", source: "original" },
    { id: "m7", x: 2.2, y: 1.7, label: "majority", source: "original" },
    { id: "m8", x: 2.4, y: 1.4, label: "majority", source: "original" },
    { id: "m9", x: 2.7, y: 1.9, label: "majority", source: "original" },
    { id: "m10", x: 2.6, y: 2.4, label: "majority", source: "original" },
    { id: "m11", x: 2.9, y: 2.1, label: "majority", source: "original" },
    { id: "m12", x: 3.0, y: 1.6, label: "majority", source: "original" },
    { id: "m13", x: 3.1, y: 2.5, label: "majority", source: "original" },
    { id: "m14", x: 3.4, y: 1.9, label: "majority", source: "original" },
    { id: "m15", x: 3.5, y: 2.3, label: "majority", source: "original" },
  ];

  const minority: Sample[] = [
    { id: "mi1", x: 4.4, y: 3.7, label: "minority", source: "original" },
    { id: "mi2", x: 4.6, y: 3.4, label: "minority", source: "original" },
    { id: "mi3", x: 4.7, y: 3.9, label: "minority", source: "original" },
    { id: "mi4", x: 4.9, y: 3.5, label: "minority", source: "original" },
  ];

  return [...majority, ...minority];
}

function smoteBalance({
  data,
  targetMinorityCount,
  k,
}: {
  data: Sample[];
  targetMinorityCount: number;
  k: number;
}): Sample[] {
  const minority = data.filter((d) => d.label === "minority");
  const majority = data.filter((d) => d.label === "majority");

  if (minority.length < 2 || targetMinorityCount <= minority.length) {
    return data;
  }

  const synthetic: Sample[] = [];
  const needed = targetMinorityCount - minority.length;

  for (let i = 0; i < needed; i++) {
    const anchor = minority[i % minority.length];
    const neighbors = nearestNeighbors(anchor, minority, k);
    const neighbor = neighbors[i % neighbors.length];
    const gap = Math.random();

    synthetic.push({
      id: `synth-${i}`,
      label: "minority",
      source: "synthetic",
      x: anchor.x + gap * (neighbor.x - anchor.x),
      y: anchor.y + gap * (neighbor.y - anchor.y),
    });
  }

  return [...majority, ...minority, ...synthetic];
}

function nearestNeighbors(point: Sample, pool: Sample[], k: number): Sample[] {
  const sorted = pool
    .filter((p) => p.id !== point.id)
    .map((candidate) => ({
      candidate,
      distance: distance(point, candidate),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, Math.max(k, 1))
    .map((entry) => entry.candidate);

  return sorted.length > 0 ? sorted : pool;
}

function distance(a: Sample, b: Sample): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}
