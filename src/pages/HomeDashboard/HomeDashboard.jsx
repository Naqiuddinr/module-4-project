import { Card, CardContent, Divider, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import { AuthContext } from "../../components/AuthProvider";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTaskByUser } from "../../components/tadelSlice";

export default function HomeDashboard() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                <Col md={3} style={{ border: "1px solid #DDDDDD", borderRadius: "15px", backgroundColor: "#F9FBE7" }} className="mx-3">
                    <h5 className="mt-3" style={{ color: "#424242" }}>To Do</h5>
                    <Card
                        className="py-1 my-3 text-center rounded-pill"
                        variant="outlined"
                        style={{ cursor: "pointer", backgroundColor: "#FAFAFA" }}>
                        <AddCircleOutlineRoundedIcon style={{ color: "#616161" }} />
                    </Card>
                    <CardTemplate allTasks={allTasks} status="pending" />
                </Col>
                <Col md={3} style={{ border: "1px solid #DDDDDD", borderRadius: "15px", backgroundColor: "#E1F5FE" }} className="mx-3" >
                    <h5 className="mt-3" style={{ color: "#424242" }}>In Progress</h5>
                    <Card
                        className="py-1 my-3 text-center rounded-pill"
                        variant="outlined"
                        style={{ cursor: "pointer", backgroundColor: "#FAFAFA" }}>
                        <AddCircleOutlineRoundedIcon style={{ color: "#616161" }} />
                    </Card>
                    <CardTemplate allTasks={allTasks} status="progress" />
                </Col>
                <Col md={3} style={{ border: "1px solid #DDDDDD", borderRadius: "15px", backgroundColor: "#E0F2F1" }} className="mx-3">
                    <h5 className="mt-3" style={{ color: "#424242" }}>Completed</h5>
                    <Card
                        className="py-1 my-3 text-center rounded-pill"
                        variant="outlined"
                        style={{ cursor: "pointer", backgroundColor: "#FAFAFA" }}>
                        <AddCircleOutlineRoundedIcon style={{ color: "#616161" }} />
                    </Card>
                    <CardTemplate allTasks={allTasks} status="completed" />
                </Col>
            </Row>
        </>
    )
}


function CardTemplate({ allTasks, status }) {

    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    if (!currentUser) {
        // Redirect the user to login if currentUser is null
        navigate("/login");
        return null; // Returning null to prevent rendering while redirecting
    }

    console.log(allTasks)

    return allTasks.filter((task) => task.status === status && task.originator === currentUser.email).map((data) => {

        return (
            <Card className="my-4" elevation={2} key={data.task_id} draggable>
                <CardContent>
                    <h6>
                        {data.title}
                        {data.urgent ? (
                            <Badge className="ms-4" pill bg="danger" text="danger">U</Badge>
                        ) : ("")}
                        <Badge className="ms-4" pill bg="outline" style={{ backgroundColor: "#DFFF00", color: "#DFFF00" }}>color tag</Badge>
                    </h6>
                </CardContent>
                <Divider />
                <Row>
                    <Col>
                        <Typography variant="caption" className="text-start ms-3 text-muted">{data.assigned_to}</Typography>
                    </Col>
                    <Col className="d-flex justify-content-end align-items-center">
                        <Typography variant="caption" className="text-muted me-3">
                            Deadline:
                            {(() => {
                                // Convert data.end_date to a Date object
                                const endDate = new Date(data.end_date);

                                // Extract day, month, and year components
                                const day = endDate.getDate();
                                const month = endDate.getMonth() + 1; // Adding 1 since month is zero-based
                                const year = endDate.getFullYear();

                                // Return formatted date string
                                return `${day}/${month}/${year}`;
                            })()}
                        </Typography>
                    </Col>
                </Row>
            </Card>
        )
    })

}