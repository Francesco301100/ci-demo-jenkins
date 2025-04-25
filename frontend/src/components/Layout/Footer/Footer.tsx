import { Layout, Switch } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import {useThemeStore} from "../../../store/themeStore.tsx";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
    const darkMode = useThemeStore((state) => state.darkMode);
    const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

    return (
        <Footer
            style={{
                boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
                marginTop: "4px",
            }}
            className="flex justify-center items-center p-4"
        >
            <span className="mr-2">Bachelorarbeit | Theme:</span>
            <Switch
                size="small"
                checked={darkMode}
                onChange={toggleDarkMode}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
            />
        </Footer>
    );
};

export default AppFooter;