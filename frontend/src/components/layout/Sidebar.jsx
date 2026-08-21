export default function Sidebar({ children, open = false }) {
  return (
    <aside className={open ? "sidebar open" : "sidebar"}>{children}</aside>
  );
}
