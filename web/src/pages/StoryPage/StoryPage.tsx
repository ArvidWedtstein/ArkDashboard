import { useAuth } from "@redwoodjs/auth";
import { supabase } from "@redwoodjs/auth/dist/authClients/supabase";
import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/dist/toast";
import { useEffect, useState } from "react";
import Timeline from "src/components/Util/Timeline/Timeline";

const StoryPage = ({ page = 1 }) => {
  const { client: supabase, currentUser, logOut } = useAuth();
  const [basespots, setBasespots] = useState([]);

  async function getStory() {
    try {
      let { data, error, status } = await supabase
        .from("timeline_basespots_view")
        .select(
          `
          id,
          created_at,
          updated_at,
          startDate,
          endDate,
          timeline_id,
          tribeName,
          map,
          server,
          region,
          season,
          cluster,
          location,
          players,
          created_by,
          raided_by,
          raidcomment,
          images,
          basespot
        `
        )
        .eq("created_by", "7a2878d1-4f61-456d-bcb6-edc707383ea8")
        .order("startDate", { ascending: true });

      if (error && status !== 406) {
        throw error;
      }
      setBasespots(data);
      return (
        <>
          <MetaTags title="Story" description="Story page" />

          {basespots && <Timeline events={basespots} />}
        </>
      );
    } catch (error) {
      toast.error(error.message);
    }
  }
  useEffect(() => {
    getStory();
  }, []);
  return (
    <>
      <MetaTags title="Story" description="Story page" />

      {basespots && <Timeline events={basespots} />}
    </>
  );
};

export default StoryPage;
