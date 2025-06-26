import Layout from "@/components/layout";
import ManagerHeader from "@/components/managerHeader";

export default function Profiles() {
  const header = <ManagerHeader section='Users / Profiles' title='Manage Profiles' />;
  return (
    <Layout header={header}>
      <h1>Home</h1>
    </Layout>
  );
}
