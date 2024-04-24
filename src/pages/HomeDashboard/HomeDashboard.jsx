import { Fab, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Card, Col, Container, ProgressBar, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { AuthContext } from "../../components/AuthProvider";
import { fetchAllTaskByUser } from "../../components/tadelSlice";
import CardTemplate from "./components/CardTemplate";
import AddTaskDrawer from "./components/AddTaskDrawer";
import { ViewTaskDialog } from "./components/ViewTaskDialog";
import { EditTaskDrawer } from "./components/EditTaskDrawer";
import { Gauge, gaugeClasses } from "@mui/x-charts";


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
    const loading = useSelector((state) => state.tasks.loading)

    const pendingUserTasks = allTasks.filter((task) => task.status === 'pending' && task.assignee === currentUser?.email).length;
    const progressUserTasks = allTasks.filter((task) => task.status === 'progress' && task.assignee === currentUser?.email).length;
    const completedUserTasks = allTasks.filter((task) => task.status === 'completed' && task.assignee === currentUser?.email).length;
    const totalUserTasks = allTasks.filter((task) => task.assignee === currentUser?.email).length;

    const pendingUserProgress = ((pendingUserTasks + progressUserTasks) / totalUserTasks) * 100;
    const completedUserProgress = (completedUserTasks / totalUserTasks) * 100;

    const pendingTeamTasks = allTasks.filter((task) => task.status === 'pending' && task.assignee !== currentUser?.email).length;
    const progressTeamTasks = allTasks.filter((task) => task.status === 'progress' && task.assignee !== currentUser?.email).length;
    const completedTeamTasks = allTasks.filter((task) => task.status === 'completed' && task.assignee !== currentUser?.email).length;
    const totalTeamTasks = allTasks.filter((task) => task.assignee !== currentUser?.email).length;

    const pendingTeamProgress = ((pendingTeamTasks + progressTeamTasks) / totalTeamTasks) * 100;
    const completedTeamProgress = (completedTeamTasks / totalTeamTasks) * 100;

    const pendingTasks = pendingUserTasks + pendingTeamTasks;
    const progressTasks = progressUserTasks + progressTeamTasks;
    const completedTasks = completedUserTasks + completedTeamTasks;
    const totalTasks = totalUserTasks + totalTeamTasks;

    console.log(allTasks.status)


    return (
        <>
            <Container className="mb-4" style={{ borderBottom: "1px solid #BDBDBD", position: "relative", overflowX: "hidden" }}>
                <Row className="my-3 justify-content-center">
                    <h2 className="mb-2">My Dashboard</h2>
                    <Col xl={4} lg={6}>
                        <Card style={{ height: "170px" }}>
                            <Row>
                                <Col className="mt-4">
                                    <Gauge
                                        value={completedTasks}
                                        valueMax={totalTasks}
                                        height={120}
                                        startAngle={-110}
                                        endAngle={110}
                                        sx={{
                                            [`& .${gaugeClasses.valueText}`]: {
                                                fontSize: 15,
                                                transform: 'translate(0px, 15px)',
                                            },
                                        }}
                                        text={
                                            ({ value, valueMax }) => `${value} / ${valueMax}
                                            Completed Task`
                                        }
                                    />
                                </Col>
                                <Col className="mt-3">
                                    <h5>Status Report:</h5>
                                    <p style={{ marginBottom: "2px" }}>Total Tasks: {totalTasks}</p>
                                    <p style={{ marginBottom: "2px" }}>Pending Tasks: {pendingTasks}</p>
                                    <p style={{ marginBottom: "2px" }}>In-Progress Tasks: {progressTasks}</p>
                                    <p style={{ marginBottom: "2px" }}>Completed Tasks: {completedTasks}</p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xl={8} lg={6}>
                        <Card className="px-5 py-4" style={{ height: "170px" }}>
                            <Typography variant="h6" gutterBottom>
                                Your Progress: {completedUserProgress ? completedUserProgress.toFixed(0) : 0}%
                            </Typography>
                            <ProgressBar style={{ height: "20px" }}>
                                <ProgressBar variant="success" now={completedUserProgress} />
                                <ProgressBar variant="danger" now={pendingUserProgress} />
                            </ProgressBar>
                            <br />
                            <Typography variant="h6" gutterBottom>
                                Team Progress: {completedTeamProgress ? completedTeamProgress.toFixed(0) : 0}%
                            </Typography>
                            <ProgressBar style={{ height: "20px" }}>
                                <ProgressBar variant="success" now={completedTeamProgress} />
                                <ProgressBar variant="danger" now={pendingTeamProgress} />
                            </ProgressBar>
                        </Card>
                    </Col>
                </Row>
            </Container >
            <Row className="justify-content-center">
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3">
                    <h4 className="my-3 ms-3" style={{ color: "#424242" }}>To Do</h4>
                    {loading && (
                        <Container
                            className="d-flex justify-content-center align-items-center">
                            <Spinner className="m-5" animation="border" />
                        </Container>
                    )}
                    {allTasks.filter(task => task.status === "pending").length === 0 && (
                        <h5 className="text-center my-5 py-5" style={{ color: "#c6c9c7" }}>No Task</h5>
                    )}
                    <CardTemplate allTasks={allTasks} status="pending" handleViewTask={handleViewTask} />
                </Col>
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3" >
                    <h4 className="my-3 ms-3" style={{ color: "#424242" }}>In Progress</h4>
                    {loading && (
                        <Container
                            className="d-flex justify-content-center align-items-center">
                            <Spinner className="m-5" animation="border" />
                        </Container>
                    )}
                    {allTasks.filter(task => task.status === "progress").length === 0 && (
                        <h5 className="text-center my-5 py-5" style={{ color: "#c6c9c7" }}>No Task</h5>
                    )}
                    <CardTemplate allTasks={allTasks} status="progress" handleViewTask={handleViewTask} />
                </Col>
                <Col md={3} style={{ border: "1px solid #E5E7E9", borderRadius: "15px", backgroundColor: "#FBFCFC" }} className="mx-3">
                    <h4 className="my-3 ms-3" style={{ color: "#424242" }}>Completed</h4>
                    {loading && (
                        <Container
                            className="d-flex justify-content-center align-items-center">
                            <Spinner className="m-5" animation="border" />
                        </Container>
                    )}
                    {allTasks.filter(task => task.status === "completed").length === 0 && (
                        <h5 className="text-center my-5 py-5" style={{ color: "#c6c9c7" }}>No Task</h5>
                    )}
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
