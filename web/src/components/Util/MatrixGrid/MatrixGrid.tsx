import { HTMLAttributes, forwardRef, useEffect, useMemo, useRef } from "react";
import { SimplexNoise3D } from "src/lib/formatters";

type MatrixProps = {
  fps?: number;
  rows?: number;
  seed?: number;
  boxFill?: string;
  gridFill?: string;
} & HTMLAttributes<HTMLCanvasElement>
const MatrixGrid = forwardRef((props: MatrixProps, ref) => {
  const {
    fps = 30,
    rows = 10,
    seed = 321,
    boxFill = '0, 0, 241',
    gridFill = '241, 241, 241',
    ...other
  } = props;
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const canvasRef = useMemo(() => {
    if ([canvasElement, ref].every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      [canvasElement, ref].forEach((ref) => {
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      });
    };
  }, [canvasElement, ref]);

  useEffect(() => {
    if (canvasElement.current) {
      const interval = 1000 / fps; // fps
      const noiseStr = 10;
      const simplex = new SimplexNoise3D(seed);

      const ctx = canvasElement.current.getContext("2d");
      const grids = [];

      class Grid {
        index: number;
        rowCount: number;
        ex: number;
        ey: number;
        size: number;
        boxSize: number;
        sx: number;
        sy: number;
        x: number;
        y: number;
        noise: number;
        sizePercent: number;
        constructor(index, rowCount) {
          this.index = index;
          this.rowCount = rowCount;

          this.ex = this.index % this.rowCount;
          this.ey = Math.floor(this.index / this.rowCount);
        }
        resize(canvasWidth, canvasHeight) {
          const minSize = Math.min(canvasWidth, canvasHeight);
          this.size = minSize / this.rowCount;
          this.boxSize = this.size * (0.3 + 0.7 * this.noise);

          this.sx = canvasWidth / 2 - minSize / 2;
          this.sy = canvasHeight / 2 - minSize / 2;

          this.x = this.sx + this.ex * this.size;
          this.y = this.sy + this.ey * this.size;
        }
        update(simplex: SimplexNoise3D, noiseStr, time) {
          this.noise =
            (simplex.noise(this.ex / noiseStr, this.ey / noiseStr, time) + 1) /
            2;
          this.sizePercent = 0.1 + 0.89 * this.noise;
          this.boxSize = this.size * this.sizePercent;
        }
        draw(ctx) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(${gridFill}, 1)`;
          ctx.fillStyle = `rgba(25, 25, 25, 1)`;
          ctx.fillRect(this.x, this.y, this.size, this.size);
          ctx.strokeRect(this.x, this.y, this.size, this.size);

          ctx.fillStyle = `rgba(${boxFill}, ${this.sizePercent})`;
          ctx.fillRect(this.x, this.y, this.boxSize, this.boxSize);
        }
      }

      const render = () => {
        let now, delta;
        let then = Date.now();
        function frame(timestamp) {
          requestAnimationFrame(frame);
          now = Date.now();
          delta = now - then;
          if (delta < interval) return;
          then = now - (delta % interval);

          ctx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);

          ctx.save();
          ctx.translate(canvasElement.current.width, canvasElement.current.height);
          ctx.rotate(Math.PI);

          grids.forEach((grid) => {
            grid.resize(canvasElement.current.width, canvasElement.current.height);
            grid.update(simplex, noiseStr, timestamp * 0.0005);
            grid.draw(ctx);
          });

          ctx.restore();
        }
        requestAnimationFrame(frame);
      }

      for (let index = 0; index < Math.pow(rows, 2); index++) {
        const grid = new Grid(index, rows);
        grids.push(grid);
      }

      render();
    }
  }, []);

  return (
    <div className="relative w-40">

      <canvas className="w-full h-full" ref={canvasRef} {...other} />
    </div>
  )
})

export default MatrixGrid
