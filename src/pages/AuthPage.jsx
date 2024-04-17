import { useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { auth } from "../firebase"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { Alert, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendUserDataToBackend } from "../components/tadelSlice";

export default function AuthPage() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [toggleAuth, setToggleAuth] = useState("login");
    const [signupSnack, setSignupSnack] = useState(false);
    const [resetPasswordSnack, setResetPasswordSnack] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSignupSnack(false);
        setResetPasswordSnack(false);
    };

    function toggleSignup() {
        setToggleAuth("signup");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
    }
    function toggleLogin() {
        setToggleAuth("login");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
    }

    async function handleSignup(e) {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password)

            const newUserData = {
                firebase_uid: auth.currentUser.uid,
                email: auth.currentUser.email,
                username: username
            };

            dispatch(sendUserDataToBackend(newUserData));

            setEmail("");
            setPassword("");
            setSignupSnack(true);
            setToggleAuth("login")
            setErrorMessage("")
        } catch (err) {
            if (err.code === 'auth/weak-password') {
                setErrorMessage("Password need to be at least 6 characters")
                console.log(err.code)
            } else if (err.code === 'auth/email-already-in-use') {
                setErrorMessage("Sorry, this email is already in use!")
                console.log(err.code)
            }
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setEmail("");
            setPassword("");
            navigate("/")
        } catch (err) {
            if (err.code === 'auth/invalid-credential') {
                setErrorMessage("Wrong email/password, please check and try again")
                console.log(err.code)
            }
        }
    }

    async function handlePasswordReset(e) {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email)
            setResetPasswordSnack(true)
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <>
            <Container className="p-5 mt-5">
                <Row>
                    <Col sm={7} className="d-flex align-items-center justify-content-center">
                        <Image src="https://firebasestorage.googleapis.com/v0/b/tadel-app.appspot.com/o/tasks%2F16897435-removebg-preview.png?alt=media&token=4ab1ad38-c639-4936-a0b9-e751aaaa108a" style={{ height: "200px" }} />
                        {toggleAuth === "login" ? (
                            <h2>Tadel, where delegating tasks is no longer a task</h2>
                        ) : (
                            <h2>Your Path to Effortless Delegation Begins Here</h2>
                        )}
                    </Col>
                    <Col sm={5} className="my-5">
                        <Form>
                            {toggleAuth === "signup" &&
                                <Form.Group className="my-3" controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            }
                            <Form.Group className="my-3" controlId="email">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email here"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {errorMessage === "Sorry, this email is already in use!" && (
                                    <Form.Text className="text-muted">{errorMessage}</Form.Text>
                                )}
                            </Form.Group>
                            <Form.Group className="my-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password here"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {errorMessage === "Wrong email/password, please check and try again" && (
                                    <Form.Text className="mt-3 text-muted">{errorMessage}</Form.Text>
                                )}
                            </Form.Group>
                            {toggleAuth === "signup" &&
                                <Form.Group className="my-3" controlId="confirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Re-Enter your password here"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {confirmPassword !== password && (
                                        <Form.Text className="text-danger">
                                            Please check the password entered
                                        </Form.Text>)}
                                    {errorMessage === "Password need to be at least 6 characters" && (
                                        <Form.Text className="text-muted">{errorMessage}</Form.Text>
                                    )}
                                </Form.Group>
                            }
                            {toggleAuth === "login" ? (
                                <Button variant="outline-secondary" className="rounded-pill my-3" onClick={handleLogin}>Login</Button>
                            ) : (
                                <Button variant="outline-success" className="rounded-pill my-3" onClick={handleSignup}>Register</Button>
                            )}
                            <br />
                            {errorMessage === "Wrong email/password, please check and try again" && (
                                <Form.Text className="mt-3 text-muted">Reset password? Click <a style={{ color: "blue", cursor: "pointer" }} onClick={handlePasswordReset}>here</a></Form.Text>
                            )}
                            <br />
                            <br />
                            <br />
                            <Form.Group>
                                {toggleAuth === "login" ? (
                                    <Form.Text className="text-muted">Don&apos;t have an account? Sign up <a style={{ color: "blue", cursor: "pointer" }} onClick={toggleSignup}>here</a></Form.Text>
                                ) : (
                                    <Form.Text className="text-muted">Already have an account? Sign in <a style={{ color: "blue", cursor: "pointer" }} onClick={toggleLogin}>here</a></Form.Text>
                                )}
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={signupSnack}
                autoHideDuration={3000}
                onClose={handleCloseSnack}
            >
                <Alert
                    severity="success"
                    sx={{ width: '100%' }}
                    onClose={handleCloseSnack}
                >
                    Successfully registered, you can now sign in!
                </Alert>
            </Snackbar>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={resetPasswordSnack}
                autoHideDuration={3000}
                onClose={handleCloseSnack}
            >
                <Alert
                    severity="info"
                    sx={{ width: '100%' }}
                    onClose={handleCloseSnack}
                >
                    Please check your email!
                </Alert>
            </Snackbar>
        </>
    )
}
