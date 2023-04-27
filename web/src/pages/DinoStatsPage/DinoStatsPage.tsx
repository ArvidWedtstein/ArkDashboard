import { MetaTags } from "@redwoodjs/web";


const DinoStatsPage = () => {

  const settings = {
    tamingMultiplier: 1.0,
    consumptionMultiplier: 1.0,
    hatchMultiplier: 1,
    matureMultiplier: 1,
    meleeMultiplier: 100,
    playerDamageMultiplier: 1.0,
    matingIntervalMultiplier: 1.0,
    eggHatchSpeedMultiplier: 1.0,
    babyMatureSpeedMultiplier: 1.0,
    XPMultiplier: 1.0
  };

  return (
    <>
      <MetaTags title="DinoStats" description="DinoStats page" />
    </>
  );
};

export default DinoStatsPage;
