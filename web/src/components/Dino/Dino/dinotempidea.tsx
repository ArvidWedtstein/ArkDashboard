{/* <div className="relative w-full col-span-full">
        <div className="parchment [filter:url(#wavy)]" />
        <div className=" flex flex-row gap-10 p-8">
          <div className="relative flex flex-col flex-shrink font-montserrat">

            <div className="relative inline-flex justify-center items-center ring-1 ring-white ring-inset aspect-square rounded-full bg-[#7a6954]/30 translate-y-[20%] shadow-lg" style={{ clipPath: "polygon(100% 0%, 100% 80%, 50% 80%, 0% 80%, 0% 0%)" }}>
              <img src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/DinoIcon/${dino.icon}`} className="p-6 h-36" />
            </div>
            <div className="relative ring-1 ring-white/50 mx-6 py-6 rounded-b w-40">
              <div className="absolute w-full h-full inset-0 bg-[#7a6954]/30 rounded !z-[-1] pointer-events-none" />
      <ul className="space-y-2 divide-y divide-white/30 text-black align-middle w-fit text-center px-3 !z-10">
        <li className="">
          <p className="">{dino.type}</p>
        </li>
        <li className="">test</li>
        <li className="">test</li>
        <li className="">test</li>
        <li className="">test</li>
      </ul>
    </div>

          </div >
  <div className="flex flex-col justify-start text-[#585045]">
    <div className="">
      <img
        src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${dino.image}`}
        alt={dino.name}
        className="w-auto -scale-x-100 transform"
        loading="lazy"
      />
    </div>
    <h1 className="text-2xl font-normal font-montserrat my-4">{dino.name}</h1>
    <p className="first-letter:text-7xl first-letter:pr-1 first-letter:align-text-top first-letter:font-serif first-letter:text-opacity-50 first-letter:float-left first-letter:inline-block first-letter:leading-[1.125] first-line:uppercase first-line:block first-line:font-bold text-xl overflow-auto font-montserrat">
      {dino.description}
    </p>
  </div>
        </div >
      </div >



      <Card className="w-full col-span-full grid grid-flow-col gap-3 p-4 !bg-transparent !text-[#585045]" variant="standard">
        <div className="parchment [filter:url(#wavy)]" />
        <div className="w-full">
          <Button
            size="small"
            variant="outlined"
            color="DEFAULT"
            to={routes.items()}
          >
            <span className="sr-only">Back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-4 fill-current"
            >
              <path d="M447.1 256C447.1 264.8 440.8 272 432 272H68.17l135.7 149.3c5.938 6.531 5.453 16.66-1.078 22.59C199.7 446.6 195.8 448 192 448c-4.344 0-8.688-1.75-11.84-5.25l-160-176c-5.547-6.094-5.547-15.41 0-21.5l160-176c5.969-6.562 16.09-7 22.61-1.094c6.531 5.938 7.016 16.06 1.078 22.59L68.17 240H432C440.8 240 447.1 247.2 447.1 256z" />
            </svg>
          </Button>
          <CardMedia
            image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${dino.image}`}
            className="-scale-x-100 transform"
          />
          <CardHeader
            title={dino.name}
            titleProps={{
              className: 'text-2xl'
            }}
            subheader={dino.synonyms && dino.synonyms.replace(",", ", ")}
            subheaderProps={{
              className: 'italic'
            }}
          />
          <CardContent>
            {dino.description}
          </CardContent>
        </div>
        <div className="grid w-fit grid-cols-3 gap-2 justify-self-end">
          <Card
            variant="elevation" elevation={4} className="!bg-transparent !text-black"
          >
            <CardHeader
              title={`X-Variant`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino?.variants?.some((v) => v === "Genesis") ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
          <Card variant="elevation" elevation={4} className="!bg-transparent !text-black">
            <CardHeader
              title={`Type`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.type}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
          <Card variant="elevation" elevation={4} className="!bg-transparent !text-black">
            <CardHeader
              title={`Taming Method`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.taming_method === 'KO' ? "Knockout" : "Passive"}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
          <Card variant="elevation" elevation={4} className="!bg-transparent !text-black">
            <CardHeader
              title={`Temperament`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.temperament}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
          <Card variant="elevation" elevation={4} className="!bg-transparent !text-black">
            <CardHeader
              title={`Ridable`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.ridable ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
          <Card variant="elevation" elevation={4} className="!bg-transparent !text-black">
            <CardHeader
              title={`Tamable`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.tamable ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
          <Card variant="elevation" elevation={4} className="!bg-transparent !text-black">
            <CardHeader
              title={`Torpor Immune`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.torpor_immune ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
          <Card variant="elevation" elevation={4} className="!bg-transparent !text-black">
            <CardHeader
              title={`XP Gained when killed`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={(
                dino.exp_per_kill *
                state.settings.XPMultiplier *
                (1 + 0.1 * (state.level - 1))
              ).toFixed() || 0}
              subheaderProps={{ className: "text-xl !font-bold capitalize !text-black" }}
            />
          </Card>
        </div>
      </Card>

      <svg width="0" height="0">
        <filter id="wavy">
          <feTurbulence x="0" y="0" baseFrequency="0.02" numOctaves="5" seed="12" />
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </svg>

      <Card className="w-full col-span-full grid grid-flow-col gap-3 p-4" variant="standard">
        <div className="w-full">
          <Button
            size="small"
            variant="outlined"
            color="DEFAULT"
            to={routes.items()}
          >
            <span className="sr-only">Back</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-4 fill-current"
            >
              <path d="M447.1 256C447.1 264.8 440.8 272 432 272H68.17l135.7 149.3c5.938 6.531 5.453 16.66-1.078 22.59C199.7 446.6 195.8 448 192 448c-4.344 0-8.688-1.75-11.84-5.25l-160-176c-5.547-6.094-5.547-15.41 0-21.5l160-176c5.969-6.562 16.09-7 22.61-1.094c6.531 5.938 7.016 16.06 1.078 22.59L68.17 240H432C440.8 240 447.1 247.2 447.1 256z" />
            </svg>
          </Button>
          <CardMedia
            image={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Dino/${dino.image}`}
            className="-scale-x-100 transform"
          />
          <CardHeader
            title={dino.name}
            titleProps={{
              className: 'text-2xl font-semibold'
            }}
            subheader={dino.synonyms && dino.synonyms.replace(",", ", ")}
            subheaderProps={{
              className: 'italic'
            }}
          />
          <CardContent>
            {dino.description}
          </CardContent>
        </div>
        <div className="grid w-fit grid-cols-3 gap-2 justify-self-end">
          <Card
            variant="gradient"
            className="bg-zinc-200 shadow-md dark:bg-zinc-700"
          >
            <CardHeader
              title={`X-Variant`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino?.variants?.some((v) => v === "Genesis") ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold" }}
            />
          </Card>
          <Card variant="gradient" className="bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Type`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.type}
              subheaderProps={{ className: "text-xl !font-bold capitalize" }}
            />
          </Card>
          <Card variant="gradient" className="bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Taming Method`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.taming_method === 'KO' ? "Knockout" : "Passive"}
              subheaderProps={{ className: "text-xl !font-bold capitalize" }}
            />
          </Card>
          <Card variant="gradient" className="bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Temperament`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.temperament}
              subheaderProps={{ className: "text-xl !font-bold capitalize" }}
            />
          </Card>
          <Card variant="gradient" className="bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Ridable`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.ridable ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold capitalize" }}
            />
          </Card>
          <Card variant="gradient" className="bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Tamable`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.tamable ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold capitalize" }}
            />
          </Card>
          <Card variant="gradient" className="bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`Torpor Immune`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={dino.torpor_immune ? "Yes" : "No"}
              subheaderProps={{ className: "text-xl !font-bold capitalize" }}
            />
          </Card>
          <Card variant="gradient" className="bg-zinc-200 shadow-md dark:bg-zinc-700">
            <CardHeader
              title={`XP Gained when killed`}
              titleProps={{
                className: "!text-xs !font-semibold uppercase font-poppins",
              }}
              subheader={(
                dino.exp_per_kill *
                state.settings.XPMultiplier *
                (1 + 0.1 * (state.level - 1))
              ).toFixed() || 0}
              subheaderProps={{ className: "text-xl !font-bold capitalize" }}
            />
          </Card>
        </div>
      </Card> */}