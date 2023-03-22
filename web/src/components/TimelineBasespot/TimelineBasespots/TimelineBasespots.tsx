import { Link, routes } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { useEffect, useRef } from "react";

import { QUERY } from "src/components/TimelineBasespot/TimelineBasespotsCell";
import { arrRandNoRep, jsonTruncate, timeTag, truncate } from "src/lib/formatters";

import type {
  DeleteTimelineBasespotMutationVariables,
  FindTimelineBasespots,
} from "types/graphql";

const DELETE_TIMELINE_BASESPOT_MUTATION = gql`
  mutation DeleteTimelineBasespotMutation($id: BigInt!) {
    deleteTimelineBasespot(id: $id) {
      id
    }
  }
`;

const TimelineBasespotsList = ({
  timelineBasespots,
}: FindTimelineBasespots) => {
  const [deleteTimelineBasespot] = useMutation(
    DELETE_TIMELINE_BASESPOT_MUTATION,
    {
      onCompleted: () => {
        toast.success("TimelineBasespot deleted");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      // This refetches the query on the list page. Read more about other ways to
      // update the cache over here:
      // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
      refetchQueries: [{ query: QUERY }],
      awaitRefetchQueries: true,
    }
  );

  const onDeleteClick = (id: DeleteTimelineBasespotMutationVariables["id"]) => {
    if (
      confirm("Are you sure you want to delete timelineBasespot " + id + "?")
    ) {
      deleteTimelineBasespot({ variables: { id } });
    }
  };


  useEffect(() => {
    const imageTrack: any = document.getElementById('image-track');
    const handleOnDown = e => imageTrack.dataset.mouseDownAt = parseFloat(e.clientX);

    const handleOnUp = () => {
      imageTrack.dataset.mouseDownAt = "0";
      imageTrack.dataset.prevPercentage = imageTrack.dataset.percentage;
    }

    const handleOnMove = e => {
      if (imageTrack.dataset.mouseDownAt === "0") return;
      const mouseDelta = parseFloat(imageTrack.dataset.mouseDownAt) - parseFloat(e.clientX),
        maxDelta = Number(imageTrack.clientWidth) / 2;

      const percentage = (Number(mouseDelta) / Number(maxDelta)) * -100,
        nextPercentageUnconstrained = parseFloat(imageTrack.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

      imageTrack.dataset.percentage = nextPercentage;

      imageTrack.animate({
        transform: `translate(${nextPercentage}%, -50%)`
      }, { duration: 1200, fill: "forwards" });

      for (const image of imageTrack.getElementsByClassName("image")) {
        image.animate({
          backgroundPosition: `${100 + nextPercentage}% center`
        }, { duration: 1200, fill: "forwards" });
      }
    }
    window.onmousedown = e => handleOnDown(e);

    window.ontouchstart = e => handleOnDown(e.touches[0]);

    window.onmouseup = e => handleOnUp();

    window.ontouchend = (e: any) => handleOnUp();

    window.onmousemove = e => handleOnMove(e);

    window.ontouchmove = e => handleOnMove(e.touches[0]);
  }, []);

  const mapImages = {
    2: ["https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/62a15c04-bef2-45a2-a06a-c984d81c3c0b/dd391pu-a40aaf7b-b8e7-4d6d-b49d-aa97f4ad61d0.jpg"],
    3: ["https://cdn.akamai.steamstatic.com/steam/apps/473850/ss_f13c4990d4609d3fc89174f71858835a9f09aaa3.1920x1080.jpg?t=1508277712"],
    7: ["https://wallpapercave.com/wp/wp10504822.jpg"],
    4: [
      "https://cdn.survivetheark.com/uploads/monthly_2016_10/large.580b5a9c3b586_Ragnarok02.jpg.6cfa8b30a81187caace6fecc1e9f0c31.jpg",
      "https://survivetheark.com/index.php?/gallery/image/20889-ragnarok/&do=download",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJJmqrzhtbVQJCChwuL510y_vCKfy1XIHCnQ&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBdPB6lPmw7GEpebf9vKTd7pESyh1NZUuSw&usqp=CAU"
    ],
    5: [
      "https://cdn.images.express.co.uk/img/dynamic/143/590x/ARK-Survival-Evolved-849382.jpg",
      "https://i.ytimg.com/vi/JD2pw7olqTI/maxresdefault.jpg",
      "https://mcdn.wallpapersafari.com/medium/11/10/HqzA26.jpg",
      "https://external-preview.redd.it/kNGv5THQAMo1KkSV0kh3rb3zVkv1sQ5JfcVhxYQU3M8.png?format=pjpg&auto=webp&s=b586ca457104b002c9f132e84dcc8819236d6d40",
      "https://cdn.survivetheark.com/uploads/monthly_2018_01/large.ARK-Wallpaper-Aberration-Flowers_by_pollti_1024x576.jpg.ccd6f6278b7e536b56095df031fbac12.jpg"
    ],
    6: ["https://cdn.cloudflare.steamstatic.com/steam/apps/887380/ss_3c2c1d7c027c8beb54d2065afe3200e457c2867c.1920x1080.jpg?t=1594677636"],
    1: [
      "https://i.pinimg.com/originals/0b/95/09/0b9509ddce658e3209ece1957053b27e.jpg",
      "https://pbs.twimg.com/media/D9h39iwX4AUrWAh.jpg:large",
      "https://i.redd.it/du3kqr863aa31.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFKZIiTnhO5yYY1yA15nQ2UnH3W-v-PU9Mfw&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Zs3mrwKB_uGiZns4R7I8iZ8gpzMtWJ1EFA&usqp=CAU"
    ],
    8: ["https://cdn.akamai.steamstatic.com/steam/apps/1646700/ss_c939dd546237cba9352807d4deebd79c4e29e547.1920x1080.jpg?t=1622514386"],
    10: [
      "https://cdn2.unrealengine.com/egs-crystalislesarkexpansionmap-studiowildcard-dlc-g1a-05-1920x1080-119682147.jpg?h=720&resize=1&w=1280",
      "https://c4.wallpaperflare.com/wallpaper/218/915/795/video-games-cherry-blossom-ark-survival-evolved-ark-wallpaper-preview.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJttddzy4YQO0hWYTvFKrPU2GARZOP-0UwSw&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmcFNjX9A0w07KkV3pTfnpMl_uIGTqq0nphQ&usqp=CAU",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsx3FELejosNBI5QQGgC_sr9i5bfOcrTho5g&usqp=CAU"
    ],
    11: ["https://cdn.cloudflare.steamstatic.com/steam/apps/1887560/ss_331869adb5f0c98e3f13b48189e280f8a0ba1616.1920x1080.jpg?t=1655054447"],
    12: [
      "https://dicendpads.com/wp-content/uploads/2021/12/Ark-Lost-Island.png",
      "https://c4.wallpaperflare.com/wallpaper/745/402/370/ark-survival-evolved-video-games-the-island-sunlight-jungle-wallpaper-preview.jpg",
      "https://c4.wallpaperflare.com/wallpaper/958/368/11/video-game-ark-survival-evolved-ark-survival-evolved-jungle-wallpaper-thumb.jpg"
    ],
    9: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1646720/ss_5cad67b512285163143cfe21513face50c0a00f6.1920x1080.jpg?t=1622744444",
      "https://wallpapercave.com/wp/wp9285176.png",
      "https://cdn.survivetheark.com/images/gen2/wallpaper/ARK_Genesis2_Promo_Canoe.jpg",
      "https://wallpapercave.com/wp/wp6293505.png",
      "https://wallpapercave.com/wp/wp6293166.jpg",
      "https://wallpapercave.com/wp/wp9285339.jpg"
    ],
  };
  const servers = {
    "eliteark": "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
    "bloodyark": "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
    "arkosic": "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
  }
  return (
    <div className="rw-segment relative">
      <section className="rw-segment h-[40rem]">
        <div style={{ transform: 'translate(0%, -50%)' }} className="min-w-[100vw] h-full left-1/2 top-1/2 flex flex-row items-stretch absolute cursor-grab select-none space-x-3 p-3 will-change-scroll touch-pan-x overflow-x-auto" id="image-track" data-mouse-down-at="0" data-prev-percentage="0">
          {timelineBasespots.sort((a, b) => (new Date((a.startDate as any)) as any) - (new Date((b.startDate as any)) as any)).map((timelineBasespot, i) => (
            <div
              key={i}
              aria-controls={`tab-${i}`}
              className="flex flex-col min-w-[50vmin] flex-1 image object-cover transition-all duration-300 blur-sm hover:blur-none rounded"
              draggable="false"
              style={{
                backgroundImage: `url(${arrRandNoRep(mapImages[timelineBasespot.map])})`,
                backgroundSize: "cover",
                objectPosition: "100% center"
              }}
            >
              <div className="flex flex-col items-start m-4 p-4 bg-gray-800 bg-opacity-60 rounded text-stone-200 my-auto">
                <p className="text-xl font-bold uppercase">
                  {timelineBasespot.tribeName}
                </p>
                <hr className="bg-gray-150 mb-2 h-[1px] w-full rounded border-0 dark:bg-stone-200"></hr>
                <div className="relative flex flex-row space-y-1">
                  <div className="mt-3 flex flex-row items-center space-x-6">
                    <div className="flex flex-col items-start">
                      <p className="text-md font-light">
                        {new Date(timelineBasespot.startDate).toLocaleDateString(
                          "no-NO",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-xl font-normal">Started</p>
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-md font-light">
                        {timelineBasespot.season ? `Season ${timelineBasespot.season}` : "ㅤ"}
                      </p>
                      <p className="text-xl font-normal">
                        {timelineBasespot.server}
                        <img src={servers[timelineBasespot.server.toLowerCase().replaceAll(' ', '')]} className="w-6 h-6 ml-1 rounded-full inline-block" />
                        {timelineBasespot.cluster && (
                          <span className="ml-2 rounded bg-gray-100 px-2.5 text-md font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {timelineBasespot.cluster}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TimelineBasespotsList;
