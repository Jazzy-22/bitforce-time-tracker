import Layout from "@/components/layout";
import ManagerHeader from "@/components/managerHeader";

export default function Teams() {
  const header = <ManagerHeader section='Users' title='Manage Teams' />;
  return (
    <Layout header={header}>
      <h1>Home</h1>
    </Layout>
  );
}
