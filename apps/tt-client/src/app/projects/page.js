'use client'
import Layout from "@/components/layout";
import ManagerHeader from "@/components/managerHeader";
import { Alert, Box, Card } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

const NewProject = dynamic(() => import('@/components/newProject'), { ssr: false });
const EditProject = dynamic(() => import('@/components/editProject'), { ssr: false });
const ItemList = dynamic(() => import('@/components/itemList'), { ssr: false });

export default function Projects() {
  const header = <ManagerHeader section='Projects' title='Manage Projects'/>;
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [snack, setSnack] = useState({show: false, message: ''});
  const [firstLoad, setFirstLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [projects, setProjects] = useState(null);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [mainAction, setMainAction] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  const user = cookies.get('user');

  useEffect(() => {
    setFirstLoad(true);
  }, []);

  useEffect(() => {
    if (firstLoad) {
      getData();
      const c = cookies.get('user');
      if (c.access.includes('OJC')) {
        setMainAction(true);
      }
    }
  }, [firstLoad]);

  useEffect(() => {
    if (projects) {
      setIsReady(true);
    }
  }, [projects]);

  const getData = async () => {
    setIsReady(false);
    await axios.get(process.env.NEXT_PUBLIC_API_URL + '/projects')
    .then(res => {
      const p = res.data.data;
      p.forEach(project => {
        project.memberCount = project.members.length;
        project.primary = `${project.account.name} - ${project.name}`;
        project.secondary = `${project.memberCount} member${project.memberCount == 1 ? '' : 's'}`;
        project.membership = project.members?.find(m => m.user_id == user.id);
        project.itemAction = user.access?.includes('OJEA') ? true : (project.membership?.role?.permissions?.map((p) => p.label).some((l) => l.includes('edit')) ? true : false);
      });
      setProjects(p);
      setError(null);
    })
    .catch(err => {
      setError(err);
      setIsReady(true);
      });
  }


  const handleClick = (e) => {
    if (typeof e === 'number') {
      const key = projects.find(p => p.id === e).key;
      router.push(`/projects/${key}`);
      return;
    }
    e.stopPropagation();
    if (e.target.id === 'Add') {
      setOpenNew(true);
    } else {
      const [action, key] = e.target.id.split('-');
      if (action === 'Edit') {
        const p = projects.find(p => p.id == key);
        console.log(`Editing project ${key}: ${p}`);
        setProject(p);
        setOpenEdit(true);
      }
    }
  }

  const handleSuccess = (res) => {
    setSnack({show: true, message: `${res.data.name} project created successfully`});
    getData();
  }

  return (
    <Layout header={header}>
      {openNew && <NewProject open={openNew} onClose={() => setOpenNew(false)} onSuccess={handleSuccess} />}
      {openEdit && <EditProject open={openEdit} onClose={() => setOpenEdit(false)} onSuccess={handleSuccess} project={project} />}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        openNew={snack.show}
        onClose={() => setSnack({ ... snack, show: false })}
        autoHideDuration={5000}
      >
        <Alert severity='success' variant="filled" sx={{ width: '100%' }}>{snack.message}</Alert>
      </Snackbar>
      <Card sx={{ px: 2, height: '100%' }}>
        {isReady && projects && (<ItemList items={projects} title= 'Projects' itemAction='Edit' action='Add' canDo={mainAction} handleClick={handleClick} />)}
        {isReady && error && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Alert severity='error' variant="filled" sx={{ width: '100%' }}>{error?.message}. {error?.response?.data?.message}.</Alert>
          </Box>)}
        {!isReady && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>)}
      </Card>
    </Layout>
  );
}
