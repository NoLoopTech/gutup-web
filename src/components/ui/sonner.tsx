"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps): JSX.Element => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group z-[9999]" // Add a high z-index to ensure it appears above modals
      toastOptions={{
        classNames: {
          toast: `
            group 
            border 
            border-border 
            bg-background 
            text-foreground 
            shadow-lg 
            rounded-xl 
            px-4 
            py-3 
            transition-all 
            duration-300 
            ease-in-out
            hover:shadow-xl
          `,
          description: `
            text-sm 
            text-muted-foreground 
            mt-1
          `,
          actionButton: `
            bg-primary 
            text-primary-foreground 
            px-3 
            py-1.5 
            rounded-md 
            hover:bg-primary/90 
            transition
          `,
          cancelButton: `
            bg-muted 
            text-muted-foreground 
            px-3 
            py-1.5 
            rounded-md 
            hover:bg-muted/80 
            transition
          `
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
