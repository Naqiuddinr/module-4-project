import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { useState } from "react";
import { Avatar } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


import HomeDashboard from "./pages/HomeDashboard/HomeDashboard";
import AuthPage from "./pages/AuthPage";
import AuthProvider from "./components/AuthProvider";
import store from "./store";
import ViewProfileDrawer from "./pages/ViewProfileDrawer";


function Layout() {

    const [showProfileDrawer, setShowProfileDrawer] = useState(false)

    const handleOpenProfileDrawer = () => setShowProfileDrawer(true)

    const user = useSelector((state) => state.user.user)

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/" className="d-inline-block align-top">
                        <Image
                            src="https://firebasestorage.googleapis.com/v0/b/tadel-app.appspot.com/o/tasks%2F16897435-removebg-preview.png?alt=media&token=4ab1ad38-c639-4936-a0b9-e751aaaa108a"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Tadel
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link className="d-flex align-items-center" onClick={handleOpenProfileDrawer}>
                                <Avatar className="me-2" src={user?.profile_pic} alt={user?.username} />
                                Profile
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
            <ViewProfileDrawer setShowProfileDrawer={setShowProfileDrawer} showProfileDrawer={showProfileDrawer} />
        </>
    )
}

export default function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
                <Provider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<AuthPage />} />
                            <Route path="/" element={<Layout />} >
                                <Route index element={<HomeDashboard />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </Provider>
            </AuthProvider>
        </LocalizationProvider>
    )
}


