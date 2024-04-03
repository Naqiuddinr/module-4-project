import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react"
import { auth } from "../firebase";
import { Container, Spinner } from "react-bootstrap";


export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubsribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        })

        return () => unsubsribe();
    }, [])

    const value = { currentUser };

    if (loading) {
        return (
            <Container
                style={{ height: "100vh" }}
                className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
            </Container>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
