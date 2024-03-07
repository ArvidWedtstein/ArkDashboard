
import type {
  FindMapResourcesByMap,
  UpdateMapResourceInput,
  UpdateMapResourceMutation,
  permission,
} from 'types/graphql'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Table from 'src/components/Util/Table/Table';
import Button, { ButtonGroup } from 'src/components/Util/Button/Button';
import { ArrayElement, groupBy } from 'src/lib/formatters';
import Popper from 'src/components/Util/Popper/Popper';
import ClickAwayListener from 'src/components/Util/ClickAwayListener/ClickAwayListener';
import List, { ListItem } from 'src/components/Util/List/List';
import { useAuth } from 'src/auth';
import { useMutation } from '@redwoodjs/web';
import { toast } from '@redwoodjs/web/dist/toast';
import Toast from 'src/components/Util/Toast/Toast';
import { Dialog, DialogActions, DialogContent, DialogTitle } from 'src/components/Util/Dialog/Dialog';
import MapResourceForm from '../MapResourceForm/MapResourceForm';


const CREATE_MAP_RESOURCE_MUTATION = gql`
  mutation CreateMapResourceMutation($input: CreateMapResourceInput!) {
    createMapResource(input: $input) {
      id
    }
  }
`

const UPDATE_MAP_RESOURCE_MUTATION = gql`
  mutation UpdateMapResourceMutation(
    $id: BigInt!
    $input: UpdateMapResourceInput!
  ) {
    updateMapResource(id: $id, input: $input) {
      id
      created_at
      updated_at
      map_id
      item_id
      latitude
      longitude
      type
    }
  }
`

const DELETE_MAP_RESOURCE_MUTATION = gql`
  mutation DeleteMapResourceMutation($id: BigInt!) {
    deleteMapResource(id: $id) {
      id
    }
  }
`

const MapResourcesList = ({ mapResources, itemsByCategory }: FindMapResourcesByMap) => {
  const posToMap = (coord: number): number => {
    return (500 / 100) * coord + 500 / 100;
  };

  type Point = {
    x: number;
    y: number;
  };
  const ORIGIN = Object.freeze({ x: 0, y: 0 });
  const ZOOM_SENSITIVITY = 100; // bigger for lower zoom per scroll


  const { currentUser } = useAuth();

  const [anchorRef, setAnchorRef] = useState<{
    element: HTMLButtonElement | null;
    map_resource: ArrayElement<FindMapResourcesByMap["mapResources"]>;
    open: boolean;
    open_dialog: boolean;
  }>({ element: null, map_resource: null, open: false, open_dialog: false });

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
    canvas.addEventListener("click", handleClick)
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let img = new Image(500, 500)
    img.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/TheIsland-Map.webp`
    ctx.drawImage(img, 0, 0, 500, 500);
    ctx.strokeStyle = "red";
    ctx.fillStyle = "white";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);


    mapResources.map((mapResource) => {
      ctx.beginPath();
      ctx.arc(posToMap(mapResource.longitude), posToMap(mapResource.latitude), 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });

    return () => {
      canvas.removeEventListener("click", handleClick);
    }
  }, [])

  // Map Resource Edit Stuff

  const handleClose = (event: React.MouseEvent<Document>) => {
    if (
      anchorRef?.element &&
      anchorRef.element.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setAnchorRef({ element: null, open: false, map_resource: null, open_dialog: false });
  };

  const [createMapResource, { loading: createLoading, error: createError, reset: createReset }] = useMutation(
    CREATE_MAP_RESOURCE_MUTATION,
    {
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const [updateMapResource, { loading: updateLoading, error: updateError, reset: updateReset }] = useMutation(
    UPDATE_MAP_RESOURCE_MUTATION,
    {
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const [deleteMapResource, { loading: deleteLoading, error: deleteError, reset: deleteReset }] = useMutation(
    DELETE_MAP_RESOURCE_MUTATION,
    {
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const handleDialogClose = () => {
    setAnchorRef({ open: false, open_dialog: false, map_resource: null, element: null });
    createReset();
    updateReset();
    deleteReset();
  }

  const onSave = (
    input: UpdateMapResourceInput,
    id: UpdateMapResourceMutation["updateMapResource"]['id']
  ) => {
    setAnchorRef({ open: false, open_dialog: false, map_resource: null, element: null });

    toast.promise(id ? updateMapResource({ variables: { id, input } }) : createMapResource({ variables: { input } }), {
      loading: `${id ? 'Updating' : 'Creating new'} Map Resource...`,
      success: `Map Resource successfully ${id ? 'updated' : 'created'}`,
      error: `Failed to ${id ? 'update' : 'create'} Map Resource.`,
    })
  }


  return (
    <div className="rw-segment">
      <Dialog open={anchorRef.open_dialog} onClose={handleDialogClose}>
        <DialogTitle>{anchorRef?.map_resource ? 'Edit' : 'New'} Map Resource</DialogTitle>
        <DialogContent dividers>
          <MapResourceForm
            mapResource={anchorRef.map_resource}
            itemsByCategory={itemsByCategory}
            onSave={onSave}
            error={createError || updateError || deleteError}
            loading={createLoading || updateLoading || deleteLoading}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup>
            <Button
              type="reset"
              color="secondary"
              variant="outlined"
              onClick={handleDialogClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="success"
              variant="contained"
              onClick={() => document.forms["form-map-resource"].requestSubmit()}
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="pointer-events-none"
                  fill="currentColor"
                >
                  <path d="M350.1 55.44C334.9 40.33 314.9 32 293.5 32H80C35.88 32 0 67.89 0 112v288C0 444.1 35.88 480 80 480h288c44.13 0 80-35.89 80-80V186.5c0-21.38-8.312-41.47-23.44-56.58L350.1 55.44zM96 64h192v96H96V64zM416 400c0 26.47-21.53 48-48 48h-288C53.53 448 32 426.5 32 400v-288c0-20.83 13.42-38.43 32-45.05V160c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32V72.02c2.664 1.758 5.166 3.771 7.438 6.043l74.5 74.5C411 161.6 416 173.7 416 186.5V400zM224 240c-44.13 0-80 35.89-80 80s35.88 80 80 80s80-35.89 80-80S268.1 240 224 240zM224 368c-26.47 0-48-21.53-48-48S197.5 272 224 272s48 21.53 48 48S250.5 368 224 368z" />
                </svg>
              }
            >
              Save
            </Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>

      <div className='flex space-x-1'>
        <div className='relative'>
          <div id="canvastip" className='invisible text-sm inline-flex justify-center items-center absolute text-white z-10 rounded bg-zinc-600 ring-1 ring-inset ring-zinc-500 p-1' />
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

        <Table
          className='w-full'
          columns={[
            {
              field: 'Item', sortable: true, header: 'Item', valueFormatter: ({ value }) => value["name"], render: ({ value, row }) => (
                <span className='inline-flex space-x-3'>
                  <img
                    src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/${row.Item.image}`}
                    loading="lazy"
                    className="h-5 w-5"
                  />
                  <span>{value}</span>
                </span>
              )
            },
            { field: 'amount', sortable: true, header: 'Amount' },
          ]}
          rows={Object.entries(groupBy(mapResources, 'item_id')).map(([_, item_resources]) => ({
            ...item_resources[0],
            amount: item_resources.length,
            collapseContent: (
              <div className="flex flex-col items-start justify-center">
                <Table
                  className='w-full'
                  rows={item_resources}
                  settings={{
                    pagination: {
                      enabled: true,
                      pageSizeOptions: [5, 10]
                    }
                  }}
                  columns={[
                    { field: 'latitude', header: 'Coordinates', valueFormatter: ({ value, row }) => `${value}, ${row.longitude}` },
                    { field: 'type', sortable: true, header: 'Type' },
                    {
                      field: 'id', header: 'Action', render: ({ row }) => {
                        return (
                          <Button
                            size="small"
                            variant="icon"
                            color="DEFAULT"
                            onClick={(e) => {
                              setAnchorRef((prev) => ({
                                element: e.currentTarget || e.target as HTMLButtonElement,
                                open: !prev.open,
                                map_resource: row,
                                open_dialog: false,
                              }))
                            }}
                          >
                            <svg
                              className="w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                              fill="currentColor"
                            >
                              <path d="M120 256c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm160 0c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56zm104 56c-30.9 0-56-25.1-56-56s25.1-56 56-56s56 25.1 56 56s-25.1 56-56 56z" />
                            </svg>
                          </Button>
                        )
                      }
                    },
                  ]}
                />
              </div>
            ),
          }))}
          toolbar={[
            <Button
              color="success"
              onClick={() => setAnchorRef({
                open: false,
                map_resource: null,
                open_dialog: true,
                element: null,
              })}
              permission="gamedata_create"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              }
              className="grow whitespace-nowrap"
            >
              New Resource
            </Button>
          ]}
          settings={{
            search: true,
            filter: true,
            pagination: {
              enabled: true,
              pageSizeOptions: [5, 10]
            }
          }}
        />
      </div>

      <Popper anchorEl={anchorRef?.element} open={anchorRef.open}>
        <ClickAwayListener onClickAway={handleClose}>
          <div
            className="min-h-[16px] min-w-[16px] rounded bg-white text-black drop-shadow-xl dark:bg-neutral-900 dark:text-white"
          >
            <List>
              {currentUser?.permissions?.some(
                (p: permission) => p === "gamedata_update"
              ) && (
                  <ListItem
                    size="small"
                    className="hover:bg-white/10"
                    onClick={() => setAnchorRef((prev) => ({ open_dialog: true, open: false, element: null, map_resource: prev.map_resource }))}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="inline-block h-4 w-4 shrink-0 select-none fill-current"
                        focusable="false"
                      >
                        <path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" />
                      </svg>
                    }
                  >
                    Edit
                  </ListItem>
                )}
              {currentUser?.permissions?.some(
                (p: permission) => p === "gamedata_delete"
              ) && (
                  <ListItem
                    size="small"
                    className="hover:bg-white/10"
                    onClick={() => toast.custom(
                      (t) => (
                        <Toast
                          t={t}
                          title={`You are about to delete mapResource`}
                          message={`Are you sure you want to delete mapResource?`}
                          actionType="YesNo"
                          primaryAction={() => deleteMapResource({ variables: { id: anchorRef?.map_resource?.id } })}
                        />
                      ),
                      { position: 'top-center' }
                    )}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="inline-block h-4 w-4 shrink-0 select-none fill-current"
                        focusable="false"
                      >
                        <path d="M432 64h-96l-33.63-44.75C293.4 7.125 279.1 0 264 0h-80c-15.1 0-29.4 7.125-38.4 19.25L112 64H16C7.201 64 0 71.2 0 80c0 8.799 7.201 16 16 16h416c8.801 0 16-7.201 16-16 0-8.8-7.2-16-16-16zm-280 0l19.25-25.62C174.3 34.38 179 32 184 32h80c5 0 9.75 2.375 12.75 6.375L296 64H152zm248 64c-8.8 0-16 7.2-16 16v288c0 26.47-21.53 48-48 48H112c-26.47 0-48-21.5-48-48V144c0-8.8-7.16-16-16-16s-16 7.2-16 16v288c0 44.1 35.89 80 80 80h224c44.11 0 80-35.89 80-80V144c0-8.8-7.2-16-16-16zM144 416V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16zm96 0V192c0-8.844-7.156-16-16-16s-16 7.2-16 16v224c0 8.844 7.156 16 16 16s16-7.2 16-16z" />
                      </svg>
                    }
                  >
                    Delete
                  </ListItem>
                )}
            </List>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  )
}

export default MapResourcesList
