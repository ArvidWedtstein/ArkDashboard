import { useState, useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import Avatar from '../Avatar/Avatar'
import { toast } from '@redwoodjs/web/dist/toast'


const Account = () => {

  const { client: supabase, currentUser, logOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)


  const email = currentUser?.email ? currentUser.email.toString() : "unknown"

  useEffect(() => {

    getProfile()

  }, [supabase.auth.session])


  async function getProfile() {
    try {
      setLoading(true)

      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()


      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = supabase.auth.user()
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }


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
    // <div className="row flex-center flex">
    //   <div className="col-6 form-widget">
    //     <h1 className="header">Supabase + RedwoodJS</h1>
    //     <p className="description">Your profile</p>
    //     <div className="form-widget">
    //       <Avatar
    //         url={avatar_url}
    //         size={150}
    //         onUpload={(url) => {
    //           setAvatarUrl(url)
    //           updateProfile({ username, website, avatar_url: url })
    //         }}
    //       />
    //       <div>
    //         <label htmlFor="email">Email</label>
    //         <input id="email" type="text" value={currentUser.email} disabled />
    //       </div>
    //       <div>
    //         <label htmlFor="username">Name</label>
    //         <input
    //           id="username"
    //           type="text"
    //           value={username || ''}
    //           onChange={(e) => setUsername(e.target.value)}
    //         />
    //       </div>
    //       <div>
    //         <label htmlFor="website">Website</label>
    //         <input
    //           id="website"
    //           type="website"
    //           value={website || ''}
    //           onChange={(e) => setWebsite(e.target.value)}
    //         />
    //       </div>
    //       <div>
    //         <button
    //           className="button primary block"
    //           onClick={() => updateProfile({ username, website, avatar_url })}
    //           disabled={loading}
    //         >
    //           {loading ? 'Loading ...' : 'Update'}
    //         </button>
    //       </div>
    //       <div>
    //         <button className="button block" onClick={() => logOut()}>
    //           Sign Out
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <main className="">
      <section className="relative h-500-px">
        <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2710&amp;q=80');" }}>
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
        <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style={{ transform: "translateZ(0px)" }}>
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-blueGray-200">
        <div className="container-fluid mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <Avatar
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -mt-16 max-w-150-px"
                      url={avatar_url}
                      size={150}
                      onUpload={(url) => {
                        setAvatarUrl(url)
                        updateProfile({ username, website, avatar_url: url })
                      }}
                    />
                    {/* <img alt="..." src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg" className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px" /> */}
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <button
                      className="bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      onClick={() => updateProfile({ username, website, avatar_url })}
                      disabled={loading}
                    >
                      {loading ? 'Loading ...' : 'Update'}
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">0</span><span className="text-sm text-blueGray-400">Friends</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">0</span><span className="text-sm text-blueGray-400">Basespots</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">0</span><span className="text-sm text-blueGray-400">Test</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                  <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  <input
                    id="website"
                    type="website"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i><input id="email" type="text" value={email} disabled />
                </div>
                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>hehe
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
    </main>
  )

}


export default Account