export default function Login({
  searchParams
}: {
  searchParams: Record<"status", string | string[] | undefined>
}): React.ReactNode {
  const status = searchParams.status

  return <div></div>
}
