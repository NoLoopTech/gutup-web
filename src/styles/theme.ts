import { theme, type ThemeConfig } from "antd"

// INFO: This is the light theme for antd
export const lightTheme: ThemeConfig = {
  token: {
    // colorPrimary: "#1677ff",
    // colorText: "#ffffff",
    //   borderRadius: 8,
    //   colorSplit: "#555",
    //   colorBorderBg: "#f00"
  },
  algorithm: theme.defaultAlgorithm, // INFO: This is the default theme from antd
  components: {
    // INFO: This is the custom theme for each component
    Button: {
      colorBgSolid: "#f00",
      colorBgSolidHover: "#f80",
      solidTextColor: "#000"
    },
    Modal: {
      colorBgMask: "rgba(0, 0, 0, 0.85)"
    }
  }
}

// INFO: This is the dark theme for antd
export const darkTheme: ThemeConfig = {
  // token: {
  //   colorPrimary: "#ff4d4f",
  //   colorText: "#ffffff",
  //   colorTextDescription: "#666"
  // },
  algorithm: theme.darkAlgorithm,
  components: {
    Modal: {
      colorBgMask: "rgba(0, 0, 0, 0.8)"
    }
  }
}

// INFO: This is custom themes for each component
export const componentThemes = {
  // INFO: This is the custom theme for Modal component used for mobile menu
  Modal: {
    mask: {
      backdropFilter: "blur(30px)",
      lightTheme,
      darkTheme
    },
    content: {
      backgroundColor: "transparent",
      marginTop: "-100px",
      borderRadius: "8px",
      boxShadow: "none"
    },
    body: {
      //   fontSize: token.fontSizeLG,
      padding: "24px"
    }
  }
}
