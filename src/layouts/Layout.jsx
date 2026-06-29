import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <TopBar />
      <div class="flex">
        <main class="flex-grow p-md lg:p-xl space-y-lg">
          <Outlet />
        </main>
      </div>
    </>
  );
}
