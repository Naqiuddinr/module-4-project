import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
    addNewTeamMember,
    deleteTeamMemberById,
    editUserProfileData,
    fetchAllTeamByUser,
    fetchCurrentUserData
} from "../components/tadelSlice";
import { auth } from "../firebase";
import { AuthContext } from "../components/AuthProvider";
import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { Button, Col, Form, Image, InputGroup, Row } from "react-bootstrap";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, accordionSummaryClasses, Drawer } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';

const invitePic = "https://firebasestorage.googleapis.com/v0/b/tadel-app.appspot.com/o/placeholder%2FEmail%20Invitation.JPG?alt=media&token=fa0e846a-c937-4089-b693-82cb15ff7a94"


export default function ViewProfileDrawer({ showProfileDrawer, setShowProfileDrawer }) {

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
    const [image, setImage] = useState("");
    const [newUsername, setNewUsername] = useState("");

    const handleImageUpload = (e) => setImage(e.target.files[0]);

    function handleCloseEditMode() {
        setEditProfileMode(false)
        setImage("")
        setNewUsername("")
    }

    function handleEditProfile() {

        const newProfileData = {
            username: newUsername == "" ? null : newUsername,
            imageUpload: image == "" ? null : image,
            email: currentUser?.email
        }

        dispatch(editUserProfileData(newProfileData));
        handleCloseEditMode();
    }

    function handleLogout(e) {
        e.preventDefault();
        auth.signOut();
    }

    const [showDeleteProfileDialog, setShowDeleteProfileDialog] = useState(false)

    return (
        <>
            <Drawer size="md" open={showProfileDrawer} onClose={() => setShowProfileDrawer(false)}>
                <Row className="p-5 mt-1 justify-content-center">
                    <Image
                        src={user?.profile_pic}
                        style={{ width: "220px", height: "220px", padding: 0, border: "5px solid #E5E7E9" }}
                        roundedCircle />
                </Row>
                <Row className="text-center">
                    <h2>{user?.username}</h2>
                    <h4>{currentUser?.email}</h4>
                </Row>
                {editProfileMode ? (
                    <>
                        <Form className="mx-5 mt-4" onSubmit={handleEditProfile}>
                            <Form.Group className="mb-3">
                                <Form.Label>New Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>New Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Row>
                                <Col>
                                    <Button className="mt-5" variant="warning" type="submit">Save</Button>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button className="mt-5" variant="outline-danger" onClick={() => setShowDeleteProfileDialog(true)}>Delete Profile</Button>
                                </Col>
                            </Row>
                        </Form>
                    </>

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
                    {editProfileMode ? (
                        <Col className="d-flex justify-content-center">
                            <Button variant="outline-dark" onClick={handleCloseEditMode}>Back</Button>
                        </Col>
                    ) : (
                        <>
                            <Col className="d-flex justify-content-end">
                                <Button variant="outline-dark" onClick={() => setEditProfileMode(!editProfileMode)}>Edit Profile</Button>
                            </Col>
                            <Col>
                                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                            </Col>
                        </>
                    )}
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
                            <>
                                <span>
                                    We could not find this user, would you like us to send an invitation email to <b>{memberEmail}</b>?
                                </span>
                                <br />
                                <br />
                                <span>
                                    DISCLAIMER: For demo purpose, Tadel uses the free version of mailgun. Please click <a href={invitePic} target="_blank" rel="noopener noreferrer">here</a> to see the sample email.
                                </span>
                            </>
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
            <Dialog
                open={showDeleteProfileDialog}
                onClose={() => setShowDeleteProfileDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Warning
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We are sorry to hear that you would like to delete your account!
                    </DialogContentText>
                    <br />
                    <DialogContentText id="alert-dialog-description">
                        By deleting account, all existing data will be removed from our database
                    </DialogContentText>
                    <br />
                    <DialogContentText id="alert-dialog-description">
                        Type in <b>delete my account</b> in the input box and click delete to proceed
                    </DialogContentText>
                    <Form.Control />
                    <br />
                    <DialogContentText id="alert-dialog-description">
                        Thank you for using Tadel, we hope to see you again soon!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button variant="outline-danger" disabled>Delete</Button>
                        <Button variant="outline-secondary" onClick={() => setShowDeleteProfileDialog(false)}>Back</Button>
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