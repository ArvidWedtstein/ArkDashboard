import { useState, useEffect } from "react";

import { useAuth } from "@redwoodjs/auth";
import Avatar from "../Avatar/Avatar";
import { toast } from "@redwoodjs/web/dist/toast";
import StatCard from "../StatCard/StatCard";
import PingAlert from "../PingAlert/PingAlert";
import ArkCard from "../ArkCard/ArkCard";

const Account = () => {
  const { client: supabase, currentUser, logOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [biography, setBiography] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [tribescreated, setTribescreated] = useState(null);

  const email = currentUser?.email ? currentUser.email.toString() : "unknown";

  useEffect(() => {
    getProfile();
  }, [supabase.auth.session]);
  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      // console.log(user)
      let { data, error, status } = await supabase
        .from("user_view")
        .select(
          `email, username, website, avatar_url, fullname, biography, role_name, tribescreated`
        )
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setFullname(data.fullname);
        setBiography(data.biography);
        setTribescreated(data.tribescreated);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
    fullname,
    biography,
  }) {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        full_name: fullname,
        biography,
        updated_at: new Date(),
      };
      // const { data: authorized, errors } = await supabase.rpc("authorize", {
      //   requested_permission: "role:update",
      //   user_id: `${user.id}`,
      // });
      // console.log("auth", authorized);
      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }

      toast.success("Successfully updated Profile!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="">
      <section className="relative h-[200px]">
        <div
          className="absolute top-0 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://c4.wallpaperflare.com/wallpaper/506/22/433/ark-ark-survival-evolved-cherry-blossom-video-games-wallpaper-preview.jpg')",
          }}
        >
          <span
            id="blackOverlay"
            className="absolute left-0 h-full w-full bg-black opacity-50"
          ></span>
        </div>
        {/* <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[70px]" style={{ transform: "translateZ(0px)" }}>
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div> */}
      </section>
      <section className="bg-blueGray-200 relative -mt-32 py-16">
        <div className="container-fluid mx-auto px-4">
          <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                  <div className="relative">
                    <Avatar
                      className="absolute -mt-20 h-auto rounded-full border-none align-middle shadow-xl"
                      url={avatar_url}
                      size={200}
                      onUpload={(url) => {
                        setAvatarUrl(url);
                        updateProfile({
                          username,
                          website,
                          avatar_url: url,
                          fullname,
                          biography,
                        });
                      }}
                    />
                    {/* <StatCard /> */}
                  </div>
                </div>
                {/* <span class="nowrap" title="Simulated button" style="padding:.2em 1em; font-weight:bold; border:1px solid; border-color:#70CDDF; border-width:1px; background:linear-gradient(to bottom, #3c90a8 0%, #105c76 100%); text-shadow: 1px 1px #004d62; color:#70CDDF">UI ITEM SLOT SCALE</span> */}
                <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                  <div className="mt-32 py-6 px-3 sm:mt-0">
                    <button
                      className="mb-1 rounded bg-blue-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-blue-600 sm:mr-2"
                      onClick={() =>
                        updateProfile({
                          username,
                          website,
                          avatar_url,
                          fullname,
                          biography,
                        })
                      }
                      disabled={loading}
                    >
                      {loading ? "Loading ..." : "Update"}
                    </button>
                  </div>
                </div>
                <div className="w-full px-4 lg:order-1 lg:w-4/12">
                  <div className="flex justify-center py-4 pt-8 lg:pt-4">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        0
                      </span>
                      <span className="text-blueGray-400 text-sm">Friends</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        0
                      </span>
                      <span className="text-blueGray-400 text-sm">
                        Basespots
                      </span>
                    </div>
                    <div className="p-3 text-center lg:mr-4">
                      <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
                        {tribescreated}
                      </span>
                      <span className="text-blueGray-400 text-sm">Tribes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-blueGray-700 mb-2 text-4xl font-semibold leading-normal">
                  <label
                    htmlFor="fullname"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    type="text"
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label
                    htmlFor="fullname"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    type="text"
                    value={fullname || ""}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </h3>
                <div className="text-blueGray-400 mt-0 mb-2 text-sm font-bold uppercase leading-normal">
                  <label
                    htmlFor="website"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Website
                  </label>
                  <input
                    id="website"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    type="text"
                    value={website || ""}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="text-blueGray-600 mb-2 mt-10">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    type="text"
                    value={email || ""}
                    disabled
                  />
                </div>
                <div className="text-blueGray-600 mb-2">
                  <label
                    htmlFor="biography"
                    className="mb-2 block text-sm font-medium text-gray-900"
                  >
                    Biography
                  </label>
                  <input
                    id="biography"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    type="text"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                  />
                </div>
              </div>
              <div className="border-blueGray-200 mt-10 border-t py-10 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4 lg:w-9/12">
                    <p className="text-blueGray-700 mb-4 text-lg leading-relaxed">
                      When other websites give you text, they’re not sending the
                      best. They’re not sending you, they’re sending words that
                      have lots of problems and they’re bringing those problems
                      with us. They’re bringing mistakes. They’re bringing
                      misspellings. They’re typists… And some, I assume, are
                      good words. I know words. I have the best words.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Account;
