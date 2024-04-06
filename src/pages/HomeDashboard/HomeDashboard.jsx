import { Alert, Badge, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Paper, Snackbar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import { AuthContext } from "../../components/AuthProvider";
import { auth } from "../../firebase";
import { addNewTaskByUser, deleteTaskByTaskId, editTaskByTaskId, fetchAllTaskByUser } from "../../components/tadelSlice";
import CardTemplate from "./components/CardTemplate";
import AddTaskDrawer from "./components/AddTaskDrawer";
import { Checkbox, Drawer, Option, Select } from "@mui/joy";
import { DatePicker } from "@mui/x-date-pickers";
import { MuiColorInput } from "mui-color-input";


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


function ViewTaskDialog({ selectedTask, showViewDialog, setShowViewDialog, setEditTaskData, setShowEditDrawer }) {

    const [warningSnack, setWarningSnack] = useState(false);
    const dispatch = useDispatch();

    if (selectedTask === null) {
        return;
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setWarningSnack(false);
    };

    function handleDeleteTask({ task_id, originator }) {

        if (originator !== auth.currentUser.email) {

            setWarningSnack(true);
            return

        }

        dispatch(deleteTaskByTaskId(task_id));
        setShowViewDialog(false)

    }

    function handleEditTask(selectedTask) {

        const { originator } = selectedTask

        if (originator !== auth.currentUser.email) {

            setWarningSnack(true);
            return
        }

        setShowEditDrawer(true);
        setEditTaskData(selectedTask);
        setShowViewDialog(false);

    }

    return (

        <>

            <Dialog
                open={showViewDialog}
                onClose={() => setShowViewDialog(false)}
                fullWidth={true}
                maxWidth="sm"
            >
                <Badge style={{ backgroundColor: `${selectedTask.color_tag}`, color: `${selectedTask.color_tag}` }}>.</Badge>

                <DialogTitle id="">
                    {selectedTask.title}
                </DialogTitle>
                <DialogContent>
                    <Paper variant="outlined" style={{ height: "200px" }}>

                        <DialogContentText id="" className="mt-2 ms-2">
                            {selectedTask.content}
                        </DialogContentText>
                    </Paper>
                </DialogContent>
                <Row>
                    <Col>
                        <DialogContentText id="" className="ms-4">
                            Asignee: {selectedTask.assignee}
                        </DialogContentText>
                    </Col>
                    <Col>
                        <DialogContentText className="me-4 d-flex justify-content-end">
                            Deadline:
                            {(() => {
                                // Convert data.end_date to a Date object
                                const endDate = new Date(selectedTask.end_date);

                                // Extract day, month, and year components
                                const day = endDate.getDate();
                                const month = endDate.getMonth() + 1; // Adding 1 since month is zero-based
                                const year = endDate.getFullYear();

                                // Return formatted date string
                                return `${day}/${month}/${year}`;
                            })()}
                        </DialogContentText>
                    </Col>
                </Row>
                <DialogContentText className="ms-4 mt-3">
                    Urgent: {selectedTask.urgent ? ("Yes") : ("No")}
                </DialogContentText>
                <Row>
                    <Col>
                        <DialogActions className="d-flex justify-content-start">
                            <Button className="ms-3 my-3" variant="outline-secondary" onClick={() => handleEditTask(selectedTask)}>
                                Edit
                            </Button>
                        </DialogActions>
                    </Col>
                    <Col>
                        <DialogActions className="me-3">
                            <Button className="ms-3 my-3" variant="outline-danger" onClick={() => handleDeleteTask(selectedTask)}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Col>
                </Row>
            </Dialog>
            <Snackbar
                open={warningSnack}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Only originator can edit this task!
                </Alert>
            </Snackbar>
        </>
    )
}



function EditTaskDrawer({ showEditDrawer, setShowEditDrawer, editTaskData }) {

    const originator = auth.currentUser?.email;
    const prevColor = editTaskData?.color_tag;

    const [title, setTitle] = useState(null)
    const [content, setContent] = useState(null)
    const [status, setStatus] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [urgent, setUrgent] = useState(false)
    const [assignee, setAssignee] = useState(null)
    const [colorTag, setColorTag] = useState(prevColor)

    const dispatch = useDispatch();
    const [warningSnack, setWarningSnack] = useState(false)

    if (editTaskData === null) {
        return;
    }

    const startTaskDate = new Date(startDate)
    const convertedStartTaskDate = `${startTaskDate.getFullYear()}-${startTaskDate.getMonth() + 1}-${startTaskDate.getDate()}`;

    const endTaskDate = new Date(endDate)
    const convertedEndTaskDate = `${endTaskDate.getFullYear()}-${endTaskDate.getMonth() + 1}-${endTaskDate.getDate()}`;


    function handleSubmit(e) {
        e.preventDefault();

        if (!endDate) {

            setWarningSnack(true);
            console.log(endDate)
            return
        }

        const newEditedTaskData = {
            task_id: editTaskData.task_id,
            title,
            content,
            status,
            start_date: convertedStartTaskDate,
            end_date: convertedEndTaskDate,
            urgent,
            assignee,
            originator,
            color_tag: colorTag
        }

        console.log(newEditedTaskData)

        dispatch(editTaskByTaskId(newEditedTaskData))
        setShowEditDrawer(false)


    }

    return (
        <>
            <Drawer size="lg" open={showEditDrawer} onClose={() => setShowEditDrawer(false)} anchor="right">
                <Row style={{ borderBottom: "3px solid #F2F3F4" }}>
                    <h2 className="mt-5 ms-5">Editing Task</h2>
                </Row>
                <Container className="mt-5 ms-5">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="taskTitle">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={editTaskData.title}
                                style={{ width: "500px" }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="taskDescription" >
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={7}
                                placeholder={editTaskData.content}
                                style={{ width: "800px" }}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-4" controlId="startDate" >
                                    <Form.Label>Start Date</Form.Label>
                                    <br />
                                    <DatePicker
                                        value={startDate}
                                        placeholder={editTaskData.start_date}
                                        onChange={(e) => setStartDate(e)} />
                                </Form.Group>
                            </Col>
                            <Col lg={8}>
                                <Form.Group className="mb-4" controlId="endDate" >
                                    <Form.Label>End Date</Form.Label>
                                    <br />
                                    <DatePicker
                                        value={endDate}
                                        onChange={(e) => setEndDate(e)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-4" controlId="status" >
                                    <Form.Label>Status</Form.Label>
                                    <br />
                                    <Select
                                        placeholder={editTaskData.status}
                                        style={{ width: "258px" }}
                                        onChange={(e, value) => setStatus(value)}
                                    >
                                        <Option value="pending">Pending</Option>
                                        <Option value="progress">Progress</Option>
                                        <Option value="completed">Completed</Option>
                                    </Select>
                                </Form.Group>
                            </Col>
                            <Col lg={8}>
                                <Form.Group className="mb-4" controlId="urgent" >
                                    <Checkbox
                                        className="pt-5"
                                        label="Mark as Urgent"
                                        size="md"
                                        variant="outlined"
                                        checked={urgent}
                                        onChange={(e) => setUrgent(e.target.checked)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-4" controlId="assignee" >
                                    <Form.Label>Assignee</Form.Label>
                                    <br />
                                    <Select
                                        placeholder={editTaskData.assignee}
                                        style={{ width: "258px" }}
                                        onChange={(e, value) => setAssignee(value)}
                                    >
                                        <Option value="test@email.com">test@email.com</Option>
                                        <Option value="test-2@email.com">test-2@email.com</Option>
                                    </Select>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group className="mb-4 mt-2" controlId="colorTag" >
                                    <MuiColorInput
                                        className="pt-4"
                                        format="hex"
                                        size="small"
                                        placeholder={editTaskData.color_tag}
                                        value={colorTag}
                                        onChange={(color) => setColorTag(color)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button className="mt-3" variant="warning" type="submit">Save</Button>
                    </Form>
                </Container>
            </Drawer>
            <Snackbar
                open={warningSnack}
                autoHideDuration={6000}
                onClose={() => setWarningSnack(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setWarningSnack(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    End Date must be filled again!
                </Alert>
            </Snackbar>
        </>
    );
}