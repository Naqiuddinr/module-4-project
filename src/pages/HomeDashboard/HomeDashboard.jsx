import { Card } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import { AuthContext } from "../../components/AuthProvider";
import { fetchAllTaskByUser } from "../../components/tadelSlice";
import CardTemplate from "./components/CardTemplate";
import AddTaskDrawer from "./components/AddTaskDrawer";


export default function HomeDashboard() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showAddDrawer, setShowAddDrawer] = useState(false)

    useEffect(() => {
        if (currentUser === null) {
            navigate("/login")
            return
        }

        dispatch(fetchAllTaskByUser(currentUser.uid))

    }, [currentUser, navigate, dispatch])

    const allTasks = useSelector((state) => state.tasks.tasks)

    return (
        <>
            <Container className="mb-4" style={{ borderBottom: "1px solid #BDBDBD" }}>
                <Row className="my-5 justify-content-center">
                    <Col md={4}>
                        <Card>
                            This wall have a small calender or weather forecast?
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card>
                            Show the users progress
                        </Card>
                    </Col>
                    <Col md={5}>
                        <Card>
                            Show the team members progress
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Row className="justify-content-center">
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3">
                    <h5 className="mt-3" style={{ color: "#424242" }}>To Do</h5>
                    <div className="d-flex justify-content-center mb-2">
                        <Button size="sm" variant="outline-light rounded-pill" onClick={() => setShowAddDrawer(true)}>
                            <AddCircleOutlineRoundedIcon style={{ color: "#616161" }} />
                        </Button>
                    </div>
                    <CardTemplate allTasks={allTasks} status="pending" />
                </Col>
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3" >
                    <h5 className="mt-3" style={{ color: "#424242" }}>In Progress</h5>
                    <div className="d-flex justify-content-center mb-2">
                        <Button size="sm" variant="outline-light rounded-pill" onClick={() => setShowAddDrawer(true)}>
                            <AddCircleOutlineRoundedIcon style={{ color: "#616161" }} />
                        </Button>
                    </div>
                    <CardTemplate allTasks={allTasks} status="progress" />
                </Col>
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3">
                    <h5 className="mt-3" style={{ color: "#424242" }}>Completed</h5>
                    <div className="d-flex justify-content-center mb-2">
                        <Button size="sm" variant="outline-light rounded-pill">
                            <AddCircleOutlineRoundedIcon style={{ color: "#616161" }} />
                        </Button>
                    </div>
                    <CardTemplate allTasks={allTasks} status="completed" />
                </Col>
            </Row>
            <AddTaskDrawer allTasks={allTasks} showAddDrawer={showAddDrawer} setShowAddDrawer={setShowAddDrawer} />
        </>
    )
}


