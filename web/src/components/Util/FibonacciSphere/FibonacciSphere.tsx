class FibonacciCircle {
  #points;

  get points() {
    return this.#points;
  }

  constructor(N) {
    this.#points = [];

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y ** 2);
      const a = goldenAngle * i;
      const x = Math.cos(a) * radius;
      const z = Math.sin(a) * radius;

      this.#points.push([x, y, z]);
    }
  }
}
const FibonacciSphere = ({
  vertices,
  text,
}: {
  vertices?: number;
  text?: string[];
}) => {
  let points = new FibonacciCircle(vertices ? vertices : text.length).points;
  var rotationAxis = [1, 0, 0];
  let rotationAngle = 0;
  let size = 1.5;
  const sin = Math.sin(rotationAngle);
  const cos = Math.cos(rotationAngle);
  const ux = rotationAxis[0];
  const uy = rotationAxis[1];
  const uz = rotationAxis[2];
  const rotationMatrix = [
    [
      cos + ux ** 2 * (1 - cos),
      ux * uy * (1 - cos) - uz * sin,
      ux * uz * (1 - cos) + uy * sin,
    ],
    [
      uy * ux * (1 - cos) + uz * sin,
      cos + uy ** 2 * (1 - cos),
      uy * uz * (1 - cos) - ux * sin,
    ],
    [
      uz * ux * (1 - cos) - uy * sin,
      uz * uy * (1 - cos) + ux * sin,
      cos + uz ** 2 * (1 - cos),
    ],
  ];
  for (let i = 0; i < points.length; i++) {
    const x = points[i][0];
    const y = points[i][1];
    const z = points[i][2];

    const transformedX =
      rotationMatrix[0][0] * x +
      rotationMatrix[0][1] * y +
      rotationMatrix[0][2] * z;
    const transformedY =
      rotationMatrix[1][0] * x +
      rotationMatrix[1][1] * y +
      rotationMatrix[1][2] * z;
    const transformedZ =
      rotationMatrix[2][0] * x +
      rotationMatrix[2][1] * y +
      rotationMatrix[2][2] * z;

    const translateX = (size * transformedX) / 2;
    const translateY = (size * transformedY) / 2;
    const scale = (transformedZ + 2) / 3;
    const opacity = (transformedZ + 1.5) / 2.5;

    points[i][0] = translateX;
    points[i][1] = translateY;
    points[i].push(scale);
    points[i].push(opacity);
  }
  return (
    <div className="relative">
      <svg viewBox="-1 -1 2 2" style={{ width: "100%", height: "100%" }}>
        <g>
          {points.map((point, i) => (
            <text
              key={i}
              x={point[0]}
              y={point[1]}
              fill="black"
              fontSize={0.1}
              opacity={point[6]}
              scale={point[5]}
              textAnchor="middle"
            >
              {text ? text[i] : i}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default FibonacciSphere;
