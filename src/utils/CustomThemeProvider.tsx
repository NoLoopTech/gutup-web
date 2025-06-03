"use client"

import { componentThemes, darkTheme, lightTheme } from "@/styles/theme"
import { ConfigProvider } from "antd"
import { createContext, useContext, useEffect, useState } from "react"

type ThemeMode = "light" | "dark"
interface ThemeContextType {
  themeMode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "light",
  toggleTheme: () => {}
})

export const useTheme = (): ThemeContextType => useContext(ThemeContext)

export default function CustomThemeProvider({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  // const [isHydrated, setIsHydrated] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>("light")

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeMode | null
    if (storedTheme) {
      setThemeMode(storedTheme)
    }
    // setIsHydrated(true)
  }, [])

  const toggleTheme = (): void => {
    setThemeMode(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light"
      localStorage.setItem("theme", newTheme)
      return newTheme
    })
  }

  // if (!isHydrated) {
  //   return <div className="opacity-0">Loading...</div>; // INFO: This is a fix for additional hydration errors. specifically for the SSR
  // }

  return (
    <ConfigProvider
      theme={
        themeMode === "dark" ? darkTheme : lightTheme // INFO: This is the custom theme
        // themeMode === "dark"
        //   ? { algorithm: theme.darkAlgorithm }
        //   : { algorithm: theme.defaultAlgorithm } // INFO: This is the default theme from antd. using this here will override the custom theme
      }
      modal={{ styles: componentThemes.Modal }}
    >
      <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
        <div className={themeMode}>{children}</div>
      </ThemeContext.Provider>
    </ConfigProvider>
  )
}
