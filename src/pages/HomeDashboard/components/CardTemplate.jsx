import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { Badge, Col, Row } from "react-bootstrap";


export default function CardTemplate({ allTasks, status }) {

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
            <Card className="mb-4" elevation={2} key={data.task_id} draggable>
                <CardContent>
                    <h6>
                        {data.title}
                        {data.urgent ? (
                            <Badge className="ms-4" pill bg="danger">!</Badge>
                        ) : ("")}
                        <Badge className="ms-4" pill bg="outline" style={{ backgroundColor: `${data.color_tag}`, color: `${data.color_tag}` }}>color tag</Badge>
                    </h6>
                </CardContent>
                <Divider />
                <Row>
                    <Col className="d-flex justify-content-start align-items-center">
                        <Typography variant="caption" className="ms-3 text-muted">{data.assignee}</Typography>
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