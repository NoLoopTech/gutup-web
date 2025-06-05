"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"

// Forgot Password otp validations schema
const OtpSchema = z.object({
  otp: z
    .string()
    .nonempty("Required")
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits")
})

type OtpFormData = z.infer<typeof OtpSchema>

export default function OtpForm(): React.ReactNode {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // validate form
  const form = useForm<OtpFormData>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: ""
    }
  })

  // form Submit function
  const onSubmit = async (data: OtpFormData): Promise<void> => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("otp", String(data.otp))

    console.log("verify otp Submitted:", data)

    router.push(`/forgot-password/reset`)

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        className="overflow-y-auto md:grid"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* second column */}
        <div className="flex flex-col items-center justify-center max-w-[450px] mx-auto px-5 space-y-3 md:space-y-4 py-5">
          <div className="space-y-2">
            {/* title  */}
            <h1 className="font-semibold text-center ">Enter OTP</h1>

            <div className="px-5 text-center">
              <Label className=" text-Primary-300">
                Enter the 6 digit code sent to your email
              </Label>
            </div>
          </div>

          {/* otp */}
          <div>
            {/* otp Field */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="text-lg text-center border border-gray-300 rounded-md w-9 h-9"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* login button  */}
          <Button className="w-[100%]" type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            {isLoading ? "Please Wait" : " Submit"}
          </Button>

          {/* back button  */}
          <Link href={"/forgot-password"}>
            <Button className="px-0 py-0" type="button" variant={"link"}>
              Back
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  )
}
