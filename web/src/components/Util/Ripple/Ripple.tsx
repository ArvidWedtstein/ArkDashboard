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
  }
  const [ripples, setRipples] = useState<RippleType[]>([]);
  // let ripples = [];
  const [mouseDown, setMouseDown] = useState(false);



  useEffect(() => {
    const element = node?.parentNode;//ref.current;

    if (!element) return console.log('no element use');

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseup", handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseup", handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);



  let duration = 600;
  let node = null;
  const createRipple = (event) => {
    node = event.originalTarget;
    if (!node) return
    if (!node.parentNode) return


    let localX = 0
    let localY = 0
    const rippleSize = Math.max(node.clientWidth, node.clientHeight);
    localX = event.clientX - node.getBoundingClientRect().left - rippleSize / 2;
    localY = event.clientY - node.getBoundingClientRect().top - rippleSize / 2;

    let radius = 0
    let scale = 0.3
    scale = 0.15
    radius = node.clientWidth / 2
    radius = center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4


    const centerX = (node.clientWidth - (radius * 2)) / 2
    const centerY = (node.clientHeight - (radius * 2)) / 2

    const x = center ? centerX : localX
    const y = center ? centerY : localY
    const newRipple = {
      radius: radius,
      scale: scale,
      size: rippleSize,
      x: x,
      y: y,
      id: new Date().getTime(),
      activated: performance.now(),
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

    if (ripples.length === 0) return

    ripples.forEach((ripple) => {
      const diff = performance.now() - Number(ripple.activated);
      const delay = Math.max(250 - diff, 0);

      setTimeout(() => {
        let animationElement = document.getElementById(`ripple-${ripple.id.toString()}`);
        if (!animationElement) {
          return setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
        }

        animationElement.style.animationName = "ripple-animation-hide";
        animationElement.style.animationDuration = "200ms";
        animationElement.style.animationTimingFunction = "cubic-bezier(0.4, 0, 0.2, 1)";
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
      ref={(el) => (node = el)}
      className="w-full h-full absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      {[...new Map(ripples.map(item =>
        [item['id'], item])).values()].map((ripple) => {
          const style = {
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            transform: `scale(${ripple.scale})`,
            animationName: 'ripple-animation',
            animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            borderRadius: ripple.radius ? `${ripple.radius}px` : '50%',
            animationFillMode: "forwards",
            animationDuration: `${duration}ms`,
            transition: 'opacity transform 0.3s cubic-bezier(0, 0, 0.2, 1)',
          };

          return <span key={ripple.id} aria-label="ripple" className="pointer-events-none bg-white/25 select-none absolute overflow-hidden z-0" id={`ripple-${ripple.id.toString()}`} style={{ ...style }} />
        })}
    </span>
  );
}

export default Ripple
