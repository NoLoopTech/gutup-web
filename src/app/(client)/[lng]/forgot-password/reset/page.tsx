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
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { resetPassword } from "@/app/api/auth/auth"
import { AxiosResponse } from "axios"

interface ResetPasswordResponse {
  message: string
  success: boolean
}

// Reset Password password validations schema
const ResetPasswordschema = z
  .object({
    newPassword: z
      .string()
      .nonempty("Required")
      .min(6, "Password must be at least 6 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().nonempty("Required")
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

type ResetPasswordFormData = z.infer<typeof ResetPasswordschema>

export default function ResetPasswordForm(): React.ReactNode {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const email = searchParams.get("email") || ""
  const otp = searchParams.get("otp") || ""

  // validate form
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordschema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  })

  // form Submit function
  const onSubmit = async (data: ResetPasswordFormData): Promise<void> => {
    setIsLoading(true)

    const formData = new FormData()
    formData.append("email", data.newPassword)

    try {
      const response = (await resetPassword(
        email,
        otp,
        data.newPassword
      )) as AxiosResponse<ResetPasswordResponse>

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message)
        router.push(`/login`)
      } else {
        toast.error("Reset password failed!", {
          description: response.data.message
        })
      }
    } catch (error) {
      toast.error("System Error!", {
        description: "Please try again later"
      })
      console.log("error", error)
    }

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
            <h1 className="font-semibold text-center ">Update New Password</h1>

            <div className="px-5 text-center">
              <Label className=" text-Primary-300">
                Please re enter email to sent a password reset link
              </Label>
            </div>
          </div>

          {/* password */}
          <div className="w-[100%]">
            {/* password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* password */}
          <div className="w-[100%]">
            {/* password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* login button */}
          <Button className="w-[100%]" type="submit">
            {isLoading && <Loader2Icon className="animate-spin" />}
            {isLoading ? "Please Wait" : " Reset Password"}
          </Button>

          {/* back button  */}
          <Link
            href={`/en/forgot-password/otp?email=${encodeURIComponent(email)}`}
          >
            <Button className="px-0 py-0" type="button" variant={"link"}>
              Back
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  )
}
