
import { Form } from '@redwoodjs/forms'
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import Avatar from 'src/components/Avatar/Avatar'

import { formatEnum, timeTag,  } from 'src/lib/formatters'

import type { DeleteProfileMutationVariables, FindProfileById } from 'types/graphql'

const DELETE_PROFILE_MUTATION = gql`
  mutation DeleteProfileMutation($id: String!) {
    deleteProfile(id: $id) {
      id
    }
  }
`

interface Props {
  profile: NonNullable<FindProfileById['profile']>
}

const Profile = ({ profile }: Props) => {
  const [deleteProfile] = useMutation(DELETE_PROFILE_MUTATION, {
    onCompleted: () => {
      toast.success('Profile deleted')
      navigate(routes.profiles())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteProfileMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete profile ' + id + '?')) {
      deleteProfile({ variables: { id } })
    }
  }

  return (
    <>
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
      </section>
      <section className="bg-blueGray-200 relative -mt-32 py-16">¨
          <div className="container-fluid mx-auto px-4">
            <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
                    <div className="relative">
                      <Avatar
                        className="absolute -mt-20 h-auto rounded-full border-none align-middle shadow-xl"
                        url={profile.avatar_url}
                        size={200}
                        onUpload={(url) => {
                          // setAvatarUrl(url);
                          // updateProfile({
                          //   username,
                          //   website,
                          //   avatar_url: url,
                          //   firstname,
                          //   lastname,
                          //   biography,
                          // });
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
                    <div className="mt-32 py-6 px-3 sm:mt-0">
                      {/* <button
                        className="mb-1 rounded bg-blue-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-blue-600 sm:mr-2"
                        onClick={() =>
                          updateProfile({
                            username,
                            website,
                            avatar_url,
                            firstname,
                            lastname,
                            biography,
                          })
                        }
                        disabled={loading}
                      >
                        {loading ? "Loading ..." : "Update"}
                      </button> */}
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
                          {/* {tribescreated} */}0
                        </span>
                        <span className="text-blueGray-400 text-sm">Tribes</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 text-center">
                  <form className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-full-name">
                          Full Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-full-name" type="text" placeholder="Ola Nordmann" value={profile.full_name} disabled />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-bio">
                          Biography
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-bio" type="text" value={profile.biography} disabled />
                        <p className="text-gray-600 text-xs italic">Write whatever nonsense you'd like</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-website">
                          Website
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" value={profile.website} disabled />
                      </div>
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-username">
                          Username
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" value={profile.username} disabled />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
      </section>
    </main>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Profile {profile.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{profile.id}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(profile.updated_at)}</td>
            </tr><tr>
              <th>Username</th>
              <td>{profile.username}</td>
            </tr><tr>
              <th>Full name</th>
              <td>{profile.full_name}</td>
            </tr><tr>
              <th>Avatar url</th>
              <td>{profile.avatar_url}</td>
            </tr><tr>
              <th>Website</th>
              <td>{profile.website}</td>
            </tr><tr>
              <th>Biography</th>
              <td>{profile.biography}</td>
            </tr><tr>
              <th>Status</th>
              <td>{formatEnum(profile.status)}</td>
            </tr><tr>
              <th>Role id</th>
              <td>{profile.role_id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(profile.created_at)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editProfile({ id: profile.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(profile.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Profile


// import { useState, useEffect } from "react";

// import { useAuth } from "@redwoodjs/auth";
// import Avatar from "../Avatar/Avatar";
// import { toast } from "@redwoodjs/web/dist/toast";
// import StatCard from "../StatCard/StatCard";
// import PingAlert from "../PingAlert/PingAlert";
// import ArkCard from "../ArkCard/ArkCard";
// import { Form } from "@redwoodjs/forms";

// const Account = () => {
//   const { client: supabase, currentUser, logOut } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState(null);
//   const [fullname, setFullname] = useState(null);
//   const [firstname, setFirstname] = useState(null);
//   const [lastname, setLastname] = useState(null);
//   const [biography, setBiography] = useState(null);
//   const [website, setWebsite] = useState(null);
//   const [avatar_url, setAvatarUrl] = useState(null);
//   const [tribescreated, setTribescreated] = useState(null);

//   const email = currentUser?.email ? currentUser.email.toString() : "unknown";

//   useEffect(() => {
//     getProfile();
//   }, [supabase.auth.session]);
//   async function getProfile() {
//     try {
//       setLoading(true);
//       const user = supabase.auth.user();
//       // console.log(user)
//       let { data, error, status } = await supabase
//         .from("user_view")
//         .select(
//           `id, email, username, website, avatar_url, fullname, biography, role_name, tribescreated`
//         )
//         .eq("id", user.id)
//         .single();

//       if (error && status !== 406) {
//         throw error;
//       }
//       if (data) {
//         setUsername(data.username);
//         setWebsite(data.website);
//         setAvatarUrl(data.avatar_url);
//         setFullname(data.fullname);
//         setBiography(data.biography);
//         setTribescreated(data.tribescreated);
//         setFirstname(data.fullname.split(" ")[0]);
//         setLastname(data.fullname.split(" ")[1]);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function updateProfile({
//     username,
//     website,
//     avatar_url,
//     firstname,
//     lastname,
//     biography,
//   }) {
//     try {
//       setLoading(true);
//       const user = supabase.auth.user();
//       const updates = {
//         id: user.id,
//         username,
//         website,
//         avatar_url,
//         full_name: `${firstname} ${lastname}`,
//         biography,
//         updated_at: new Date(),
//       };
//       // const { data: authorized, error: errors } = await supabase.rpc("authorize", {
//       //   requested_permission: "basespot:delete"
//       // });
//       // if (errors) console.error(errors)
//       // else console.log(authorized)
//       let { error } = await supabase.from("profiles").upsert(updates, {
//         returning: "minimal", // Don't return the value after inserting
//       });

//       if (error) {
//         throw error;
//       }

//       toast.success("Successfully updated Profile!");
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   const onSubmit = (data) => {
//     console.log(data)
//   }

//   return (
//     <main className="">
//       <section className="relative h-[200px]">
//         <div
//           className="absolute top-0 h-full w-full bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://c4.wallpaperflare.com/wallpaper/506/22/433/ark-ark-survival-evolved-cherry-blossom-video-games-wallpaper-preview.jpg')",
//           }}
//         >
//           <span
//             id="blackOverlay"
//             className="absolute left-0 h-full w-full bg-black opacity-50"
//           ></span>
//         </div>
//         {/* <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[70px]" style={{ transform: "translateZ(0px)" }}>
//           <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
//             <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
//           </svg>
//         </div> */}
//       </section>
//       <section className="bg-blueGray-200 relative -mt-32 py-16">¨
//         <Form onSubmit={updateProfile}>
//           <div className="container-fluid mx-auto px-4">
//             <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl">
//               <div className="px-6">
//                 <div className="flex flex-wrap justify-center">
//                   <div className="flex w-full justify-center px-4 lg:order-2 lg:w-3/12">
//                     <div className="relative">
//                       <Avatar
//                         className="absolute -mt-20 h-auto rounded-full border-none align-middle shadow-xl"
//                         url={avatar_url}
//                         size={200}
//                         onUpload={(url) => {
//                           setAvatarUrl(url);
//                           updateProfile({
//                             username,
//                             website,
//                             avatar_url: url,
//                             firstname,
//                             lastname,
//                             biography,
//                           });
//                         }}
//                       />
//                       {/* <StatCard /> */}
//                     </div>
//                   </div>
//                   {/* <span className="nowrap" title="Simulated button" style="padding:.2em 1em; font-weight:bold; border:1px solid; border-color:#70CDDF; border-width:1px; background:linear-gradient(to bottom, #3c90a8 0%, #105c76 100%); text-shadow: 1px 1px #004d62; color:#70CDDF">UI ITEM SLOT SCALE</span> */}
//                   <div className="w-full px-4 lg:order-3 lg:w-4/12 lg:self-center lg:text-right">
//                     <div className="mt-32 py-6 px-3 sm:mt-0">
//                       <button
//                         className="mb-1 rounded bg-blue-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-blue-600 sm:mr-2"
//                         onClick={() =>
//                           updateProfile({
//                             username,
//                             website,
//                             avatar_url,
//                             firstname,
//                             lastname,
//                             biography,
//                           })
//                         }
//                         disabled={loading}
//                       >
//                         {loading ? "Loading ..." : "Update"}
//                       </button>
//                     </div>
//                   </div>
//                   <div className="w-full px-4 lg:order-1 lg:w-4/12">
//                     <div className="flex justify-center py-4 pt-8 lg:pt-4">
//                       <div className="mr-4 p-3 text-center">
//                         <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
//                           0
//                         </span>
//                         <span className="text-blueGray-400 text-sm">Friends</span>
//                       </div>
//                       <div className="mr-4 p-3 text-center">
//                         <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
//                           0
//                         </span>
//                         <span className="text-blueGray-400 text-sm">
//                           Basespots
//                         </span>
//                       </div>
//                       <div className="p-3 text-center lg:mr-4">
//                         <span className="text-blueGray-600 block text-xl font-bold uppercase tracking-wide">
//                           {tribescreated}
//                         </span>
//                         <span className="text-blueGray-400 text-sm">Tribes</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-12 text-center">
//                   <form className="w-full max-w-lg">
//                     <div className="flex flex-wrap -mx-3 mb-6">
//                       <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                         <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
//                           First Name
//                         </label>
//                         <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Ola" value={firstname || ""} onChange={(e) => setFirstname(e.target.value)} />
//                       </div>
//                       <div className="w-full md:w-1/2 px-3">
//                         <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
//                           Last Name
//                         </label>
//                         <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Nordmann" value={lastname || ""} onChange={(e) => setLastname(e.target.value)} />
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap -mx-3 mb-6">
//                       <div className="w-full px-3">
//                         <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-bio">
//                           Biography
//                         </label>
//                         <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-bio" type="text" value={biography || ""} onChange={(e) => setBiography(e.target.value)} />
//                         <p className="text-gray-600 text-xs italic">Write whatever nonsense you'd like</p>
//                       </div>
//                     </div>
//                     <div className="flex flex-wrap -mx-3 mb-2">
//                       <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                         <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-website">
//                           Website
//                         </label>
//                         <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" value={website || ""} onChange={(e) => setWebsite(e.target.value)} />
//                       </div>
//                       <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//                         <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-username">
//                           Username
//                         </label>
//                         <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" value={username || ""} onChange={(e) => setUsername(e.target.value)} />
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Form>
//       </section>
//     </main>
//   );
// };

// export default Account;
