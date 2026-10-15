// Admin styles come from the original admin panel and are only loaded on /admin.
import "./admin.css";

export const metadata = {
  title: "Neend Mattress Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }) {
  return children;
}
