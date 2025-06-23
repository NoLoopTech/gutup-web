import ForgetPasswordForm from "./partials/ForgotPasswordForm"

export default function ForgetPassword({
  searchParams
}: {
  searchParams: Record<"status", string | string[] | undefined>
}): React.ReactNode {
  return <ForgetPasswordForm />
}
