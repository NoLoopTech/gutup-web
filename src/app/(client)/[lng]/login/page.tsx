import Image from "next/image"
import Logo from "@/../public/logo/logo.png"
import { Title } from "@/components/Shared"
import { FcGoogle } from "react-icons/fc"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Login({
  searchParams
}: {
  searchParams: Record<"status", string | string[] | undefined>
}): React.ReactNode {
  const status = searchParams.status

  return (
    <form className="h-screen grid-cols-2 overflow-y-auto md:grid">
      {/* first column */}
      <div className="flex items-center justify-center p-5 bg-Primary-700">
        <Image src={Logo} alt="Logo" width={500} height={400} />
      </div>

      {/* second column */}
      <div className="flex flex-col items-center justify-center max-w-[450px] mx-auto px-5 space-y-3 md:space-y-4 py-5">
        <div className="space-y-2">
          <Title
            title={"Login to you Account"}
            textSize="text-xl md:text-2xl"
            align="text-center"
          />
          <div className="px-5 text-center">
            <Label className=" text-Primary-300">
              Enter credentials to login to your admin account
            </Label>
          </div>
        </div>

        {/* email */}
        <div className="w-[100%]">
          <Label className="w-[100%]">Email</Label>
          <Input placeholder={"Email"} />
        </div>

        {/* Password */}
        <div className="w-[100%]">
          <Label className="w-[100%]">Password</Label>
          <Input placeholder={"Password"} />
        </div>

        {/* forget password link */}
        <div className="w-[100%] flex justify-end">
          <Button
            className="px-0 py-0 text-blue-600"
            type="button"
            variant={"link"}
          >
            Forgot password?
          </Button>
        </div>

        {/* login button  */}
        <Button className="w-[100%]" type="submit">
          Login
        </Button>

        {/* OR CONTINUE WITH */}
        <div className="flex items-center w-full gap-4 py-2">
          <Separator className="flex-1 bg-Primary-100" />

          <Label className=" text-muted-foreground whitespace-nowrap">
            OR CONTINUE WITH
          </Label>
          <Separator className="flex-1 bg-Primary-100" />
        </div>

        {/* sign in with google icon */}
        <Button className="w-[100%]" type="button" variant={"outline"}>
          <FcGoogle className="text-lg" />
          Sign in with Google
        </Button>
      </div>
    </form>
  )
}
