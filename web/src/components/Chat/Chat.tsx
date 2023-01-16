
import { useAuth } from "@redwoodjs/auth";
import { Form, TextField, useForm } from "@redwoodjs/forms";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { supabase } from "src/App";
import { timeTag } from "src/lib/formatters";

type IMessage = {
  id: string,
  content: string,
  profile_id: string,
  created_at: string,
}
type Profile = {
  id: string,
  username: string,
  full_name?: string,
  avatar_url?: string,
}
type ProfileCache = {
  [profile_id: string]: Profile
}
const Message = ({ message, profile, setProfileCache }: { message: IMessage, profile: Profile, setProfileCache: Dispatch<SetStateAction<ProfileCache>> }) => {
  const { id: userId } = useAuth().currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('Profile')
        .select('id, username, full_name, avatar_url')
        .match({ id: message.profile_id })
        .single()

      if (data) {
        const { data: imgdata } = await supabase.storage
          .from('avatars')
          .download(data.avatar_url);

        if (imgdata) {
          const url = URL.createObjectURL(imgdata);
          data.avatar_url = url;
        }
        setProfileCache((current) => ({
          ...current,
          [data.id]: data,
        }))
      }
    }

    if (!profile) {
      fetchProfile();
    }
  }, [profile, message.profile_id])
  return (
    <div key={message.id} aria-owns={message.profile_id === userId ? 'owner' : ''} className="flex pt-0 px-5 pb-11 aria-[owns=owner]:flex-row-reverse group chat-msg owner">
      <div className="flex-shrink-0 mt-auto -mb-5 relative chat-msg-profile">
        {/* TODO: Replace with avatar component later */}
        <img className="h-10 w-10 rounded-full object-cover" src={profile.avatar_url || "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png"} alt={profile.username} title={profile.username} />
        <div className="absolute bottom-0 text-xs font-semibold whitespace-nowrap left-[calc(100%+12px)] text-[#626466] group-aria-[owns=owner]:left-auto group-aria-[owns=owner]:right-[calc(100%+12px)] chat-msg-date">{timeTag(message.created_at)}</div>
      </div>
      <div className="ml-3 max-w-[70%] flex flex-col items-start group-aria-[owns=owner]:ml-0 group-aria-[owns=owner]:items-end group-aria-[owns=owner]:mr-3 chat-msg-content">
        <div className="p-4 rounded-2xl rounded-bl-none [&+.chat-msg-text]:mt-3 font-medium text-sm text-[#b5b7ba] group-aria-[owns=owner]:text-white group-aria-[owns=owner]:rounded-br-none group-aria-[owns=owner]:rounded-bl-2xl group-aria-[owns=owner]:bg-blue-500 bg-[#383b40] chat-msg-text">{message.content}</div>
        {/* <div className="p-4 rounded-2xl rounded-bl-none [&+.chat-msg-text]:mt-3 font-medium text-sm text-[#b5b7ba] group-aria-[owns=owner]:text-white group-aria-[owns=owner]:rounded-br-none group-aria-[owns=owner]:rounded-bl-2xl group-aria-[owns=owner]:bg-blue-500 bg-[#383b40] chat-msg-text">Cras mollis nec arcu malesuada tincidunt.</div> */}
        {/* <div className="p-4 rounded-2xl rounded-bl-none [&+.chat-msg-text]:mt-3 font-medium text-sm text-[#b5b7ba] group-aria-[owns=owner]:text-white group-aria-[owns=owner]:rounded-br-none group-aria-[owns=owner]:rounded-bl-2xl group-aria-[owns=owner]:bg-blue-500 bg-[#383b40] chat-msg-text">
                <img className="max-w-xs w-full" src="https://media0.giphy.com/media/yYSSBtDgbbRzq/giphy.gif?cid=ecf05e47344fb5d835f832a976d1007c241548cc4eea4e7e&rid=giphy.gif" />
              </div> */}
      </div>
    </div>
  )
}
const Chat = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [profileCache, setProfileCache] = useState({})
  const [messages, setMessages] = useState([]); //<Message[]>
  const messagesRef = useRef<HTMLDivElement>(null)
  const formMethods = useForm();
  // https://github.com/dijonmusters/happy-chat/blob/main/components/messages.tsx


  const getData = async () => {
    const { data } = await supabase
      .from("Message")
      .select("*, profile: Profile(id, username, full_name, avatar_url)")
      .order('created_at');

    if (!data) {
      // alert('no data');
      return
    }
    console.log(data)

    const newProfiles = Object.fromEntries(
      data
        .map((message) => message.profile)
        .filter(Boolean) // is truthy
        .map((profile) => [profile!.id, profile!])
    )

    setProfileCache((current) => ({
      ...current,
      ...newProfiles,
    }))


    setMessages(data);
  }

  useEffect(() => {
    if (!isAuthenticated) return
    getData()
  }, [])

  useEffect(() => {
    const subscription = supabase
      .from('Message')
      .on('INSERT', (payload) => {
        console.log('Change received!', payload)
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
        setMessages((prev) => ([...prev, payload.new]))
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, []);
  const handleSubmit = async (data) => {
    const { message } = data;

    if (typeof message === 'string' && message.trim().length !== 0) {
      formMethods.reset();

      const { error } = await supabase
        .from('Message')
        .insert({
          profile_id: currentUser.id,
          content: message,
        });

      if (error) {
        alert(error.message);
      }

      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      }
    }
  }
  return (
    <>
      <div ref={messagesRef} className="flex-grow chat-area-main">
        {messages.map((message, i) => (
          <Message key={i} message={message} profile={profileCache[message.profile_id]} setProfileCache={setProfileCache} />
        ))}
      </div>
      <div className="flex border-t border-[#323336] w-full py-3 px-5 items-center bg-[#27292d] sticky bottom-0 left-0 chat-area-footer">
        <svg className="text-[#7c7e80] pointer w-5 flex-shrink-0 hover:text-[#9fa7ac] [&+svg]:ml-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
        <svg className="text-[#7c7e80] pointer w-5 flex-shrink-0 hover:text-[#9fa7ac] [&+svg]:ml-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" /></svg>
        <svg className="text-[#7c7e80] pointer w-5 flex-shrink-0 hover:text-[#9fa7ac] [&+svg]:ml-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" /></svg>
        <svg className="text-[#8c8e80] pointer w-5 flex-shrink-0 hover:text-[#9fa7ac] [&+svg]:ml-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
        <Form formMethods={formMethods} onSubmit={handleSubmit} className="w-full mx-3 p-3">
          <TextField name="message" className="border-none text-[#d1d1d2] bg-[#2f3236] p-3 rounded-md text-base mx-3 w-full placeholder:text-[#6f7073]" placeholder="Type something here..." />
        </Form>
        <svg onClick={() => handleSubmit({ message: '🤡' })} className="text-[#8c8e80] pointer w-5 flex-shrink-0 hover:text-[#9fa7ac] [&+svg]:ml-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
        <svg className="text-[#8c8e80] pointer w-5 flex-shrink-0 hover:text-[#9fa7ac] [&+svg]:ml-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
      </div>
    </>
  )
}

export default Chat
