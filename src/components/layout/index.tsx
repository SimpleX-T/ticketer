import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "../Header";

export default function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Header />
      <Outlet />
    </>
  );
}
