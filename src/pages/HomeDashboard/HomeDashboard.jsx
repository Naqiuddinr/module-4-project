import { Card } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import { AuthContext } from "../../components/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTaskByUser } from "../../components/tadelSlice";
import CardTemplate from "./components/CardTemplate";
import { Checkbox, Drawer, Option, Select } from "@mui/joy";
import { DatePicker } from "@mui/x-date-pickers";
import { MuiColorInput } from "mui-color-input";
import { auth } from "../../firebase";


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

        console.log(currentUser.uid)

        dispatch(fetchAllTaskByUser(currentUser.uid))

    }, [currentUser, navigate, dispatch])

    const allTasks = useSelector((state) => state.tasks.tasks)

    console.log(allTasks)

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




function AddTaskDrawer({ showAddDrawer, setShowAddDrawer }) {

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [status, setStatus] = useState("pending")
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [urgent, setUrgent] = useState(false)
    const [assignee, setAssignee] = useState("test@email.com")
    const [colorTag, setColorTag] = useState("")

    const originator = auth.currentUser?.email;

    function handleSubmit(e) {
        e.preventDefault();

        const newTaskData = {
            title,
            content,
            status,
            start_date: startDate,
            end_date: endDate,
            urgent,
            assignee,
            originator
        }

        console.log(newTaskData)
    }

    return (
        <>
            <Drawer size="lg" open={showAddDrawer} onClose={() => setShowAddDrawer(false)} anchor="right">
                <Row style={{ borderBottom: "3px solid #F2F3F4" }}>
                    <h2 className="mt-5 ms-5">Add New Task</h2>
                </Row>
                <Container className="mt-5 ms-5">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="taskTitle">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Make it short and simple (limited to 40 characters)"
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
                                        defaultValue="pending"
                                        style={{ width: "258px" }}
                                        onChange={(e, value) => setStatus(value)}
                                    >
                                        <Option value="pending">Pending</Option>
                                        <Option value="progress">Progress</Option>
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
                                        defaultValue="test@email.com"
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
                                        value={colorTag}
                                        onChange={(e) => setColorTag(e)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button className="mt-3" variant="outline-success" type="submit">Create</Button>
                    </Form>
                </Container>
            </Drawer>
        </>
    );
}