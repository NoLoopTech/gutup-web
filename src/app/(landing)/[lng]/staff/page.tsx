import { Button } from "@/components/Shared"
import { useTranslation } from "@/i18n"
import Link from "next/link"
import UserProfile from "./UserProfile"

export default async function Staff({
  params: { lng }
}: {
  params: { lng: string }
}): Promise<JSX.Element> {
  const { t } = await useTranslation(lng, "translation")
  return (
    <div className="grid grid-cols-2 text-white p-4">
      <div>
        <h1 className="leading-loose text-[15rem] font-extrabold text-accent">
          {t("staff")}
        </h1>
      </div>
      <div>
        <UserProfile />
        <Link href={`/${lng}/about`} className="btn btn-primary">
          {t("about-us")}
        </Link>
        <Button variant="primary">Hello</Button>
      </div>
    </div>
  )
}
