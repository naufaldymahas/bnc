import { HomeProvider } from "./home-provider";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeProvider>{children}</HomeProvider>;
}
