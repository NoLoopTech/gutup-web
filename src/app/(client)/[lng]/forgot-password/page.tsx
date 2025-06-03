import ForgetPasswordForm from "../components/ForgotPasswordForm"

export default function ForgetPassword({
  searchParams
}: {
  searchParams: Record<"status", string | string[] | undefined>
}): React.ReactNode {
  const status = searchParams.status

  return <ForgetPasswordForm />
}
