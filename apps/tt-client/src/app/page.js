import Layout from "@/components/layout";
import { Card } from "@mui/material";

export default function Home() {
  return (
    <Layout>
      <Card sx={{ px: 2, height: '100%', flexGrow: 1 }}><h1>Welcome to TimeTrack</h1></Card>
    </Layout>
  );
}
