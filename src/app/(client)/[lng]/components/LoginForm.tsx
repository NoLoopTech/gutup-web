"use client"

import { Title } from "@/components/Shared"
import { FcGoogle } from "react-icons/fc"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
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

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters.")
})

type LoginFormData = z.infer<typeof LoginSchema>

export default function LoginForm(): React.ReactNode {
  const router = useRouter()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (data: LoginFormData): void => {
    console.log("Login Submitted:", data)
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
            <Button
              className="px-0 py-0 text-blue-600"
              type="button"
              variant={"link"}
              onClick={() => {
                router.push("/forgot-password")
              }}
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
    </Form>
  )
}
