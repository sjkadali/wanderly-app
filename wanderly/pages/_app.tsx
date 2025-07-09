import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function App({ Component, pageProps }: AppProps) {
  const { user, logout } = useAuth(); // get user and logout from your auth hook

  return (
    <>
      <Navbar user={user ? { email: user.email ?? undefined } : undefined} onLogout={logout} />
      <Component {...pageProps} />
    </>
  );
}
