import { Link, routes } from "@redwoodjs/router";

export default () => {
  const errors = [
    "Error 404: T-Rex not found! Please make sure your server isn't located in the Jurassic Era.",
    "Error 420: Your dodo has been stolen by a pterodactyl. Time to level up your dino security!",
    "Error 666: Your thatch hut has been destroyed by a rampaging giga. Consider upgrading to stone walls!",
    "Error 999: Your character has been devoured by a wild raptor. Looks like you've become dino-chow!",
    "Error 404: Carnivorous plants not found! Oops, looks like the new DLC didn't quite make it into the game.",
    "Error 007: Your raft has sunk due to a Megalodon attack. Looks like you're going for an unplanned swim!",
    "Error 404: Caves collapsed! Looks like the cave you're trying to explore has been blocked by an overzealous spelunking dino.",
    "Error 404: Explorer notes missing! The dinos have eaten all the notes, so you'll have to rely on your own survival skills now.",
    "Error 500: Server overload! Too many T-Rexes in one area, causing a dino traffic jam. Please try again later.",
    "Error 404: Resources depleted! The dinos have been eating all the berries and trees faster than you can gather. Time to farm some more!"
  ]
  return (
    <div className="flex items-center h-[100vh] text-center">
      <section className="dark:bg-[#252636] bg-white mx-auto animate-pop-up">
        <div className="bg-[#0D2836] text-[#97FBFF] p-8 border border-[#60728F]">
          <h1 className="font-bold uppercase mb-3 text-2xl">Network Error</h1>
          <h1 className="my-8">
            <span>{errors[Math.floor(Math.random() * (errors.length - 0 + 1) + 0)]}</span>
          </h1>
          <div className="flex flex-row mt-3 items-center text-center space-x-8">
            <Link to={routes.home()} className="uppercase w-full duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Accept</Link>
            <Link to={routes.home()} className="uppercase w-full duration-150 bg-[#11667B] px-6 py-1 outline outline-1 transition-colors outline-[#11667B] outline-offset-1 hover:outline-offset-0 hover:outline-2">Cancel</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
