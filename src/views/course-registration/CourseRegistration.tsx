import React, {useEffect, useState} from "react";
import {Button, Grid, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";

interface Props {
   match: any;
}

const CourseRegistration = (props: Props) => {

    const [course, setCourse] = useState<any>({});

    // Fetch user model and courselist
    useEffect(() =>{
        // fetch courses
        axios.get("/api/courses/get", {
            params: {
                courseCode: props.match.params.courseCode
            },
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setCourse(res.data);
        }).catch(err => {
            console.log(err)
        })
    },[])

    const registerToCourse = () => {
        axios.post("/api/courses/register", {
            courseCode: course.courseCode
        }, {headers: getAuthHeaders()})
            .then((res) => {
                if(res.status === 200){
                    window.location.replace(`/course/view/${course.courseCode}`);
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <Grid container direction={"column"}>
                <Grid justify={"center"} container direction={"column"} item xs={12}>
                    <Typography variant={"h3"}>
                        {course && course.courseCode}
                    </Typography>
                    <Typography variant={"body2"}>
                        <strong> Description </strong>
                        {course && course.courseName}
                    </Typography>
                    <Typography variant={"body2"}>
                        <strong>Professor:</strong> {course && course.professor && course.professor.firstName + " " + course.professor.lastName}
                    </Typography>
                </Grid>
                <Grid justify={"center"} alignItems={"center"} item xs={12}>
                    <Button onClick={registerToCourse} color={"primary"} variant={"contained"}> Register to this course </Button>
                </Grid>
            </Grid>
        </div>
    )
};

export default CourseRegistration;