"use client"

// components/layout/ClientSessionHandler.tsx
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import axiosInstance from "@/query/axios.instance"

const ClientSessionHandler = () => {
  const { data: session, status } = useSession()
  const [isSessionExpired, setIsSessionExpired] = useState(false)

  // Add the useEffect for the interceptor and session check
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.message === "Session expired") {
          setIsSessionExpired(true)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosInstance.interceptors.response.eject(interceptor)
    }
  }, [])

  // Handle unauthenticated status
  useEffect(() => {
    if (status === "unauthenticated") {
      setIsSessionExpired(true)
    }
  }, [status])

  const handleLogout = async () => {
    await signOut()
    window.location.href = "/login"
  }

  return (
    <>
      {/* Session expired confirmation popup */}
      <AlertDialog
        open={isSessionExpired}
        onOpenChange={() => setIsSessionExpired(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session Expired</AlertDialogTitle>
            <AlertDialogDescription>
              Your session has expired. Please log in again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleLogout}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ClientSessionHandler
