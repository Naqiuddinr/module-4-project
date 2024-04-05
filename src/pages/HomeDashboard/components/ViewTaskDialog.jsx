import { Alert, Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Snackbar } from "@mui/material";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { auth } from "../../firebase";
import { deleteTaskByTaskId } from "../../components/tadelSlice";


export default function ViewTaskDialog({ selectedTask, showViewDialog, setShowViewDialog }) {

    const [warningSnack, setWarningSnack] = useState(false);
    const dispatch = useDispatch();

    if (selectedTask === null) {
        return;
    }

    const handleClick = () => {
        setWarningSnack(true);
    };

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
                            <Button className="ms-3 my-3" variant="outline-secondary" onClick={handleClick}>
                                Edit
                                <i className="bi bi-pencil-square"></i>
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
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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