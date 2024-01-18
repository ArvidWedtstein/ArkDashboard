import { useAuth } from "src/auth";
import {
  ArrayElement,
  dynamicSort,
  groupBy,
} from "src/lib/formatters";

import type { DeleteMapRegionMutationVariables, FindMapRegionsByMap, UpdateMapRegionInput, UpdateMapRegionMutation, permission } from "types/graphql";
import { useEffect, useMemo, useState } from "react";
import Table from "src/components/Util/Table/Table";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import Popper from "src/components/Util/Popper/Popper";
import ClickAwayListener from "src/components/Util/ClickAwayListener/ClickAwayListener";
import List, { ListItem } from "src/components/Util/List/List";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "src/components/Util/Dialog/Dialog";
import MapRegionForm from "../MapRegionForm/MapRegionForm";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import Toast from "src/components/Util/Toast/Toast";

const CREATE_MAP_REGION_MUTATION = gql`
  mutation CreateMapRegionMutation($input: CreateMapRegionInput!) {
    createMapRegion(input: $input) {
      id
    }
  }
`

const UPDATE_MAP_REGION_MUTATION = gql`
  mutation UpdateMapRegionMutation(
    $id: BigInt!
    $input: UpdateMapRegionInput!
  ) {
    updateMapRegion(id: $id, input: $input) {
      id
      created_at
      updated_at
      name
      map_id
      wind
      temperature
      priority
      outside
      start_x
      start_y
      start_z
      end_x
      end_y
      end_z
    }
  }
`

const DELETE_MAP_REGION_MUTATION = gql`
  mutation DeleteMapRegionMutation($id: BigInt!) {
    deleteMapRegion(id: $id) {
      id
    }
  }
`;

const MapRegionsList = ({ mapRegionsByMap, map }: FindMapRegionsByMap) => {
  const [anchorRef, setAnchorRef] = useState<{
    element: HTMLButtonElement | null;
    map_region: ArrayElement<FindMapRegionsByMap["mapRegionsByMap"]>;
    open: boolean;
    open_dialog: boolean;
  }>({ element: null, map_region: null, open: false, open_dialog: false });

  const { currentUser } = useAuth();

  let canvasWidth = 500;
  let canvasHeight = 500;
  const posToMap = (coord: number): number => {
    return (canvasHeight / 100) * coord + canvasWidth / 100;
  };

  const LatLon = (x: number, y: number) => {
    return {
      lat:
        y / map.cord_mult_lat +
        map.cord_shift_lat,
      lon:
        x / map.cord_mult_lon +
        map.cord_shift_lon,
    };
  };
  /**
   * Coord to lat lon
   *
   * Latitude corresponds to the Y coordinate, and Longitude corresponds to X.
   * To convert the Lat/Long map coordinates to UE coordinates, simply subtract the shift value, and multiply by the right multiplier from the following table.
   *
   *
   */
  const groupedRegions = useMemo(() => {
    const regions = groupBy(mapRegionsByMap, "name");
    return Object.keys(regions).map((key) => {
      return {
        name: key,
        regions: regions[key],
      };
    });
  }, [])

  interface Point {
    x: number;
    y: number;
  }
  interface Rectangle {
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
  }
  /**
   *
   * @param start
   * @param end
   * @example <caption>Example usage of calculateCorners.</caption>
   * // returns { topLeft: { x: 0, y: 0 }, topRight: { x: 10, y: 0 }, bottomLeft: { x: 0, y: 10 }, bottomRight: { x: 10, y: 10 } }
   * calculateCorners({ x: 0, y: 0 }, { x: 10, y: 10 });
   *
   * @returns  {Rectangle} coordinates
   */
  const calculateCorners = (start: Point, end: Point): Rectangle => {
    const topLeft: Point = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
    };

    const topRight: Point = {
      x: Math.max(start.x, end.x),
      y: Math.min(start.y, end.y),
    };

    const bottomLeft: Point = {
      x: Math.min(start.x, end.x),
      y: Math.max(start.y, end.y),
    };

    const bottomRight: Point = {
      x: Math.max(start.x, end.x),
      y: Math.max(start.y, end.y),
    };

    return {
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    };
  };

  const isInside = (lat: number, lon: number) => {
    return groupedRegions.map((group) => {
      if (group.regions.some((mapRegion) => {
        const corners = calculateCorners({ x: mapRegion.start_x, y: mapRegion.start_y }, { x: mapRegion.end_x, y: mapRegion.end_y })

        const pos1 = LatLon(corners.topLeft.x, corners.topLeft.y)
        const pos2 = LatLon(corners.topRight.x, corners.topRight.y)
        const pos3 = LatLon(corners.bottomLeft.x, corners.bottomLeft.y)
        const pos4 = LatLon(corners.bottomRight.x, corners.bottomRight.y)

        return (
          lat > Math.min(pos1.lat, pos2.lat, pos3.lat, pos4.lat) &&
          lat < Math.max(pos1.lat, pos2.lat, pos3.lat, pos4.lat) &&
          lon > Math.min(pos1.lon, pos2.lon, pos3.lon, pos4.lon) &&
          lon < Math.max(pos1.lon, pos2.lon, pos3.lon, pos4.lon)
        )
      })) {
        return group
      }
    }).filter((region) => region !== undefined).flat();
  };
  useEffect(() => {
    const canvas = document.getElementById("map") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    const onMouseMove = (e: MouseEvent) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lat = (e.offsetY / 500) * 100;
      const lon = (e.offsetX / 500) * 100;

      const regionsInside = isInside(lat, lon).sort((a, b) => a.regions[0].priority - b.regions[0].priority)


      if (regionsInside.length === 0 || regionsInside.some(d => d.regions.length === 0)) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "blur(4px)";
      ctx.fillStyle = "rgba(255,0,0,0.5)";


      ctx.lineJoin = "miter";
      ctx.lineWidth = 1
      const path = new Path2D();
      regionsInside[0].regions.forEach((mapRegion, i) => {

        const corners = calculateCorners({ x: mapRegion.start_x, y: mapRegion.start_y }, { x: mapRegion.end_x, y: mapRegion.end_y })

        const pos1 = LatLon(corners.topLeft.x, corners.topLeft.y)
        const pos2 = LatLon(corners.topRight.x, corners.topRight.y)
        const pos3 = LatLon(corners.bottomLeft.x, corners.bottomLeft.y)
        const pos4 = LatLon(corners.bottomRight.x, corners.bottomRight.y)

        path.addPath(new Path2D(`M${posToMap(pos1.lon)} ${posToMap(pos1.lat)} L${posToMap(pos2.lon)} ${posToMap(pos2.lat)} L${posToMap(pos4.lon)} ${posToMap(pos4.lat)} L${posToMap(pos3.lon)} ${posToMap(pos3.lat)} L${posToMap(pos1.lon)} ${posToMap(pos1.lat)} Z`))
      });
      // ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.fill(path, "nonzero");
      // ctx.stroke(path);

      ctx.filter = "blur(0px)"
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.font = "24px arial";
      ctx.fillText(regionsInside[0].name, 5, 25);
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    ctx.globalCompositeOperation = "source-over";
    dynamicSort(mapRegionsByMap, "priority").forEach((mapRegion) => {
      const start = LatLon(mapRegion.start_x, mapRegion.start_y);
      const end = LatLon(mapRegion.end_x, mapRegion.end_y);
      // ctx.beginPath();

      // if (mapRegion.name.includes("Lava Cave")) {
      //   const corners = calculateCorners({ x: mapRegion.start_x, y: mapRegion.start_y }, { x: mapRegion.end_x, y: mapRegion.end_y })

      //   const pos1 = LatLon(corners.topLeft.x, corners.topLeft.y)
      //   const pos2 = LatLon(corners.topRight.x, corners.topRight.y)
      //   const pos3 = LatLon(corners.bottomLeft.x, corners.bottomLeft.y)
      //   const pos4 = LatLon(corners.bottomRight.x, corners.bottomRight.y)

      //   ctx.moveTo(posToMap(pos1.lon), posToMap(pos1.lat));
      //   ctx.lineTo(posToMap(pos2.lon), posToMap(pos2.lat));
      //   ctx.lineTo(posToMap(pos4.lon), posToMap(pos4.lat));
      //   ctx.lineTo(posToMap(pos3.lon), posToMap(pos3.lat));
      //   ctx.lineTo(posToMap(pos1.lon), posToMap(pos1.lat));
      //   ctx.fillStyle = `rgba(${mapRegion.name.includes("water") ? 0 : 255},0,${mapRegion.name.includes("water") ? 255 : 0
      //     },${mapRegion.priority / 1000})`;
      //   ctx.fill();
      // }
      // ctx.moveTo(posToMap(start.lon), posToMap(start.lat));
      // ctx.lineTo(posToMap(end.lon), posToMap(start.lat));
      // ctx.lineTo(posToMap(end.lon), posToMap(end.lat));
      // ctx.lineTo(posToMap(start.lon), posToMap(end.lat));
      // ctx.lineTo(posToMap(start.lon), posToMap(start.lat));
      // ctx.strokeStyle = mapRegion.name.includes("water") ? "blue" : "red";

      // ctx.fillStyle = `rgba(${mapRegion.name.includes("water") ? 0 : 255},0,${
      //   mapRegion.name.includes("water") ? 255 : 0
      // },${mapRegion.priority / 1000})`;
      // ctx.fill();

      // ctx.stroke();
    });

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", () => {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    };
  }, []);

  const handleClose = (event: React.MouseEvent<Document>) => {
    if (
      anchorRef?.element &&
      anchorRef.element.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setAnchorRef({ element: null, open: false, map_region: null, open_dialog: false });
  };

  // MapRegion Create / Update / Delete
  const [createMapRegion, { reset: createReset }] = useMutation(
    CREATE_MAP_REGION_MUTATION,
    {
      onCompleted: () => {
        setAnchorRef({ open: false, open_dialog: false, map_region: null, element: null });
        createReset();
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const [updateMapRegion, { loading, error, reset: updateReset }] = useMutation(
    UPDATE_MAP_REGION_MUTATION,
    {
      onCompleted: () => {
        setAnchorRef({ open: false, open_dialog: false, map_region: null, element: null });
        updateReset();
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const [deleteMapRegion, { reset: deleteReset }] = useMutation(DELETE_MAP_REGION_MUTATION, {
    onCompleted: () => {
      setAnchorRef({ open: false, open_dialog: false, map_region: null, element: null });
      deleteReset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteMapRegionMutationVariables["id"]) => {
    toast.custom(
      (t) => (
        <Toast
          t={t}
          title={`You are about to delete map region`}
          message={`Are you sure you want to delete map region?`}
          actionType="YesNo"
          primaryAction={() => deleteMapRegion({ variables: { id } })}
        />
      ),
      { position: "top-center" }
    );
  };

  const onSave = (
    input: UpdateMapRegionInput,
    id: UpdateMapRegionMutation["updateMapRegion"]['id']
  ) => {
    setAnchorRef({ open: false, open_dialog: false, map_region: null, element: null });

    toast.promise(id ? updateMapRegion({ variables: { id, input } }) : createMapRegion({ variables: { input } }), {
      loading: `${id ? 'Updating' : 'Creating new'} MapRegion...`,
      success: `MapRegion successfully ${id ? 'updated' : 'created'}`,
      error: `Failed to ${id ? 'update' : 'create'} MapRegion.`,
    })
  }

  const handleDialogClose = () => {
    setAnchorRef({ open: false, open_dialog: false, map_region: null, element: null });
    createReset();
    updateReset();
    deleteReset();
  }


  return (
    <div className="rw-segment">
      <Dialog open={anchorRef.open_dialog} onClose={handleDialogClose}>
        <DialogTitle>{anchorRef?.map_region ? 'Edit' : 'New'} Map Region</DialogTitle>
        <DialogContent dividers>
          <MapRegionForm
            mapRegion={anchorRef.map_region}
            onSave={onSave}
            error={error}
            loading={loading}
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
              onClick={() => document.forms["form-map-region"].requestSubmit()}
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

      <div className="flex space-x-1">
        <div className="relative">
          <img
            className="absolute top-0 left-0 bottom-0 w-[500px] h-[500px] -z-10"
            onError={(e) => e.currentTarget.src = `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map?.img}`}
            src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map?.topographic_img}`}
            alt=""
            decoding="async"
          />
          <canvas id="map" width={500} height={500} className="relative" />
        </div>

        <Table
          columns={[
            { field: 'name', sortable: true, header: 'Name' },
            { field: 'wind', sortable: true, header: 'Wind' },
            { field: 'temperature', header: 'Temperature' },
            { field: 'start_x', header: 'Start (Lat, Lon)', valueFormatter: ({ value, row }) => `${LatLon(value, row.start_y).lat.toFixed(1)}, ${LatLon(value, row.start_y).lon.toFixed(1)}` },
            { field: 'end_x', header: 'End (Lat, Lon)', valueFormatter: ({ value, row }) => `${LatLon(value, row.end_y).lat.toFixed(1)}, ${LatLon(value, row.end_y).lon.toFixed(1)}` },
            {
              field: "id", header: 'Action', render: ({ row }) => {
                return (
                  <Button
                    size="small"
                    variant="icon"
                    color="DEFAULT"
                    onClick={(e) => {
                      setAnchorRef((prev) => ({
                        element: e.currentTarget || e.target as HTMLButtonElement,
                        open: !prev.open,
                        map_region: row,
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
            }
          ]}
          rows={mapRegionsByMap}
          toolbar={[
            <Button
              color="success"
              onClick={() => setAnchorRef({
                open: false,
                map_region: null,
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
              New Region
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
                    onClick={(e) => setAnchorRef((prev) => ({ open_dialog: true, open: false, element: null, map_region: prev.map_region }))}
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
                    onClick={() => onDeleteClick(anchorRef?.map_region?.id)}
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
  );
};

export default MapRegionsList;
