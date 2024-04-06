import { useNavigate } from "react-router-dom";
import { Badge, Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import { Card, CardContent, Divider, Typography } from "@mui/material";

import { auth } from "../../../firebase";


export default function CardTemplate({ allTasks, status, handleViewTask }) {

    const currentUser = auth.currentUser;
    const navigate = useNavigate();

    if (!currentUser) {
        // Redirect the user to login if currentUser is null
        navigate("/login");
        return null; // Returning null to prevent rendering while redirecting
    }

    return allTasks.filter((task) => (task.originator === currentUser.email || task.assignee === currentUser.email) && task.status === status).map((data) => {

        return (
            <>
                <Row className="px-3" key={data.task_id} >
                    <motion.div whileHover={{ scale: 1.075 }} whileTap={{ scale: 0.9 }}>
                        <Card key={data.task_id} className="mb-4" elevation={2} onClick={() => handleViewTask(data)} style={{ cursor: "pointer" }}>
                            <CardContent>
                                <h6 className="d-flex align-items-center">
                                    {data.title}
                                    <Typography variant="caption">
                                        <Badge className="ms-4" pill bg="outline" style={{ backgroundColor: `${data.color_tag}`, color: `${data.color_tag}` }}>color tag</Badge>
                                    </Typography>
                                    {data.urgent ? (
                                        <Badge className="ms-2" pill bg="danger">!</Badge>
                                    ) : ("")}
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
                    </motion.div>
                </Row>
            </>
        )
    })

}


