import { Layout, theme, Dropdown, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import logoLight from "../../../assets/logo.svg";
import logoDark from "../../../assets/logo-dark.svg";
import { useThemeStore } from "../../../store/themeStore.tsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const { Header } = Layout;
const { useToken } = theme;

const Navbar: React.FC = () => {
    const { token } = useToken();
    const darkMode = useThemeStore((state) => state.darkMode);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const menu = (
        <Menu>
            <Menu.Item key="impressum">
                <Link to="/impressum">Impressum</Link>
            </Menu.Item>
            <Menu.Item key="datenschutz">
                <Link to="/datenschutz">Datenschutz</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Header
            style={{
                backgroundColor: token.colorBgBase,
                padding: "0 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
                marginBottom: "4px",
            }}
        >
            <Link
                to="/"
                className="flex items-center hover:opacity-80"
                style={{
                    color: token.colorText,
                    textDecoration: "none",
                }}
            >
                <img
                    src={darkMode ? logoLight : logoDark}
                    alt="Rechnify Logo"
                    style={{ height: 50, width: "auto", objectFit: "contain" }}
                />
                <div className="text-lg font-bold ">Bachelorarbeit</div>
            </Link>

            <div className="flex items-center">
                {isMobile ? (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <MenuOutlined style={{ fontSize: 20, cursor: "pointer", color: token.colorText }} />
                    </Dropdown>
                ) : (
                    <div className="flex items-center gap-4 text-sm">
                        <Link to="/datenschutz"
                              style={{ color: token.colorText }}
                              className="hover:underline"
                        >
                            Datenschutz
                        </Link>
                        <Link
                            to="/impressum"
                            style={{ color: token.colorText }}
                            className="hover:underline"
                        >
                            Impressum
                        </Link>
                    </div>
                )}
            </div>
        </Header>
    );
};

export default Navbar;
