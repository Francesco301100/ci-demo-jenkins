import { useThemeStore } from "./store/themeStore.tsx";
import { ConfigProvider, theme } from "antd";
import GlobalLayout from "./components/Layout/GlobalLayout/GlobalLayout.tsx";
import { Route, Routes } from "react-router-dom";
import CustomersPage from "./components/Customer/CustomerPage.tsx";


function App() {
    const darkMode = useThemeStore((state) => state.darkMode);
    const themeConfig = {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    };

    return (
        <ConfigProvider theme={themeConfig}>
            <Routes>
                <Route path="/" element={<GlobalLayout />}>
                    <Route index element={<CustomersPage />} />
                </Route>
            </Routes>
        </ConfigProvider>
    );
}

export default App;
