import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CATEGORY_COLOR_MAP = {
  Student: '#8b5cf6',
  Startup: '#06b6d4',
  Faculty: '#10b981',
  'Somaiya Management': '#f59e0b',
  'VC & Angel investors': '#A20202',
  Other: '#64748b'
};

const FALLBACK_COLORS = [
  '#8b5cf6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#A20202',
  '#ec4899',
  '#64748b'
];

const STANDARD_ROLES = [
  'Student',
  'Startup',
  'Faculty',
  'Somaiya Management',
  'VC & Angel investors'
];

export default function VisitorTypeChart({ data }) {
  const chartBoxRef = React.useRef(null);

  const [box, setBox] = React.useState({
    width: 0,
    height: 0
  });

  /*
   * Measure the actual chart area.
   */
  React.useEffect(() => {
    const element = chartBoxRef.current;

    if (!element) return;

    const measure = () => {
      setBox({
        width: element.clientWidth,
        height: element.clientHeight
      });
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);

      observer.observe(element);

      return () => observer.disconnect();
    }

    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
    };
  }, []);

  /*
   * Convert incoming MongoDB/API data into:
   *
   * Student
   * Startup
   * Faculty
   * Somaiya Management
   * VC & Angel investors
   * Other
   *
   * Standard categories are ALWAYS present,
   * even when their value is 0.
   */
  const processedData = React.useMemo(() => {
    const valueMap = {};

    STANDARD_ROLES.forEach((role) => {
      valueMap[role] = 0;
    });

    let otherValue = 0;

    (data || []).forEach((item) => {
      if (!item) return;

      const name = String(item.name || '').trim();
      const value = Number(item.value) || 0;

      if (!name) return;

      const matchedRole = STANDARD_ROLES.find(
        (role) =>
          role.toLowerCase() === name.toLowerCase()
      );

      if (matchedRole) {
        valueMap[matchedRole] += value;
      } else {
        otherValue += value;
      }
    });

    const result = STANDARD_ROLES.map((role) => ({
      name: role,
      value: valueMap[role]
    }));

    /*
     * Always include Other.
     */
    result.push({
      name: 'Other',
      value: otherValue
    });

    return result;
  }, [data]);

  /*
   * Real total value.
   *
   * 0-value categories are NOT included
   * in percentage calculation.
   */
  const totalVal = React.useMemo(() => {
    return processedData.reduce(
      (total, item) =>
        total +
        Math.max(
          0,
          Number(item.value) || 0
        ),
      0
    );
  }, [processedData]);

  const hasData = totalVal > 0;

  const getColor = (name, index) => {
    return (
      CATEGORY_COLOR_MAP[name] ||
      FALLBACK_COLORS[
        index % FALLBACK_COLORS.length
      ]
    );
  };

  /*
   * ==========================================
   * CUSTOM NUMERIC LABEL
   * ==========================================
   *
   * IMPORTANT:
   * The labels are intentionally kept close
   * to the donut.
   *
   * We DO NOT send the leader lines to the
   * extreme left/right edge of the card.
   */
  const renderCustomLabel = (props) => {
    const {
      cx,
      cy,
      midAngle,
      outerRadius,
      value,
      name,
      fill,
      index
    } = props;

    const numericValue = Number(value) || 0;

    const percent =
      totalVal > 0 && numericValue > 0
        ? (
            (numericValue / totalVal) *
            100
          ).toFixed(1)
        : '0.0';

    const sliceColor =
      fill || getColor(name, index);

    const RADIAN = Math.PI / 180;

    const sin = Math.sin(
      -RADIAN * midAngle
    );

    const cos = Math.cos(
      -RADIAN * midAngle
    );

    const isRight = cos >= 0;

    /*
     * ========================================
     * LABEL DISTANCES
     * ========================================
     *
     * These values control how close the
     * leader line stays to the donut.
     */

    /*
     * Start just outside the donut.
     */
    const startDistance =
      outerRadius + 3;

    /*
     * Short diagonal line.
     */
    const elbowDistance =
      outerRadius + 22;

    /*
     * Short horizontal line.
     *
     * This is the main value controlling
     * the length of the line.
     */
    const horizontalLineLength = 32;

    /*
     * Starting point of leader line.
     */
    const sx =cx + startDistance * cos;

    const sy =
      cy +
      startDistance * sin;

    /*
     * Elbow point.
     */
    const mx =
      cx +
      elbowDistance * cos;

    let my =
      cy +
      elbowDistance * sin;

    /*
     * Keep label inside chart vertically.
     */
    const chartHeight =
      box.height || 280;

    my = Math.max(
      12,
      Math.min(
        chartHeight - 12,
        my
      )
    );

    /*
     * ========================================
     * DOT POSITION
     * ========================================
     */

    const dotX = isRight
      ? mx + horizontalLineLength
      : mx - horizontalLineLength;

    /*
     * Gap between dot and numeric text.
     */
    const textGap = 6;

    const tx = isRight
      ? dotX + textGap
      : dotX - textGap;

    const textAnchor = isRight
      ? 'start'
      : 'end';

    return (
      <g
        style={{
          pointerEvents: 'none'
        }}
      >
        {/* ================================
            SHORT LEADER LINE
            ================================ */}
        <path
          d={`
            M ${sx},${sy}
            L ${mx},${my}
            L ${dotX},${my}
          `}
          stroke={sliceColor}
          strokeWidth={1.4}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ================================
            DOT
            ================================ */}
        <circle
          cx={dotX}
          cy={my}
          r={2.5}
          fill={sliceColor}
        />

        {/* ================================
            NUMERIC VALUE
            ================================ */}
        <text
          x={tx}
          y={my}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fill="#0f172a"
          style={{
            fontSize: '8.5px',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}
        >
          {`${percent}% (${numericValue})`}
        </text>
      </g>
    );
  };

  return (
    <div
      style={{
        background: '#ffffff',

        border: '1px solid #000000',

        borderRadius: '8px',

        padding:
          '0.65rem 0.7rem',

        display: 'flex',

        flexDirection: 'column',

        width: '100%',

        minWidth: 0,

        boxSizing: 'border-box',

        boxShadow:
          '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* ====================================
          TITLE
          ==================================== */}

      <h4
        style={{
          margin:
            '0 0 0.15rem 0',

          fontSize: '0.85rem',

          fontWeight: 800,

          color:
            'var(--text-primary)',

          textTransform:
            'uppercase',

          letterSpacing:
            '0.02em'
        }}
      >
        New Visitors by Category ("I Am")
      </h4>

      {/* ====================================
          NO DATA
          ==================================== */}

      {!hasData ? (
        <div
          style={{
            height: '260px',

            display: 'flex',

            alignItems: 'center',

            justifyContent:
              'center',

            color:
              'var(--text-secondary)',

            fontSize: '0.8rem'
          }}
        >
          No category data available.
        </div>
      ) : (
        <div
          ref={chartBoxRef}
          style={{
            width: '100%',

            height: '280px',

            minWidth: 0,

            position: 'relative'
          }}
        >
          {/* ==================================
              PIE CHART
              ================================== */}

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart
              margin={{
                top: 2,
                right: 2,
                bottom: 4,
                left: 0
              }}
            >
              <Pie
                data={processedData}

                cx="50%"

                cy="50%"

                /*
                 * Donut size.
                 */
                innerRadius="28%"

                outerRadius="43%"

                paddingAngle={1.5}

                dataKey="value"

                /*
                 * Custom numeric labels.
                 */
                label={renderCustomLabel}

                labelLine={false}

                activeShape={false}

                isAnimationActive={false}

                style={{
                  pointerEvents:
                    'none'
                }}

                /*
                 * Keep very small categories
                 * visible.
                 */
                minAngle={3}
              >
                {processedData.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColor(
                        entry.name,
                        index
                      )}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  )
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* ==================================
              CATEGORY LEGEND
              ================================== */}

          <div
            style={{
              position: 'absolute',

              right: '3px',

              top: '50%',

              transform:
                'translateY(-50%)',

              display: 'flex',

              flexDirection:
                'column',

              gap: '0.42rem',

              maxWidth: '32%',

              maxHeight: '92%',

              overflowY: 'auto',

              paddingLeft: '3px'
            }}
          >
            {processedData.map(
              (entry, index) => {
                const color =
                  getColor(
                    entry.name,
                    index
                  );

                return (
                  <div
                    key={entry.name}
                    style={{
                      display: 'flex',

                      alignItems:
                        'flex-start',

                      gap: '0.4rem',

                      minWidth: 0
                    }}
                  >
                    {/* Colored dot */}

                    <span
                      style={{
                        width: '7px',

                        height: '7px',

                        minWidth: '7px',

                        marginTop: '3px',

                        borderRadius:
                          '50%',

                        backgroundColor:
                          color
                      }}
                    />

                    {/* Category name */}

                    <span
                      style={{
                        color,

                        fontSize:
                          '0.66rem',

                        fontWeight: 700,

                        lineHeight: 1.2,

                        whiteSpace:
                          'normal',

                        overflowWrap:
                          'anywhere'
                      }}
                    >
                      {entry.name}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}