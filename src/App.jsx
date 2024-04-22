import { Container, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { auth } from '../src/firebase'
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


import HomeDashboard from "./pages/HomeDashboard/HomeDashboard";
import AuthPage from "./pages/AuthPage";
import AuthProvider, { AuthContext } from "./components/AuthProvider";
import store from "./store";

import { Drawer } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import { Row, Col, Button, InputGroup, Form } from "react-bootstrap"
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/joy/AccordionSummary';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
import axios from "axios";
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { addNewTeamMember, deleteTeamMemberById, fetchAllTeamByUser, fetchCurrentUserData } from "./components/tadelSlice";


function Layout() {

    const [showProfileDrawer, setShowProfileDrawer] = useState(false)

    const handleOpenProfileDrawer = () => setShowProfileDrawer(true)

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
                            <NavDropdown title={auth.currentUser?.email} id="basic-nav-dropdown" align="end">
                                <NavDropdown.Item onClick={handleOpenProfileDrawer}>Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item style={{ color: "red" }} onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
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


function ViewProfileDrawer({ showProfileDrawer, setShowProfileDrawer }) {

    const API_URL = import.meta.env.VITE_TADEL_API_URL;
    const dispatch = useDispatch();
    const { currentUser } = useContext(AuthContext)

    const [memberEmail, setMemberEmail] = useState("");
    const [userFound, setUserFound] = useState(false);

    useEffect(() => {

        dispatch(fetchAllTeamByUser(currentUser?.email));
        dispatch(fetchCurrentUserData(currentUser?.uid));

    }, [dispatch, currentUser])


    const members = useSelector((state) => state.team.team)

    const user = useSelector((state) => state.user.user)

    async function checkUser() {

        if (memberEmail === "") {
            return
        }

        const res = await axios.get(`${API_URL}/users`, { params: { email: memberEmail } })

        const searchResult = res.data.email;

        setUserFound(searchResult);
        handleClickOpen();
    }

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setMemberEmail("")
        setOpen(false);
    };

    function handleAddMember() {

        const newMemberInfo = {
            originator: currentUser?.email,
            team_member: memberEmail
        }

        dispatch(addNewTeamMember(newMemberInfo));
        handleClose();

    }

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null)

    function openDeleteDialog({ member }) {
        setShowDeleteDialog(true);
        setMemberToDelete(member)
    }


    function handleDeleteMember(member_id) {

        dispatch(deleteTeamMemberById(member_id))
        setShowDeleteDialog(false);

    }

    const [inviteSnack, setInviteSnack] = useState(false)

    async function handleSendInvite(memberEmail) {

        const inviteData = {
            email: memberEmail,
            originator: currentUser?.email
        }

        console.log(inviteData)

        await axios.post(`${API_URL}/team/invite`, inviteData)
        handleClose();
        setInviteSnack(true)

    }

    const [editProfileMode, setEditProfileMode] = useState(false)

    return (
        <>
            <Drawer size="md" open={showProfileDrawer} onClose={() => setShowProfileDrawer(false)}>
                <Row className="p-5 mt-5 justify-content-center">
                    <Image
                        src={user?.profile_pic}
                        style={{ width: "220px", height: "220px", padding: 0, border: "5px solid #E5E7E9" }}
                        roundedCircle />
                </Row>
                <Row className="text-center">
                    <h2>{user?.username}</h2>
                    <h3>{currentUser?.email}</h3>
                </Row>
                {editProfileMode ? (
                    <h3>Hello Reagan</h3>
                ) : (
                    <>
                        <Row className="mx-4 mt-5 mb-3">
                            <AccordionGroup sx={{
                                [`& .${accordionSummaryClasses.indicator}`]: {
                                    transition: '0.2s',
                                },
                                [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                                    transform: 'rotate(45deg)',
                                },
                            }}>
                                <Accordion>
                                    <AccordionSummary indicator={<AddIcon />}>
                                        <h4>Team Members</h4>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <InputGroup className="my-3">
                                            <Form.Control
                                                type="email"
                                                placeholder="Email Address"
                                                value={memberEmail}
                                                onChange={(e) => setMemberEmail(e.target.value)}
                                            />
                                            <Button variant="outline-secondary" className="d-flex align-items-center" onClick={checkUser}>
                                                <AddIcon /> Add New
                                            </Button>
                                        </InputGroup>
                                    </AccordionDetails>
                                </Accordion>
                            </AccordionGroup>
                        </Row>
                        {members.map((member) => (
                            <Row className="mx-4" key={member.team_member}>
                                <Col>
                                    <p>{member.team_member}</p>
                                </Col>
                                <Col className="d-flex justify-content-end me-2">
                                    <b
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openDeleteDialog({ member })}
                                    >x</b>
                                </Col>
                            </Row>
                        ))}
                    </>

                )}

                <Row className="mt-auto mb-4">
                    <Col className="d-flex justify-content-end">
                        <Button variant="outline-secondary" onClick={() => setEditProfileMode(!editProfileMode)}>Edit Profile</Button>
                    </Col>
                    <Col>
                        <Button variant="outline-danger" disabled>Delete Profile</Button>
                    </Col>
                </Row>

            </Drawer>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {userFound ? "Confirmation required" : "Send Invitation"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {userFound ? (
                            <span>
                                Please confirm if <b>{memberEmail}</b> is correct before we proceed
                            </span>
                        ) : (
                            <span>
                                We could not find this user, would you like us to send an invitation email to <b>{memberEmail}</b>?
                            </span>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {userFound ? (
                        <>
                            <Button variant="outline-success" onClick={handleAddMember}>Confirm</Button>
                            <Button variant="outline-secondary" onClick={handleClose}>Back</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline-warning" onClick={() => handleSendInvite(memberEmail)}>Send</Button>
                            <Button variant="outline-secondary" onClick={handleClose}>Back</Button>
                        </>

                    )}
                </DialogActions>
            </Dialog>
            <Dialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please confirm if you would like to remove {memberToDelete?.team_member} from your team
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button variant="outline-danger" onClick={() => handleDeleteMember(memberToDelete.member_id)}>Remove</Button>
                        <Button variant="outline-secondary" onClick={() => setShowDeleteDialog(false)}>Back</Button>
                    </>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={inviteSnack}
                autoHideDuration={3000}
                onClose={() => setInviteSnack(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setInviteSnack(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Invitation email sent!
                </Alert>
            </Snackbar>
        </>
    )
}