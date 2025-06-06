"use client"

import { FcGoogle } from "react-icons/fc"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

// login form validations schema
const LoginSchema = z.object({
  email: z.string().nonempty("Required").email("Please enter a valid email."),
  password: z
    .string()
    .nonempty("Required")
    .min(6, "Password must be at least 6 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character")
})

type LoginFormData = z.infer<typeof LoginSchema>

export default function LoginForm(): React.ReactNode {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // validate form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  // form Submit function
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true)

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password
    })

    if (res?.ok && !res.error) {
      // Redirect manually (optional: use router.push)
      window.location.href = "/"
    } else {
      toast.error("Login failed!", {
        description: res?.error
      })
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
            <h1 className="font-semibold text-center ">Login to you Account</h1>

            <div className="px-5 text-center">
              <Label className=" text-Primary-300">
                Enter credentials to login to your admin account
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

          {/* Password */}
          <div className="w-[100%]">
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* forget password link */}
          <div className="w-[100%] flex justify-end">
            <Link href={"/forgot-password"}>
              <Button
                className="px-0 py-0 text-blue-600"
                type="button"
                variant={"link"}
              >
                Forgot password?
              </Button>
            </Link>
          </div>

          {/* login button  */}
          <Button className="w-[100%]" type="submit" disabled={isLoading}>
            {isLoading && <Loader2Icon className="animate-spin" />}
            {isLoading ? "Please Wait" : " Login"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
