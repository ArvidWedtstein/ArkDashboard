import { useState, useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import Avatar from '../Avatar/Avatar'
import { toast } from '@redwoodjs/web/dist/toast'
import StatCard from '../StatCard/StatCard'
import PingAlert from '../PingAlert/PingAlert'
import ArkCard from '../ArkCard/ArkCard'


const Account = () => {

  const { client: supabase, currentUser, logOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [fullname, setFullname] = useState(null)
  const [biography, setBiography] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [tribescreated, setTribescreated] = useState(null)

  const email = currentUser?.email ? currentUser.email.toString() : "unknown"

  useEffect(() => {
    getProfile()
  }, [supabase.auth.session])


  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      // console.log(user)
      let { data, error, status } = await supabase
        .from('user_view')
        .select(`email, username, website, avatar_url, fullname, biography, role_name, tribescreated`)
        .eq('id', user.id)
        .single()


      if (error && status !== 406) {
        throw error
      }


      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
        setFullname(data.fullname)
        setBiography(data.biography)
        setTribescreated(data.tribescreated)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url, fullname, biography }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        fullname,
        biography,
        updated_at: new Date(),
      }
      const { data: authorized, errors } = await supabase.rpc('authorize', { requested_permission: 'role:update', user_id: `${user.id}` })
      console.log("auth", authorized)
      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }

      toast.success('Successfully updated Profile!')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="">
      <section className="relative h-[200px]">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/506/22/433/ark-ark-survival-evolved-cherry-blossom-video-games-wallpaper-preview.jpg')" }}>
          <span id="blackOverlay" className="left-0 w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        {/* <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[70px]" style={{ transform: "translateZ(0px)" }}>
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div> */}
      </section>
      <section className="relative py-16 bg-blueGray-200 -mt-32">
        <div className="container-fluid mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <Avatar
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -mt-20"
                      url={avatar_url}
                      size={200}
                      onUpload={(url) => {
                        setAvatarUrl(url)
                        updateProfile({ username, website, avatar_url: url, fullname, biography })
                      }}
                    />
                    {/* <StatCard /> */}

                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <button
                      className="bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      onClick={() => updateProfile({ username, website, avatar_url, fullname, biography })}
                      disabled={loading}
                    >
                      {loading ? 'Loading ...' : 'Update'}
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">0</span>
                      <span className="text-sm text-blueGray-400">Friends</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">0</span>
                      <span className="text-sm text-blueGray-400">Basespots</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">{tribescreated}</span>
                      <span className="text-sm text-blueGray-400">Tribes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                  <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
                  <input
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900">Full Name</label>
                  <input
                    id="fullname"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900">Website</label>
                  <input
                    id="website"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                  <input
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    value={email}
                    disabled
                  />
                </div>
                <div className="mb-2 text-blueGray-600">
                  <label htmlFor="biography" className="block mb-2 text-sm font-medium text-gray-900">Biography</label>
                  <input
                    id="biography"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    type="text"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      When other websites give you text, they’re not sending the best. They’re not sending you, they’re sending words that have lots of problems and they’re bringing those problems with us. They’re bringing mistakes. They’re bringing misspellings. They’re typists… And some, I assume, are good words. I know words. I have the best words.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main >
  )

}


export default Account