import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/MapResource/MapResourcesCell'
import { timeTag, truncate } from 'src/lib/formatters'
import Toast from 'src/components/Util/Toast/Toast'

import type {
  FindMapResourcesByMap,
} from 'types/graphql'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const MapResourcesList = ({ mapResources }: FindMapResourcesByMap) => {
  const posToMap = (coord: number): number => {
    return (500 / 100) * coord + 500 / 100;
  };

  type Point = {
    x: number;
    y: number;
  };
  const ORIGIN = Object.freeze({ x: 0, y: 0 });
  const ZOOM_SENSITIVITY = 500; // bigger for lower zoom per scroll

  const ref = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<Point>(ORIGIN);
  const [mousePos, setMousePos] = useState<Point>(ORIGIN);
  const [viewportTopLeft, setViewportTopLeft] = useState<Point>(ORIGIN);
  const isResetRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<Point>(ORIGIN);
  const lastOffsetRef = useRef<Point>(ORIGIN);

  const { devicePixelRatio: ratio = 1 } = window;

  function diffPoints(p1: Point, p2: Point) {
    return { x: p1.x - p2.x, y: p1.y - p2.y };
  }

  function addPoints(p1: Point, p2: Point) {
    return { x: p1.x + p2.x, y: p1.y + p2.y };
  }

  function scalePoint(p1: Point, scale: number) {
    return { x: p1.x / scale, y: p1.y / scale };
  }
  useEffect(() => {
    lastOffsetRef.current = offset;
  }, [offset]);

  const reset = useCallback(
    (context: CanvasRenderingContext2D) => {
      if (context && !isResetRef.current) {
        // adjust for device pixel density
        context.canvas.width = 500 * ratio;
        context.canvas.height = 500 * ratio;
        context.scale(ratio, ratio);
        setScale(1);

        // reset state and refs
        setContext(context);
        setOffset(ORIGIN);
        setMousePos(ORIGIN);
        setViewportTopLeft(ORIGIN);
        lastOffsetRef.current = ORIGIN;
        lastMousePosRef.current = ORIGIN;

        // this thing is so multiple resets in a row don't clear canvas
        isResetRef.current = true;
      }
    },
    []
  );

  // functions for panning
  const mouseMove = useCallback(
    (event: MouseEvent) => {
      if (context) {
        const lastMousePos = lastMousePosRef.current;
        const currentMousePos = { x: event.pageX, y: event.pageY }; // use document so can pan off element
        lastMousePosRef.current = currentMousePos;

        const mouseDiff = diffPoints(currentMousePos, lastMousePos);
        setOffset((prevOffset) => addPoints(prevOffset, mouseDiff));
      }
    },
    [context]
  );

  const mouseUp = useCallback(() => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  }, [mouseMove]);

  const startPan = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
      lastMousePosRef.current = { x: event.pageX, y: event.pageY };
    },
    [mouseMove, mouseUp]
  );

  useLayoutEffect(() => {
    if (ref.current) {
      // get new drawing context
      const renderCtx = ref.current.getContext("2d");

      if (renderCtx) {
        reset(renderCtx);
      }
    }
  }, [reset]);

  // pan when offset or scale changes
  useLayoutEffect(() => {
    if (context && lastOffsetRef.current) {
      const offsetDiff = scalePoint(
        diffPoints(offset, lastOffsetRef.current),
        scale
      );
      context.translate(offsetDiff.x, offsetDiff.y);
      setViewportTopLeft((prevVal) => diffPoints(prevVal, offsetDiff));
      isResetRef.current = false;
    }
  }, [context, offset, scale]);


  // draw
  useLayoutEffect(() => {
    if (context) {
      const squareSize = 20;
      // clear canvas but maintain transform
      const storedTransform = context.getTransform();
      context.canvas.width = context.canvas.width;
      context.setTransform(storedTransform);
      let img = new Image(500, 500)
      img.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheIsland-Map.webp`
      context.drawImage(img, 0, 0, 500, 500);
      mapResources.forEach((mapResource) => {
        context.beginPath();
        context.arc(posToMap(mapResource.longitude), posToMap(mapResource.latitude), Math.min(Math.max(scale, 1), 5), 0, 2 * Math.PI);
        context.fill();
        context.stroke();
      });
    }
  }, [
    context,
    scale,
    offset
  ]);

  // add event listener on canvas for mouse position
  useEffect(() => {
    const canvasElem = ref.current;
    if (canvasElem === null) {
      return;
    }

    function handleUpdateMouse(event: MouseEvent) {
      event.preventDefault();
      if (ref.current) {
        const viewportMousePos = { x: event.clientX, y: event.clientY };
        const topLeftCanvasPos = {
          x: ref.current.offsetLeft,
          y: ref.current.offsetTop
        };
        setMousePos(diffPoints(viewportMousePos, topLeftCanvasPos));
      }
    }



    canvasElem.addEventListener("mousemove", handleUpdateMouse);
    canvasElem.addEventListener("wheel", handleUpdateMouse);
    return () => {
      canvasElem.removeEventListener("mousemove", handleUpdateMouse);
      canvasElem.removeEventListener("wheel", handleUpdateMouse);
    };
  }, []);

  // add event listener on canvas for zoom
  useEffect(() => {
    const canvasElem = ref.current;
    if (canvasElem === null) {
      return;
    }

    // this is tricky. Update the viewport's "origin" such that
    // the mouse doesn't move during scale - the 'zoom point' of the mouse
    // before and after zoom is relatively the same position on the viewport
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      if (context) {
        const zoom = 1 - event.deltaY / ZOOM_SENSITIVITY;
        const viewportTopLeftDelta = {
          x: (mousePos.x / scale) * (1 - 1 / zoom),
          y: (mousePos.y / scale) * (1 - 1 / zoom)
        };
        const newViewportTopLeft = addPoints(
          viewportTopLeft,
          viewportTopLeftDelta
        );

        context.translate(viewportTopLeft.x, viewportTopLeft.y);
        context.scale(zoom, zoom);
        context.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

        setViewportTopLeft(newViewportTopLeft);
        setScale(scale * zoom);
        isResetRef.current = false;
      }
    }

    canvasElem.addEventListener("wheel", handleWheel);
    return () => canvasElem.removeEventListener("wheel", handleWheel);
  }, [context, mousePos.x, mousePos.y, viewportTopLeft, scale]);

  const handleClick = (e: MouseEvent) => {
    const canvas = ref.current;
    const tip = document.getElementById("canvastip");
    const canvasBounds = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasBounds.left;
    const mouseY = e.clientY - canvasBounds.top;

    let hit = false;
    mapResources.forEach((mapResource) => {
      const x = posToMap(mapResource.longitude);
      const y = posToMap(mapResource.latitude);

      const dx = mouseX - x;
      const dy = mouseY - y;
      if (dx * dx + dy * dy < 4 * 4) {
        hit = true;

        if (tip && mapResource.Item) {
          // create image
          const img = document.createElement("img");
          img.src = "https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/" + mapResource?.Item.image;
          img.width = 32;
          img.height = 32;
          img.classList.add("inline-block", "mr-2");

          // create text
          const text = document.createElement("span");
          text.innerText = mapResource.Item.name;
          text.classList.add("inline-block", "align-middle");

          // add to tip
          tip.innerHTML = "";
          tip.appendChild(img);
          tip.appendChild(text);


          tip.style.left = x + "px";
          tip.style.top = (y - 40) + "px";
          tip.classList.toggle("invisible", false)

        }
      }
    });
    if (!hit) { tip.classList.toggle("invisible", false) }
  }

  useEffect(() => {
    const canvas = ref.current;
    // canvas.addEventListener("click", handleClick)
    // const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // let img = new Image(500, 500)
    // img.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheIsland-Map.webp`
    // ctx.drawImage(img, 0, 0, 500, 500);
    // ctx.strokeStyle = "red";
    // ctx.fillStyle = "white";
    // ctx.strokeRect(0, 0, canvas.width, canvas.height);


    // mapResources.map((mapResource) => {
    //   ctx.beginPath();
    //   ctx.arc(posToMap(mapResource.longitude), posToMap(mapResource.latitude), 4, 0, 2 * Math.PI);
    //   ctx.fill();
    //   ctx.stroke();
    // });

    return () => {
      // canvas.removeEventListener("click", handleClick);
    }
  }, [])


  return (
    <div className="rw-segment">
      <div className='relative'>
        <div id="canvastip" className='invisible text-sm inline-flex justify-center items-center absolute text-white z-10 rounded bg-zinc-600 ring-1 ring-inset ring-zinc-500 p-1'>
        </div>
        <canvas
          className='relative z-0'
          ref={ref}
          width={500}
          height={500}
          onMouseDown={startPan}
          style={{
            border: "2px solid #000",
            width: `500px`,
            height: `500px`
          }}
        />
      </div>
    </div>
  )
}

export default MapResourcesList
