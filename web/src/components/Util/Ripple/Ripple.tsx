import { useEffect, useState } from "react";

const Ripple = ({ center = false }: { center?: boolean }) => {
  type RippleType = {
    radius: number;
    size: number;
    x: number;
    y: number;
    id: number;
    activated: number;
    scale: number;
    duration: number;
  };
  const [ripples, setRipples] = useState<RippleType[]>([]);
  // let ripples = [];
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const element = node?.parentNode; //ref.current;

    if (!element) return;

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener("mouseout", handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener("mouseout", handleMouseUp);
    };
  }, []);

  let node = null;
  const createRipple = (event) => {
    node = event.originalTarget;
    if (!node) return;
    if (!node.parentNode) return;

    const rippleSize = Math.max(node.clientWidth, node.clientHeight);
    const duration = Math.sqrt(rippleSize) * 90;

    const localX =
      event.clientX - node.getBoundingClientRect().left - rippleSize / 2;
    const localY =
      event.clientY - node.getBoundingClientRect().top - rippleSize / 2;

    let radius = 0;
    let scale = 0.3;
    scale = 0.15;
    radius = node.clientWidth / 2;
    radius = center
      ? radius
      : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;

    const centerX = (node.clientWidth - radius * 2) / 2;
    const centerY = (node.clientHeight - radius * 2) / 2;

    const x = center ? centerX : localX;
    const y = center ? centerY : localY;
    const newRipple = {
      radius: radius,
      scale: scale,
      size: rippleSize,
      x,
      y,
      id: new Date().getTime(),
      activated: performance.now(),
      duration,
    };
    setRipples((prev) => [...prev, newRipple]);

    ripples.push(newRipple);
  };

  const handleMouseDown = (event) => {
    setMouseDown(true);
    createRipple(event);

    const interval = setInterval(() => {
      if (mouseDown) {
        createRipple(event);
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleMouseUp = (e) => {
    setMouseDown(false);
    const n = e.target;

    if (ripples.length === 0) return;

    ripples.forEach((ripple) => {
      const diff = performance.now() - Number(ripple.activated);
      const delay = Math.max(250 - diff, 0);

      setTimeout(() => {
        let animationElement = document.getElementById(
          `ripple-${ripple.id.toString()}`
        );
        if (!animationElement) {
          return setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
        }

        animationElement.style.animationName = "ripple-animation-hide";
        animationElement.style.animationDuration = "200ms";
        animationElement.style.animationTimingFunction =
          "cubic-bezier(0.4, 0, 0.2, 1)";
        animationElement.style.animationFillMode = "forwards";

        setTimeout(() => {
          if (animationElement && animationElement.parentNode === n) {
            // n.removeChild(animationElement);

            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
          }
        }, 200);
      }, delay);
    });
  };

  return (
    <span
      aria-label="ripple"
      ref={(el) => (node = el)}
      className="absolute inset-0 h-full w-full overflow-hidden rounded-[inherit] z-0"
    >
      {[...new Map(ripples.map((item) => [item["id"], item])).values()].map(
        (ripple) => {
          const style = {
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            transform: `scale(${ripple.scale})`,
            animationName: "ripple-animation",
            animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: ripple.radius ? `${ripple.radius}px` : "50%",
            animationFillMode: "forwards",
            animationDuration: `${ripple.duration}ms`,
            transition: "opacity 0.3s cubic-bezier(0, 0, 0.2, 1), transform 0.3s cubic-bezier(0, 0, 0.2, 1)",
          };

          return (
            <span
              key={ripple.id}
              aria-labelledby="ripple"
              className="pointer-events-none absolute z-0 select-none overflow-hidden bg-white/25"
              id={`ripple-${ripple.id.toString()}`}
              style={{ ...style }}
            />
          );
        }
      )}
    </span>
  );
};

export default Ripple;
