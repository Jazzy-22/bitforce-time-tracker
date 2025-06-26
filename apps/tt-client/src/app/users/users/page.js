import Layout from "@/components/layout";
import ManagerHeader from "@/components/managerHeader";

export default function Users() {
  const header = <ManagerHeader section='Users' title='Manage Users' />;
  return (
    <Layout header={header}>
      <h1>Home</h1>
    </Layout>
  );
}
