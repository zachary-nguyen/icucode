import React from "react";
import {UserContext} from "../../App";
import ProfessorCoursePage from "./ProfessorCoursePage";
import StudentCoursePage from "./StudentCoursePage";

interface Props {
    match: any;
}

const CoursePage = (props: Props) => {
    const context = React.useContext(UserContext);

    return (
      <div>
        { context && context.facultyUser &&
          <ProfessorCoursePage match={props.match}/>
        }
        { context && !context.facultyUser &&
          <StudentCoursePage match={props.match}/>
        }
      </div>
    )
};

export default CoursePage;