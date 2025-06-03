"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function ForgotPasswordForm(): React.ReactNode {
  const router = useRouter()

  return (
    <form className="overflow-y-auto md:grid">
      {/* second column */}
      <div className="flex flex-col items-center justify-center max-w-[450px] mx-auto px-5 space-y-3 md:space-y-4 py-5">
        <div className="space-y-2">
          {/* title  */}
          <h1 className="text-xl font-semibold text-center md:text-2xl">
            Forgot Password
          </h1>
          <div className="px-5 text-center">
            <Label className=" text-Primary-300">
              Please enter your email address to receive a verification code.
            </Label>
          </div>
        </div>

        {/* email */}
        <div className="w-[100%]">
          <Label className="w-[100%]">Email</Label>
          <Input placeholder={"Email"} />
        </div>

        {/* login button  */}
        <Button className="w-[100%]" type="submit">
          Send OTP
        </Button>

        <Button
          className="px-0 py-0"
          type="button"
          variant={"link"}
          onClick={() => {
            router.push("/login")
          }}
        >
          Back
        </Button>
      </div>
    </form>
  )
}
