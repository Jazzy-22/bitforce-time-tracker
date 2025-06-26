'use client'
import Layout from "@/components/layout";
import ManagerHeader from "@/components/managerHeader";
import { Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";

const ItemList = dynamic(() => import('@/components/itemList'), { ssr: false });

export default function Projects() {
  const header = <ManagerHeader section='Projects' title='BitForce - TimeTrack'/>;
  
  const [firstLoad, setFirstLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [tasks, setTasks] = useState([{ id: 1, primary: 'TT-142: Refactor Projects', secondary: 'John Doe' }]);
  const [members, setMembers] = useState([{ id: 1, primary: 'John Doe', secondary: 'Developer' }]);
  const [project, setProject] = useState(null);

  const router = useRouter();
  const path = usePathname();

  const handleTasks = (e) => {
    console.log(e);
  }

  const handleMembers = (e) => {
    console.log(e);
  }

  useEffect(() => {
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      axios.get(process.env.NEXT_PUBLIC_API_URL + '/projects/' + path.split('/')[2])
        .then(res => {
          const p = res.data.data;
          if (p?.members?.length > 0){
            const m = p.members;
            m.forEach(member => {
                member.primary = `${member.user.first_name} ${member.user.last_name}`,
                member.secondary = member.role.label
            });
            setMembers([... members, ...m]);
          }
          if (p.tasks?.length > 0){
            const t = p.tasks?.map(task => {
              return {
                id: task.id,
                primary: task.title,
                secondary: task.members ? task.members.map(m => `${m.user.first_name} ${m.user.last_name}`).join(', ') : ''
              }
            });
            setProject(p);
            setTasks([... tasks, ...t]);
          }
        })
        .catch(err => console.error(err))
    }
  }, [firstLoad]);

  useEffect(() => {
    if (project) {
      setIsReady(true);
    }
  }, [project]);

  return (
    <Layout header={header}>
      {isReady && (<Grid container spacing={3} sx={{ height: '100%' }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ px: 2, height: '100%' }}>
              <ItemList items={tasks} title='Tasks' action='Add' itemAction='Edit' handleClick={handleTasks} />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ px: 2, height: '100%' }}>
              <ItemList items={members} title='Members' action='Add' itemAction='Edit' handleClick={handleMembers} />
          </Card>
        </Grid>
      </Grid>)}
      {!isReady && <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Card>}
    </Layout>
  );
}
