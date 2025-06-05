import LoginForm from "./partials/LoginForm"

export default async function Login({
  searchParams
}: {
  searchParams: Record<"status", string | string[] | undefined>
}): Promise<any> {
  const status = searchParams.status

  return <LoginForm />
}
