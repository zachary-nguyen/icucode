import React, {useEffect, useState} from "react";
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ClassIcon from "@material-ui/icons/Class";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import {App} from "../../../codesets";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        searchContainer: {
            marginTop: "2%"
        },
        searchBar: {
           height: 10,
        },
        searchButton: {
           textTransform: "none",
           height: 45
        },
        filterBy:{
            width: 120,
        },
        filter: {
            height: 45,
        }
    }),
);

interface Props {

}

const CourseList = (props: Props) => {

    const [courseList, setCourseList] = useState<any>(null);
    const [filterBy, setFilterBy] = useState(0);
    const [searchValue, setSearchValue] = useState("");

    const classes = useStyles();

    // Fetch user model and courselist
    useEffect(() =>{
        // fetch courses
        axios.get("/api/courses/courselist", {
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setCourseList(sortCourseListByCode(res.data));
        }).catch(err => {
            console.log(err)
        })
    },[])

    const sortCourseListByCode = (list: any) => {
        return list.sort((a: App.Course,b: App.Course) => (a.courseCode > b.courseCode) ? 1 : ((b.courseCode > a.courseCode) ? -1 : 0))
    };

    const sortCourseListByName = (list: any) => {
        return list.sort((a: App.Course,b: App.Course) => (a.courseName > b.courseName) ? 1 : ((b.courseName > a.courseName) ? -1 : 0))
    };

    const handleFilter = (e:any) => {
        if(e.target.value === 0) {
            sortCourseListByCode(courseList);
        } else {
            sortCourseListByName(courseList);
        }
        setFilterBy(e.target.value)
    }

    const handleSearch = (e: any) => {
        setSearchValue(e.target.value);
    }

    const performSearch = () => {
        axios.get("/api/courses/search", {
            params :{
                courseCode: searchValue
            },
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setCourseList(res.data)
        }).catch(err => {
            console.log(err)
        })
    };

    return (
        <div>
            <Grid container direction={"column"}>
                <Grid container item xs={4}>
                    <Typography variant={"h3"}>
                        Register to a Course
                    </Typography>
                    <Typography variant={"body2"}>
                        Select one of the course below to register
                    </Typography>
                </Grid>
                <Grid className={classes.searchContainer} direction={"row"} container item spacing={1} xs={12}>
                    <Grid item xs={4}>
                        <TextField placeholder={"Search for a course by code or name"}
                                   variant={"outlined"}
                                   onChange={handleSearch}
                                   inputProps={{className: classes.searchBar}}
                                   fullWidth={true}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant={"contained"}
                                size={"medium"}
                                className={classes.searchButton}
                                onClick={performSearch}
                                color={"primary"}>
                            Search Course
                        </Button>
                    </Grid>
                    <Grid item>
                        <FormControl variant={"outlined"} className={classes.filterBy}>
                            <InputLabel>Filter</InputLabel>
                            <Select
                                className={classes.filter}
                                value={filterBy}
                                onChange={handleFilter}
                                label="Age"
                            >
                                <MenuItem value={0}>Code</MenuItem>
                                <MenuItem value={10}>Name</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container direction={"column"} item>
                    {courseList !== null && courseList.length > 0 && courseList.map((course: App.Course,index: number) => {
                        return (
                            <ListItem component={Link} to={`/course/register/${course.courseCode}`} button key={index}>
                                <ListItemIcon><ClassIcon color={"primary"}/></ListItemIcon>
                                <ListItemText primary={course.courseCode + " - " + course.courseName} secondary={course.description}/>
                            </ListItem>
                        )
                    })}
                </Grid>
            </Grid>
        </div>
    )
};

export default CourseList;