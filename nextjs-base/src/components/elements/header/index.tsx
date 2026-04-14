import { getCurrentLocale } from "@/app/locales/server";
import HeaderContent from "@/components/elements/header/HeaderContent";
import { getNavigationMenu } from "@/lib/methods.server";

export default async function Header() {
  const locale = await getCurrentLocale();
  const navItems = await getNavigationMenu("main-navigation", locale);

  return <HeaderContent navItems={navItems} />;
}
