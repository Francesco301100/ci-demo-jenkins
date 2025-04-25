import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar.tsx";
import AppFooter from "../Footer/Footer.tsx";
import { useThemeStore } from "../../../store/themeStore.tsx";

const { Content } = Layout;
const { useToken } = theme;

const GlobalLayout: React.FC = () => {
    const { token } = useToken();
    const { darkMode } = useThemeStore();

    return (
        <Layout  data-testid="layout-wrapper" className={`min-h-screen flex flex-col ${darkMode ? "bg-[#282828]" : "bg-gray-50"}`}>
            <Navbar />
            <Content
                style={{
                    backgroundColor: token.colorBgContainer,
                    padding: "24px",
                    flex: 1,
                }}
            >
                <Outlet />
            </Content>
            <AppFooter />
        </Layout>
    );
};

export default GlobalLayout;
