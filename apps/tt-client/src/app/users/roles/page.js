import Layout from "@/components/layout";
import ManagerHeader from "@/components/managerHeader";

export default function Roles() {
  const header = <ManagerHeader section='Users' title='Manage Roles' />;
  return (
    <Layout header={header}>
      <h1>Home</h1>
    </Layout>
  );
}
