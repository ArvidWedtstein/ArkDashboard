import { routes } from "@redwoodjs/router";
import Badge from "src/components/Util/Badge/Badge";
import Button, { ButtonGroup } from "src/components/Util/Button/Button";
import { Card, CardActionArea, CardActions, CardHeader } from "src/components/Util/Card/Card";
import Gantt from "src/components/Util/Gantt/Gantt";
import Text from "src/components/Util/Text/Text";
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "src/components/Util/Timeline/Timeline";
import { relativeDate, timeTag } from "src/lib/formatters";
import type { FindTimelineSeasons } from "types/graphql";

const TimelineSeasonsList = ({ timelineSeasons }: FindTimelineSeasons) => {
  const dateFormatter = new Intl.DateTimeFormat(navigator && navigator.language, {
    timeZone: "utc",
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat(navigator && navigator.language, {
    hour: 'numeric',
    minute: 'numeric',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const listFormatter = new Intl.ListFormat(navigator && navigator.language, {
    style: 'short',
    type: 'unit'
  });

  const servers = {
    "Elite Ark": {
      icon: "https://eliteark.com/wp-content/uploads/2022/06/cropped-0_ark-logo.thumb_.png.36427f75c51aff4ecec55bba50fd194d.png",
      badge: "info",
    },
    "Bloody Ark": {
      icon: "https://preview.redd.it/cdje2wcsmr521.png?width=313&format=png&auto=webp&s=bf1e8347b8dcd066bcf3aace6a461b61e804570b",
      badge: "error",
    },
    Arkosic: {
      icon: "https://steamuserimages-a.akamaihd.net/ugc/2023839858710970915/3E075CEE248A0C9F9069EC7D12894F597E74A2CF/?imw=200&imh=200&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
      badge: "success",
    },
    "Mesa Ark": {
      icon: "https://mesa-ark.com/images/MESA_Icon.png",
      badge: "warning",
    },
  };

  return (
    <article className="rw-segment overflow-x-auto">

      <header className="flex flex-col items-center justify-between border-b border-zinc-500 pb-6 pt-1 text-gray-900 dark:text-white sm:flex-row">
        <Text variant="h4">
          Seasons Timeline
        </Text>

        <nav className="flex items-center justify-end space-x-3">
          <ButtonGroup>
            <Button
              to={routes.newTimelineSeason()}
              color="success"
              variant="outlined"
              permission="timeline_create"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  focusable="false"
                >
                  <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
                </svg>
              }
            >
              New Timeline Season
            </Button>
          </ButtonGroup>
        </nav>
      </header>

      <Gantt
        data={timelineSeasons}
        group="server"
        dateStartKey="season_start_date"
        dateEndKey="season_end_date"
        labelKey="tribe_name"
      />

      <div className="relative flex items-center justify-center">
        <Timeline position="right">
          {timelineSeasons.map(
            ({
              id,
              season,
              season_start_date,
              season_end_date,
              cluster,
              server,
              tribe_name,
            }) => (
              <TimelineItem key={id}>
                <TimelineOppositeContent
                  variant="body2"
                  className="mb-auto flex flex-col dark:text-white text-black"
                >
                  <Text variant="body1">
                    {dateFormatter.formatRange(
                      new Date(season_start_date),
                      new Date(season_end_date)
                    )}
                  </Text>
                  <Text variant="caption">
                    {timeFormatter.formatRange(
                      new Date(season_start_date),
                      new Date(season_end_date)
                    )}
                  </Text>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot variant="outlined" color="secondary">
                    <div className="relative inline-block w-5">
                      <img
                        className="aspect-square"
                        src={servers[server]?.icon}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.classList.add('invert')
                          e.currentTarget.src = 'https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Item/any-craftable-resource.webp';
                        }}
                        alt=""
                      />
                    </div>
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card className="max-w-sm">
                    <CardActionArea className="text-left">
                      <CardHeader
                        title={server}
                        subheader={`${listFormatter.format([season ? `Season ${season}` : null, tribe_name].filter(c => c))}`}
                        {...(cluster && server ? {
                          action: (
                            <Badge
                              variant="outlined"
                              color={servers[server]?.badge || 'DEFAULT'}
                              content={cluster}
                              standalone
                            />
                          )
                        } : null)}
                      />
                    </CardActionArea>
                    <CardActions>
                      <Button
                        to={routes.timelineSeason({ id })}
                        color="secondary"
                        variant="outlined"
                        endIcon={
                          <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        }
                      >
                        Learn more
                      </Button>
                    </CardActions>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
        </Timeline>
      </div>
    </article>
  );
};

export default TimelineSeasonsList;
