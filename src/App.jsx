import { Container, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { auth } from '../src/firebase'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


import HomeDashboard from "./pages/HomeDashboard/HomeDashboard";
import AuthPage from "./pages/AuthPage";
import AuthProvider from "./components/AuthProvider";
import store from "./store";


function Layout() {

    function handleLogout(e) {
        e.preventDefault();
        auth.signOut();
        console.log("signed out")

    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/" className="d-inline-block align-top">
                        <Image
                            src="src\assets\16897435-removebg-preview.png"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Tadel
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title={auth.currentUser?.email} id="basic-nav-dropdown" align="end">
                                <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="/admin">Admin</NavDropdown.Item>
                                <NavDropdown.Item style={{ color: "red" }} onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
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
