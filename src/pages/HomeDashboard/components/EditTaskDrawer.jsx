import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { Checkbox, Drawer, Option, Select } from "@mui/joy";
import { DatePicker } from "@mui/x-date-pickers";
import { MuiColorInput } from "mui-color-input";
import { Alert, Snackbar } from "@mui/material";

import { auth } from "../../../firebase";
import { editTaskByTaskId } from "../../../components/tadelSlice";


export function EditTaskDrawer({ showEditDrawer, setShowEditDrawer, editTaskData }) {


    const originator = auth.currentUser?.email;

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [status, setStatus] = useState("")
    const [urgent, setUrgent] = useState(false)
    const [assignee, setAssignee] = useState("")
    const [colorTag, setColorTag] = useState("")
    const [endDate, setEndDate] = useState(null)
    const [fileUpload, setFileUpload] = useState("")

    useEffect(() => {
        setTitle(editTaskData?.title)
        setContent(editTaskData?.content)
        setStatus(editTaskData?.status)
        setUrgent(editTaskData?.urgent)
        setAssignee(editTaskData?.assignee)
        setColorTag(editTaskData?.color_tag)
    }, [editTaskData]) // from undefined -> got content


    const dispatch = useDispatch();
    const [warningSnack, setWarningSnack] = useState(false)

    const handleFileUpload = (e) => {
        setFileUpload(e.target.files[0])
    }

    if (editTaskData === null) {
        return;
    }

    const endTaskDate = new Date(endDate)
    const convertedEndTaskDate = `${endTaskDate.getFullYear()}-${endTaskDate.getMonth() + 1}-${endTaskDate.getDate()}`;

    const handleCloseEditDrawer = () => {
        setShowEditDrawer(false);
        setTitle("");
        setContent("")
        setStatus("");
        setUrgent(false);
        setAssignee("")
        setColorTag("");
        setEndDate(null);
        setFileUpload("");
    }

    function handleSubmit(e) {
        e.preventDefault();

        const newEditedTaskData = {
            task_id: editTaskData.task_id,
            title: title === "" ? null : title,
            content: content === "" ? null : content,
            status: status === "" ? null : status,
            end_date: endDate === null ? null : convertedEndTaskDate,
            urgent,
            assignee: assignee === "" ? null : assignee,
            originator,
            color_tag: colorTag === "" ? null : colorTag,
            fileUpload: fileUpload === "" ? null : fileUpload
        }

        dispatch(editTaskByTaskId(newEditedTaskData))
        handleCloseEditDrawer()

    }


    return (
        <>
            <Drawer size="lg" open={showEditDrawer} onClose={handleCloseEditDrawer} anchor="right">
                <Row style={{ borderBottom: "3px solid #F2F3F4" }}>
                    <div style={{ backgroundColor: `${editTaskData.color_tag}`, height: "40px" }}></div>
                    <h2 className="mt-3 ms-5">Editing Task</h2>
                </Row>
                <Container className="mt-5 ms-5">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4" controlId="taskTitle">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
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
                                value={content}
                                style={{ width: "800px" }}
                                onChange={(event) => setContent(event.target.value)}
                            />
                        </Form.Group>
                        <Row>
                            <Col lg={4}>
                                <Form.Group className="mb-4" controlId="endDate" >
                                    <Form.Label>End Date</Form.Label>
                                    <br />
                                    <DatePicker
                                        value={endDate}
                                        onChange={(e) => setEndDate(e)} />
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
                                        style={{ width: "258px" }}
                                        value={status}
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
                                        value={assignee}
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