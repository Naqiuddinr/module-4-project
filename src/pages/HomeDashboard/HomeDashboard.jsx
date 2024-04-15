import { Card, Fab } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { AuthContext } from "../../components/AuthProvider";
import { fetchAllTaskByUser } from "../../components/tadelSlice";
import CardTemplate from "./components/CardTemplate";
import AddTaskDrawer from "./components/AddTaskDrawer";
import { ViewTaskDialog } from "./components/ViewTaskDialog";
import { EditTaskDrawer } from "./components/EditTaskDrawer";


export default function HomeDashboard() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showAddDrawer, setShowAddDrawer] = useState(false)

    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [editTaskData, setEditTaskData] = useState(null);
    const [showEditDrawer, setShowEditDrawer] = useState(false);

    function handleViewTask(data) {
        setShowViewDialog(true);
        setSelectedTask(data)
    }

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
            <Container className="mb-4" style={{ borderBottom: "1px solid #BDBDBD", position: "relative", overflowX: "hidden" }}>
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
                    <h4 className="my-3 ms-3" style={{ color: "#424242" }}>To Do</h4>
                    <CardTemplate allTasks={allTasks} status="pending" handleViewTask={handleViewTask} />
                </Col>
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3" >
                    <h4 className="my-3 ms-3" style={{ color: "#424242" }}>In Progress</h4>
                    <CardTemplate allTasks={allTasks} status="progress" handleViewTask={handleViewTask} />
                </Col>
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3">
                    <h4 className="my-3 ms-3" style={{ color: "#424242" }}>Completed</h4>
                    <CardTemplate allTasks={allTasks} status="completed" handleViewTask={handleViewTask} />
                </Col>
            </Row>
            <AddTaskDrawer showAddDrawer={showAddDrawer} setShowAddDrawer={setShowAddDrawer} />
            <EditTaskDrawer editTaskData={editTaskData} showEditDrawer={showEditDrawer} setShowEditDrawer={setShowEditDrawer} />
            <ViewTaskDialog
                selectedTask={selectedTask} showViewDialog={showViewDialog} setShowViewDialog={setShowViewDialog}
                setEditTaskData={setEditTaskData} setShowEditDrawer={setShowEditDrawer} />
            <Fab
                variant="extended"
                style={{ position: "fixed", bottom: "3%", left: "50%", transform: "translate(-50%, 0%)" }}
                onClick={() => setShowAddDrawer(true)}
            >
                <PlaylistAddIcon sx={{ mr: 1 }} />
                Add Task
            </Fab>
        </>
    )
}
