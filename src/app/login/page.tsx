export default function Login ({
  searchParams
}: {
  searchParams: Record<'status', string | string[] | undefined>
}): React.ReactNode {
  const status = searchParams.status

  return (
    <form action={'login/actions'} method="get">
      <div className="h-screen flex flex-col justify-center items-center space-y-2">
        <h1>Sign In</h1>
        {typeof status !== 'undefined'
          ? <div>
              <div className="alert alert-error capitalize">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{status}</span>
              </div>
            </div>
          : null}
        <input type="email" placeholder="Email" className="input input-bordered w-full max-w-xs" />
        <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" />
        <button type="submit" className="btn btn-primary">Login</button>
      </div>
    </form>
  )
}
