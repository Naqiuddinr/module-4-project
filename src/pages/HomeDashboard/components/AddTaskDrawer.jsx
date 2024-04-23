import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Checkbox, Drawer, Option, Select } from "@mui/joy";
import { Alert, Snackbar } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { MuiColorInput } from "mui-color-input";

import { auth } from "../../../firebase";
import { addNewTaskByUser } from "../../../components/tadelSlice";
// import { sampleTeam } from "../../../components/sampleData";



export default function AddTaskDrawer({ showAddDrawer, setShowAddDrawer }) {

    const originator = auth.currentUser?.email;

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [status, setStatus] = useState("pending")
    const [endDate, setEndDate] = useState(null)
    const [fileUpload, setFileUpload] = useState("")
    const [urgent, setUrgent] = useState(false)
    const [assignee, setAssignee] = useState(originator)
    const [colorTag, setColorTag] = useState("")

    const endTaskDate = new Date(endDate)
    const convertedEndTaskDate = `${endTaskDate.getFullYear()}-${endTaskDate.getMonth() + 1}-${endTaskDate.getDate()}`;

    const dispatch = useDispatch();

    const [warningSnack, setWarningSnack] = useState(false)

    const handleFileUpload = (e) => {
        setFileUpload(e.target.files[0])
    }

    function handleCloseAddTaskDrawer() {

        setTitle("");
        setContent("");
        setStatus("");
        setEndDate(null);
        setUrgent(false);
        setAssignee("");
        setColorTag("");
        setFileUpload("");

        setShowAddDrawer(false)

    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!title || !endDate || !status) {

            setWarningSnack(true);
            console.log(endDate)
            return
        }

        const newTaskData = {
            title,
            content,
            status,
            end_date: convertedEndTaskDate,
            urgent,
            assignee,
            originator,
            color_tag: colorTag,
            fileUpload
        }

        console.log(newTaskData)
        dispatch(addNewTaskByUser(newTaskData))

        setShowAddDrawer(false);

        setTitle("");
        setContent("");
        setStatus("");
        setEndDate(null);
        setUrgent(false);
        setAssignee("");
        setColorTag("");
        setFileUpload("");
    }

    const members = useSelector((state) => state.team.team)

    return (
        <>
            <Drawer size="lg" open={showAddDrawer} onClose={handleCloseAddTaskDrawer} anchor="right">
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
                                <Form.Group className="mb-4" controlId="endDate" >
                                    <Form.Label>End Date</Form.Label>
                                    <br />
                                    <DatePicker
                                        value={endDate}
                                        onChange={(e) => setEndDate(e)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg={8}>
                                <Form.Group className="mb-4" controlId="endDate" >
                                    <Form.Label>Attachment (photo)</Form.Label>
                                    <br />
                                    <Form.Control
                                        className="mt-2 d-flex align-items-center"
                                        style={{ width: "415px" }}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-4" controlId="status" >
                                    <Form.Label>Status</Form.Label>
                                    <br />
                                    <Select
                                        placeholder="Select Status"
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
                                        placeholder="Select Assignee"
                                        style={{ width: "258px" }}
                                        onChange={(e, value) => setAssignee(value)}
                                    >
                                        <Option value={originator}>{originator}</Option>
                                        {members.map((member) => (
                                            <Option key={member.team_member} value={member.team_member}>{member.team_member}</Option>
                                        ))}
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
                    Title and End Date are compulsory!
                </Alert>
            </Snackbar>
        </>
    );
}