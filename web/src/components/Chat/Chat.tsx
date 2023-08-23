import { Form, TextField, useForm } from "@redwoodjs/forms";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAuth } from "src/auth";
import { debounce, timeTag } from "src/lib/formatters";

// type IMessage = {
//   id: string,
//   content: string,
//   profile_id: string,
//   created_at: string,
// }

// Grouped message type
type IMessage = {
  id: string[];
  content: string[];
  profile_id: string;
  created_at: string;
};
type Profile = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
};
type ProfileCache = {
  [profile_id: string]: Profile;
};
const Message = ({
  message,
  profile,
  setProfileCache,
}: {
  message: IMessage;
  profile: Profile;
  setProfileCache: Dispatch<SetStateAction<ProfileCache>>;
}) => {
  const { currentUser, client: supabase } = useAuth();
  let userId = currentUser?.id;
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("Profile")
        .select("id, username, full_name, avatar_url")
        .match({ id: message.profile_id })
        .single();

      if (data) {
        setProfileCache((current) => ({
          ...current,
          [data.id]: data,
        }));
      }
    };

    if (!profile) {
      fetchProfile();
    }
  }, [profile, message.profile_id]);
  return (
    <div
      key={`${"TEST"}`}
      aria-owns={message.profile_id === userId ? "owner" : ""}
      className="group flex px-5 pt-0 pb-11 aria-[owns=owner]:flex-row-reverse"
    >
      <div className="chat-msg-profile relative mt-auto -mb-5 flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={
            `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/avatars/${profile?.avatar_url}` ||
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png"
          }
          alt={profile?.username || ""}
          title={profile?.username || ""}
        />
        <div className="chat-msg-date absolute bottom-0 left-[calc(100%+12px)] whitespace-nowrap text-xs font-semibold text-[#626466] group-aria-[owns=owner]:left-auto group-aria-[owns=owner]:right-[calc(100%+12px)]">
          {timeTag(message?.created_at)}
        </div>
      </div>
      <div className="ml-3 flex max-w-[70%] flex-col items-start group-aria-[owns=owner]:ml-0 group-aria-[owns=owner]:mr-3 group-aria-[owns=owner]:items-end">
        {message &&
          message?.content?.map((content, index) => (
            <div
              key={`test-${index}`}
              className="chat-msg-text rounded-2xl rounded-bl-none bg-[#383b40] p-4 text-sm font-medium text-[#b5b7ba] group-aria-[owns=owner]:rounded-br-none group-aria-[owns=owner]:rounded-bl-2xl group-aria-[owns=owner]:bg-blue-500 group-aria-[owns=owner]:text-white [&+.chat-msg-text]:mt-3"
            >
              {content}
            </div>
          ))}
        {/* <div className="p-4 rounded-2xl rounded-bl-none [&+.chat-msg-text]:mt-3 font-medium text-sm text-[#b5b7ba] group-aria-[owns=owner]:text-white group-aria-[owns=owner]:rounded-br-none group-aria-[owns=owner]:rounded-bl-2xl group-aria-[owns=owner]:bg-blue-500 bg-[#383b40] chat-msg-text">{message.content}</div> */}
        {/* <div className="p-4 rounded-2xl rounded-bl-none [&+.chat-msg-text]:mt-3 font-medium text-sm text-[#b5b7ba] group-aria-[owns=owner]:text-white group-aria-[owns=owner]:rounded-br-none group-aria-[owns=owner]:rounded-bl-2xl group-aria-[owns=owner]:bg-blue-500 bg-[#383b40] chat-msg-text">
                <img className="max-w-xs w-full" src="https://media0.giphy.com/media/yYSSBtDgbbRzq/giphy.gif?cid=ecf05e47344fb5d835f832a976d1007c241548cc4eea4e7e&rid=giphy.gif" />
              </div> */}
      </div>
    </div>
  );
};
const Chat = () => {
  const { isAuthenticated, currentUser, client: supabase } = useAuth();
  const [profileCache, setProfileCache] = useState({});
  const [messages, setMessages] = useState<any[]>([]); //<Message[]>
  const messagesRef = useRef<HTMLDivElement>(null);
  const formMethods = useForm();
  const messageCooldown = useState(0);

  const groupMessages = (msgs: any[]) => {
    let groupedMessages = [];
    let t = msgs.reduce((t, v) => {
      const sameTime =
        new Date(t.created_at).setSeconds(0, 0) ===
        new Date(v.created_at).setSeconds(0, 0);
      const sameProfile = t.profile_id === v.profile_id;
      if (sameTime && sameProfile) {
        t.id.push(v.id);
        t.content.push(v.content);
      } else {
        groupedMessages.push(t);
        t = {
          id: [v.id],
          content: [v.content],
          profile_id: v.profile_id,
          created_at: v.created_at,
        };
      }
      return t;
    }, {});
    groupedMessages.push(t);
    return groupedMessages;
  };
  // const groupMessage = useCallback(() => {

  // }, [messages])

  const getData = async () => {
    const { data } = await supabase
      .from("Message")
      .select("*, profile: Profile(id, username, full_name, avatar_url)")
      .order("created_at");

    if (!data) {
      // alert('no data');
      return;
    }

    const newProfiles = Object.fromEntries(
      data
        .map((message) => message.profile)
        .filter(Boolean) // is truthy
        .map((profile) => [profile!.id, profile!])
    );

    setProfileCache((current) => ({
      ...current,
      ...newProfiles,
    }));
    // console.log(data)

    // setMessages(data);
    setMessages(groupMessages(data));
    // groupMessage();
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    getData();
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel("supabase_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Message" },
        (payload) => {
          if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
          }
          if (messages.length > 0) {
            if (
              messages[messages.length - 1].profile_id ===
              payload.new.profile_id
            ) {
              setMessages((prev) => [
                ...prev.slice(0, -1),
                {
                  id: [...prev[prev.length - 1].id, payload.new.id],
                  content: [
                    ...prev[prev.length - 1].content,
                    payload.new.content,
                  ],
                  profile_id: payload.new.profile_id,
                  created_at: payload.new.created_at,
                },
              ]);
              return;
            }
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: [payload.new.id],
                content: [payload.new.content],
                profile_id: payload.new.profile_id,
                created_at: payload.new.created_at,
              },
            ]);
          }

          // groupMessage();
          // setMessages((prev) => ([...prev, payload.new]))
        }
      );
    subscription.subscribe();
    // const subscription = supabase
    //   .from("Message")
    //   .on("INSERT", (payload) => {
    //     if (messagesRef.current) {
    //       messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    //     }
    //     if (messages.length > 0) {
    //       if (messages[messages.length - 1].profile_id === payload.new.profile_id) {
    //         setMessages((prev) => ([
    //           ...prev.slice(0, -1),
    //           {
    //             id: [...prev[prev.length - 1].id, payload.new.id],
    //             content: [...prev[prev.length - 1].content, payload.new.content],
    //             profile_id: payload.new.profile_id,
    //             created_at: payload.new.created_at,
    //           }
    //         ]))
    //         return
    //       }
    //     } else {
    //       setMessages((prev) => ([...prev, {
    //         id: [payload.new.id],
    //         content: [payload.new.content],
    //         profile_id: payload.new.profile_id,
    //         created_at: payload.new.created_at,
    //       }]))
    //     }

    //     // groupMessage();
    //     // setMessages((prev) => ([...prev, payload.new]))
    //   })
    //   .subscribe();

    return () => {
      // supabase.removeSubscription(subscription);
      subscription.unsubscribe();
    };
  }, []);
  const handleSubmit = async (data) => {
    setTimeout(() => {
      messageCooldown[1](0);
    }
      , 1000);
    if (messageCooldown[0] > 0) {
      alert("You are sending messages too fast!");
      return;
    }
    messageCooldown[1](messageCooldown[0] + 1);


    const { message } = data;

    if (typeof message === "string" && message.trim().length !== 0) {
      formMethods.reset();

      const { error } = await supabase.from("Message").insert({
        profile_id: currentUser.id,
        content: message,
      });

      if (error) {
        alert(error.message);
      }

      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }
  };
  return (
    <>
      <div ref={messagesRef} className="flex-grow overflow-y-visible">
        {messages.map((message, i) => (
          <Message
            key={i}
            message={message}
            profile={profileCache[message.profile_id]}
            setProfileCache={setProfileCache}
          />
        ))}
      </div>
      <div className="chat-area-footer sticky bottom-0 left-0 flex w-full items-center border-t border-[#323336] bg-[#27292d] py-3 px-5">
        <svg
          className="pointer w-5 flex-shrink-0 text-[#7c7e80] hover:text-[#9fa7ac] [&+svg]:ml-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 7l-7 5 7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
        <svg
          className="pointer w-5 flex-shrink-0 text-[#7c7e80] hover:text-[#9fa7ac] [&+svg]:ml-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <svg
          className="pointer w-5 flex-shrink-0 text-[#7c7e80] hover:text-[#9fa7ac] [&+svg]:ml-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
        <svg
          className="pointer w-5 flex-shrink-0 text-[#8c8e80] hover:text-[#9fa7ac] [&+svg]:ml-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
        </svg>
        <Form
          formMethods={formMethods}
          onSubmit={handleSubmit}
          className="mx-3 w-full p-3"
        >
          <TextField
            name="message"
            className="mx-3 w-full rounded-md border-none bg-[#2f3236] p-3 text-base text-[#d1d1d2] placeholder:text-[#6f7073]"
            placeholder="Type something here..."
          />
        </Form>
        <svg
          onClick={() => handleSubmit({ message: "🤡" })}
          className="pointer w-5 flex-shrink-0 text-[#8c8e80] hover:text-[#9fa7ac] [&+svg]:ml-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
        </svg>
        <svg
          className="pointer w-5 flex-shrink-0 text-[#8c8e80] hover:text-[#9fa7ac] [&+svg]:ml-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
        </svg>
      </div>
    </>
  );
};

export default Chat;
