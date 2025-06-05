"use client"

import { Input } from "@/components/ui/input"
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
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"

// Forgot Password email validations schema
const ForgotPasswordschema = z.object({
  email: z.string().nonempty("Required").email("Please enter a valid email.")
})

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordschema>

export default function ForgotPasswordForm(): React.ReactNode {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // validate form
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordschema),
    defaultValues: {
      email: ""
    }
  })

  // form Submit function
  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("email", data.email)

    console.log("verify email Submitted:", data)

    router.push(
      `/en/forgot-password/otp?email=${encodeURIComponent(data.email)}`
    )

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
            <h1 className="font-semibold text-center ">Forgot Password</h1>

            <div className="px-5 text-center">
              <Label className=" text-Primary-300">
                Please enter your email address to receive a verification code.
              </Label>
            </div>
          </div>

          {/* email */}
          <div className="w-[100%]">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* login button  */}
          <Button className="w-[100%]" type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            {isLoading ? "Please Wait" : "  Send OTP"}
          </Button>

          {/* back button  */}
          <Link href={"/login"}>
            <Button className="px-0 py-0" type="button" variant={"link"}>
              Back
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  )
}
