"use client"

import { useEffect, useState } from "react"

export default function UserProfile (): JSX.Element {
  const [requestData, setRequesData] = useState<string>("Loading...")

  /**
   * Since this is a clientside request, this request will only be called once the page has actually loaded in the browser.
   * Compare this with the serverside request in the about page which is blocking i.e. the page wil load
   * only once the request has completed
   */
  useEffect(() => {
    void (async () => {
      const r = await fetch('https://hub.dummyapis.com/delay?seconds=20')
      setRequesData(await r.text())
    })()
  }, [])
  return (
    <div className='grid grid-cols-2 text-white p-4'>
      <div>
        <p className="text-black">Client component</p>
      </div>
      <div>
        <p className="text-black">{requestData}</p>
      </div>
    </div>
  )
}
