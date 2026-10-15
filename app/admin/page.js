import AdminDashboard from "../../components/AdminDashboard";

export const metadata = {
  title: "Neend Mattress Admin",
  description: "Neend Mattress store management dashboard"
};

export default async function AdminPage() {
  return <AdminDashboard />;
}
