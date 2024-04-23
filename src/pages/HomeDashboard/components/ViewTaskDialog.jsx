import { Alert, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import { Button, Col, Row, Image, ButtonGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { auth } from "../../../firebase";
import { deleteTaskByTaskId, editTaskByTaskId } from "../../../components/tadelSlice";

export function ViewTaskDialog({ selectedTask, showViewDialog, setShowViewDialog, setEditTaskData, setShowEditDrawer }) {

    const [warningSnack, setWarningSnack] = useState(false);
    const [showImageDialog, setShowImageDialog] = useState(false)
    const [image, setImage] = useState("");

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

    function handleCloseViewDialog() {
        setShowViewDialog(false)
        setEditTaskData(null)
    }

    function handleMoveProgress(e) {
        e.preventDefault();

        const updateStatusProgress = {
            task_id: selectedTask.task_id,
            title: null,
            content: null,
            status: "progress",
            end_date: null,
            urgent: null,
            assignee: null,
            originator: null,
            color_tag: null,
            fileUpload: null
        }

        dispatch(editTaskByTaskId(updateStatusProgress))
        handleCloseViewDialog();
    }

    function handleMovePending(e) {
        e.preventDefault();

        const updateStatusProgress = {
            task_id: selectedTask.task_id,
            title: null,
            content: null,
            status: "pending",
            end_date: null,
            urgent: null,
            assignee: null,
            originator: null,
            color_tag: null,
            fileUpload: null
        }

        dispatch(editTaskByTaskId(updateStatusProgress))
        handleCloseViewDialog();
    }

    function handleMoveCompleted(e) {
        e.preventDefault();

        const updateStatusProgress = {
            task_id: selectedTask.task_id,
            title: null,
            content: null,
            status: "completed",
            end_date: null,
            urgent: null,
            assignee: null,
            originator: null,
            color_tag: null,
            fileUpload: null
        }

        dispatch(editTaskByTaskId(updateStatusProgress))
        handleCloseViewDialog();
    }

    function handleOpenImageDialog(image) {
        setImage(image);
        setShowImageDialog(true)
    }


    return (

        <>

            <Dialog
                open={showViewDialog}
                onClose={handleCloseViewDialog}
                fullWidth={true}
                maxWidth="sm"
            >
                <Badge style={{ backgroundColor: `${selectedTask.color_tag}`, color: `${selectedTask.color_tag}` }}>.</Badge>
                <DialogTitle id="">
                    {selectedTask.title}
                </DialogTitle>
                <DialogContent>
                    <Paper variant="outlined" style={{ height: "200px", overflow: "auto" }}>
                        <DialogContentText id="" className="mt-2 ms-2" style={{ whiteSpace: 'pre-wrap' }}>
                            {selectedTask.content}
                        </DialogContentText>
                        <br />
                        <br />
                        {selectedTask.fileurl && (
                            <Image src={selectedTask.fileurl} style={{ width: "400px" }} onClick={() => handleOpenImageDialog(selectedTask.fileurl)} />
                        )}
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
                    <Col className="d-flex justify-content-center align-items-center">
                        <ButtonGroup size="sm">
                            {selectedTask.status === "pending" ? (
                                <Button variant="outline-secondary" onClick={handleMoveProgress}>
                                    <i className="bi bi-chevron-double-right"></i>
                                </Button>
                            ) : selectedTask.status === "progress" ? (
                                <>
                                    <Button variant="outline-secondary" onClick={handleMovePending}>
                                        <i className="bi bi-chevron-double-left"></i>
                                    </Button>
                                    <Button variant="outline-secondary" onClick={handleMoveCompleted}>
                                        <i className="bi bi-chevron-double-right"></i>
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline-secondary" onClick={handleMoveProgress}>
                                    <i className="bi bi-chevron-double-left"></i>
                                </Button>
                            )}
                        </ButtonGroup>
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
            <Dialog
                open={showImageDialog}
                onClose={() => setShowImageDialog(false)}
                maxWidth="xl"

            >
                <Image src={image} />
            </Dialog>
        </>
    )
}