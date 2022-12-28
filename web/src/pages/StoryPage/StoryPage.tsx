import { useAuth } from '@redwoodjs/auth';
import { supabase } from '@redwoodjs/auth/dist/authClients/supabase';
import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast';
import { useEffect, useState } from 'react';
import Timeline from 'src/components/Util/Timeline/Timeline'

const StoryPage = () => {
  const { client: supabase, currentUser, logOut } = useAuth();
  const [basespots, setBasespots] = useState([]);

  async function getStory() {
    try {
      let { data, error, status } = await supabase
        .from("timeline_basespots")
        .select(
          `*`
        )
        .eq("created_by", '7a2878d1-4f61-456d-bcb6-edc707383ea8')

      setBasespots(data)
    } catch (error) {
      toast.error(error.message);
    }
  }
  getStory()
  return (
    <>
      <MetaTags title="Story" description="Story page" />

      <Timeline events={basespots} />
    </>
  )
}

export default StoryPage
