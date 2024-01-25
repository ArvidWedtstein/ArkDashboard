import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { Fragment, useEffect, useState } from "react";
import Badge from "src/components/Util/Badge/Badge";
import Button from "src/components/Util/Button/Button";
import { Card, CardContent, CardMedia } from "src/components/Util/Card/Card";
import Collapse from "src/components/Util/Collapse/Collapse";
import Text from "src/components/Util/Text/Text";

// https://codepen.io/tjramage/pen/yOEbyw
const HomePage = () => {
  useEffect(() => {
    document.addEventListener("scroll", () => {
      let Num = window.scrollY / 500;
      let Num2 = window.scrollY * 0.0004; // higher number for more zoom
      let Num2mod = Num2 + 1;
      let Num3 = window.scrollY * 0.2; // Title speed
      let Num3mod = Num3 + 1;

      document.querySelectorAll("#shade").forEach((el: HTMLElement) => {
        el.style.opacity = `${Num}`;
      });
      document.querySelectorAll("#bg").forEach((el: HTMLElement) => {
        el.style.transform = `scale(${Num2mod})`;
      });
      document.querySelectorAll("#text").forEach((el: HTMLElement) => {
        el.style.marginTop = `${Num3mod}px`;
      });
      return;
    });

    return () => {
      document.removeEventListener("scroll", () => {
        let Num = window.scrollY / 500;
        let Num2 = window.scrollY * 0.0004; // higher number for more zoom
        let Num2mod = Num2 + 1;
        let Num3 = window.scrollY * 0.2; // Title speed
        let Num3mod = Num3 + 1;

        document.querySelectorAll("#shade").forEach((el: HTMLElement) => {
          el.style.opacity = `${Num}`;
        });
        document.querySelectorAll("#bg").forEach((el: HTMLElement) => {
          el.style.transform = `scale(${Num2mod})`;
        });
        document.querySelectorAll("#text").forEach((el: HTMLElement) => {
          el.style.marginTop = `${Num3mod}px`;
        });
        return;
      });
    };
  }, []);
  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = client.auth.onAuthStateChange(async (event, session) => {
  //     console.log(event, session);
  //     if (event == "SIGNED_IN") {

  //       const { data, error } = await client
  //         .from("Profile")
  //         .update({ status: "ONLINE" })
  //         .eq("id", session.user.id);
  //     } else if (event == "SIGNED_OUT") {
  //       const { data, error } = await client
  //         .from("Profile")
  //         .update({ status: "OFFLINE" })
  //         .eq("id", currentUser.id);
  //     }
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };

  //   const channelA = client.channel("public");

  //   channelA.on('presence', { event: 'sync' }, () => {
  //     const newState = channelA.presenceState();
  //     console.log("sync", newState);
  //   }).on('presence', { event: 'join' }, ({ key, newPresences }) => {
  //     console.log('join', key, newPresences)
  //   }).on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
  //     console.log('leave', key, leftPresences)
  //   }).subscribe(async (status) => {
  //     if (status === 'SUBSCRIBED') {
  //       const presenceTrackStatus = await channelA.track({
  //         user: currentUser?.id,
  //         online_at: new Date().toISOString(),
  //       })
  //       console.log("Status", presenceTrackStatus)
  //     }
  //   });

  //   return () => {
  //     channelA.untrack();
  //   }
  // }, [currentUser]);

  //   document.addEventListener("visibilitychange", () => {
  //     // it could be either hidden or visible
  //     document.title = document.visibilityState;
  // });


  const [open, setOpen] = useState(false);

  return (
    <article>
      <MetaTags
        title="ArkDashboard, the best Ark Survival Evolved companion app"
        description="Home page"
        ogContentUrl="https://drive.google.com/uc?export=view&id=1BH3u85NhncIhphAyl2_FR312CnVoKdYj"
        ogType="website"
      />

      <div className="relative -z-10 hidden h-screen will-change-scroll md:block">
        <div
          id="bg"
          className="fixed inset-0 -z-10 h-screen w-full scale-100 bg-[url('https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/timelineimages/13/20220616235414_1.jpg')] bg-cover bg-center bg-no-repeat will-change-transform"
        >
          <div className="fixed left-1/2 bottom-0 -ml-5 h-10 w-10 animate-bounce opacity-100">
            <svg height="25" width="50">
              <polygon
                points="0,0 25,10 50,0 25,25"
                fill="rgba(0,0,0,.5)"
                strokeWidth="0"
                stroke="rgba(255,255,255,.3)"
              />
            </svg>
          </div>
          <div className="table h-full w-full">
            <div className="table-cell align-middle">
              <div
                id="text"
                className="font-montserrat z-10 w-full bg-black/60 p-16 text-white will-change-contents"
              >
                <Text variant="h1" align="center">Ark Dashboard</Text>
                <hr role="seperator" className="rw-divider mx-auto my-3 w-8/12 bg-white/30 h-px" />
                <Text variant="body1" align="center" gutterBottom> Welcome fellow survivor!</Text>
              </div>
            </div>
          </div>
        </div>
        <div
          id="shade"
          className="fixed z-10 h-screen w-full bg-black/80 opacity-0"
        />
      </div>

      <div className="container-xl overflow-hidden bg-gradient-to-t from-black via-black/30 to-black/60 text-center">
        <section className="font-montserrat mx-auto mb-12 max-w-screen-xl p-6 space-y-8">
          <Card variant="gradient">
            <CardContent className="my-8">
              <Text variant="h2" gutterBottom>
                Welcome Home Bob!
              </Text>

              <Text variant="body1" gutterBottom>
                Here you can find
                <Button
                  variant="text"
                  color="success"
                  className="lowercase underline underline-offset-2 text-lg"
                  to={routes.basespots()}
                >
                  base
                </Button>
                locations, material calculator and much more
              </Text>
              <Button
                color="success"
                variant="outlined"
                to={routes.signup()}
                endIcon={
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                }
              >
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card variant="gradient">
            <CardContent className="m-4">
              <Badge color="info" variant="outlined" content={(
                <Fragment>
                  <svg
                    className="mr-1.5 h-2.5 w-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 14"
                    shapeRendering="auto"
                  >
                    <path d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z" />
                  </svg>
                  Basespot
                </Fragment>
              )} standalone />

              <Text variant="h3" gutterTop gutterBottom>
                Basespots and more
              </Text>

              <Text variant="body1" className="text-secondary-400" paragraph>
                Find the best base locations and more in ARK Survival Evolved.
              </Text>

              <Button
                color="success"
                variant="outlined"
                to={routes.basespots()}
                endIcon={
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                }
              >
                Read more
              </Button>
            </CardContent>
          </Card>

          <div className="flex space-x-8">
            <Card variant="gradient">
              <CardContent className="m-4">
                <Badge color="success" variant="outlined" content={(
                  <Fragment>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      fill="currentColor"
                      className="pointer-events-none mr-1.5 h-2.5 w-2.5"
                      shapeRendering="auto"
                    >
                      <path d="M496.3 0c-1 0-2.115 .1567-3.115 .2817L364.6 26.03c-12.25 2.5-16.88 17.59-8 26.47l40.12 40.13L144.3 345L90.73 320.9c-7.375-2.375-15.5-.5022-20.1 4.1l-63.75 63.82c-10.75 10.75-6.376 29.12 8.126 33.99l55.62 18.5l18.5 55.62C91.22 506.8 99.47 512 107.8 512c5.125 0 10.37-1.918 14.5-6.041l63.62-63.74c5.502-5.5 7.376-13.62 5.001-20.1l-23.1-53.6l252.4-252.4l40.13 40.08C462.6 158.5 466.6 160 470.5 160c6.998 0 13.89-4.794 15.51-12.67l25.72-128.6C513.6 8.905 505.1 0 496.3 0zM112.7 470.3L94.97 417l-53.25-17.75l44.87-45l49.13 22l21.1 48.1L112.7 470.3zM460.6 111.3L400.7 51.5l74.75-15L460.6 111.3zM148.7 267.3C151.8 270.4 155.9 272 160 272s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62L63.58 136.1c73.23-51.43 171.8-54.54 247.9-6.502c7.375 4.688 17.38 2.516 22.06-4.984C338.3 118 336 108.1 328.5 103.4c-88.5-55.89-203.9-51.54-288.1 10.46L27.26 100.7C21.01 94.5 10.94 94.44 4.688 100.7S-1.533 117 4.717 123.3L148.7 267.3zM408.6 183.5c-4.781-7.5-14.75-9.672-22.06-4.984c-7.5 4.719-9.719 14.61-5 22.08c48.06 76.04 44.97 174.6-6.494 247.9l-107.7-107.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62l144 144C391.8 510.4 395.9 512 400 512s8.188-1.562 11.31-4.688c6.25-6.25 6.25-16.38 0-22.62l-13.17-13.17C460.1 387.3 464.5 271.1 408.6 183.5z" />
                    </svg>
                    Taming
                  </Fragment>
                )} standalone />

                <Text variant="h3" gutterTop gutterBottom>
                  Dinos
                </Text>

                <Text variant="body1" className="text-secondary-400" paragraph>
                  Get a complete overview of all the dinos that are in ARK
                  Survival Evolved. You can filter the list to easily find the
                  creature or item you are looking for.
                </Text>

                <Button
                  color="success"
                  variant="outlined"
                  to={routes.dinos()}
                  endIcon={
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  }
                >
                  Read more
                </Button>
              </CardContent>
            </Card>

            <Card variant="gradient">
              <CardContent className="m-4">
                <Badge color="purple" variant="outlined" content={(
                  <Fragment>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="mr-1.5 h-2.5 w-2.5"
                      fill="currentColor"
                      shapeRendering="auto"
                    >
                      <path d="M556.2 258.2L440 213V78.04c0-12.82-7.868-24.32-19.81-28.97l-120.6-46.9C295.9 .7252 291.9 0 288 0C284.1 0 280.1 .7252 276.4 2.176L155.8 49.06C143.9 53.71 136 65.23 136 78.06v134.9L19.84 258.2C7.878 262.8 0 274.2 0 287v146.9c0 12.83 7.876 24.35 19.83 28.1l120.9 47.03C144.4 511.3 148.2 512 152 512s7.625-.7032 11.28-2.125L288 461.4l124.8 48.53C416.4 511.3 420.2 512 424 512s7.625-.7032 11.28-2.125l120.9-47.01C568.1 458.2 576 446.7 576 433.9V287C576 274.2 568.1 262.8 556.2 258.2zM152 241.1l92.45 35.48L152 312.6l-91.84-35.72L152 241.1zM168 340.7L272 300.2v133l-104 40.67V340.7zM304 300.2l104 40.45v133L304 433.3V300.2zM424 312.6l-91.84-35.72L424 241.1l92.45 35.48L424 312.6zM408.5 212.8L304 253.5v-121.9l104.1-40.47L408.5 212.8zM288 32.01l92.45 35.48L288 103.4L196.2 67.72L288 32.01zM272 131.6v121.9L167.1 212.1L167.5 90.91L272 131.6zM31.48 300L136 340.7v133.1L32 433.9L31.48 300zM440 473.9v-133.2l104.1-40.47l.5117 132.8L440 473.9z" />
                    </svg>
                    Recipes
                  </Fragment>
                )} standalone />

                <Text variant="h3" gutterTop gutterBottom>
                  Items
                </Text>

                <Text variant="body1" className="text-secondary-400" paragraph>
                  Get a complete overview of all the items that are in ARK
                  Survival Evolved. You can filter the list to easily find the
                  item you are looking for.
                </Text>

                <Button
                  color="success"
                  variant="outlined"
                  to={routes.items()}
                  endIcon={
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9"
                      />
                    </svg>
                  }
                >
                  Read more
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card variant="gradient" className="flex group">
            <div className="min-h-max transition overflow-hidden min-w-max max-w-sm">
              <CardMedia
                image={"https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/thumbnail-small.webp"}
                className="aspect-video h-full min-w-sm w-full object-cover grayscale transition-all duration-500 ease-in-out group-hover:grayscale-0"
              />
            </div>
            <CardContent className="text-left m-8 dark:text-zinc-300 text-zinc-500 transition-all duration-200">
              <Text variant="h5" align="left" gutterTop gutterBottom>
                Crafting Made Easy
              </Text>

              <Text variant="body1" align="left" className="text-secondary-400" gutterTop paragraph>
                Struggling to remember how to craft that rare item? Use our
                crafting recipe calculator to quickly look up the ingredients
                and steps needed for any item in ARK Survival Evolved. Never
                waste resources on failed crafting attempts again!
              </Text>

              <Button
                variant="text"
                color="DEFAULT"
                onClick={() => setOpen(!open)}
                endIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="fill-current transition-colors shrink-0">
                    {open ? <path d="M443.8 330.8C440.6 334.3 436.3 336 432 336c-3.891 0-7.781-1.406-10.86-4.25L224 149.8l-197.1 181.1c-6.5 6-16.64 5.625-22.61-.9062c-6-6.5-5.594-16.59 .8906-22.59l208-192c6.156-5.688 15.56-5.688 21.72 0l208 192C449.3 314.3 449.8 324.3 443.8 330.8z" /> : <path d="M4.251 181.1C7.392 177.7 11.69 175.1 16 175.1c3.891 0 7.781 1.406 10.86 4.25l197.1 181.1l197.1-181.1c6.5-6 16.64-5.625 22.61 .9062c6 6.5 5.594 16.59-.8906 22.59l-208 192c-6.156 5.688-15.56 5.688-21.72 0l-208-192C-1.343 197.7-1.749 187.6 4.251 181.1z" />}
                  </svg>
                }
              >
                How to use the Calculator
              </Button>
              <Collapse in={open}>
                <Text variant="body2" className="m-1 border-l pl-5 text-secondary-400" paragraph>
                  Simply select the item you want to craft from the dropdown
                  list, and the calculator will show you the materials and steps
                  needed to craft it. You can also filter the list by item type
                  or crafting station.
                </Text>
              </Collapse>

              <Button
                color="success"
                variant="outlined"
                className="mt-3"
                to={routes.materialCalculator()}
              >
                Explore!
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </article>
  );
};

export default HomePage;
