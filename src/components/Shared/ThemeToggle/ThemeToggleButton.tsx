"use client"
import { Button, Segmented } from "antd"
import { SunOutlined, MoonOutlined } from "@ant-design/icons"
import { useTheme } from "@/utils/CustomThemeProvider"

export default function ThemeToggleButton(): JSX.Element {
  const { themeMode, toggleTheme } = useTheme()

  return (
    <div className="w-full mt-7 lg:mt-32 flex flex-col gap-y-5 lg:gap-y-5">
      <div className="mx-auto mb-5">
        <Segmented
          size={"middle"}
          shape="round"
          options={[
            { value: "light", icon: <SunOutlined /> },
            { value: "dark", icon: <MoonOutlined /> }
          ]}
          color=""
          value={themeMode}
          onChange={toggleTheme}
          style={{
            border: themeMode === "light" ? "solid 1px #dedede" : "none",
            backgroundColor: themeMode === "light" ? "#ffa600" : "#000820",
            color: themeMode === "light" ? "#00323b" : "#ffc14f"
          }}
        />
      </div>

      <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-y-5 gap-x-10 justify-between">
        <Button
          variant="solid"
          color="default"
          onClick={toggleTheme}
          icon={themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
        >
          {themeMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>

        <Button
          variant="dashed"
          color="purple"
          onClick={toggleTheme}
          icon={themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
        >
          {themeMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>

        <Button
          variant="outlined"
          color="cyan"
          onClick={toggleTheme}
          icon={themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
        >
          {themeMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>

        <Button
          variant="filled"
          color="volcano"
          onClick={toggleTheme}
          icon={themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
        >
          {themeMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>

        <Button
          variant="solid"
          color="primary"
          onClick={toggleTheme}
          icon={themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
        >
          {themeMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>

        <Button
          color="primary"
          type="default"
          onClick={toggleTheme}
          icon={themeMode === "light" ? <MoonOutlined /> : <SunOutlined />}
        >
          {themeMode === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
      </div>
    </div>
  )
}
