interface Action {
    read:boolean;
    write:boolean;
    owner:boolean;
    modify:boolean;
}

export interface Role {
    assigmentCreation: Action;
    grades: Action;
    courseCreation: Action;
    assignmentUpload: Action;
    coursePage: Action;
    assignmentPage: Action;
}


export const Student: Role = {
    assigmentCreation: {
        read: false,
        write: false,
        owner: false,
        modify: false
    },
    grades: {
        read: true,
        write: false,
        owner: false,
        modify: false
    },
    courseCreation: {
        read: false,
        write: false,
        owner: false,
        modify: false
    },
    assignmentUpload: {
        read: true,
        write: true,
        owner: true,
        modify: false
    },
    coursePage: {
        read: true,
        write: false,
        owner: false,
        modify: false
    },
    assignmentPage: {
        read: true,
        write: true,
        owner: false,
        modify: false
    },
}


export const Professor: Role = {
    assigmentCreation: {
        read: true,
        write: true,
        owner: true,
        modify: false
    },
    grades: {
        read: true,
        write: true,
        owner: false,
        modify: false
    },
    courseCreation: {
        read: true,
        write: true,
        owner: true,
        modify: false
    },
    assignmentUpload: {
        read: true,
        write: false,
        owner: false,
        modify: false
    },
    coursePage: {
        read: true,
        write: true,
        owner: true,
        modify: false
    },
    assignmentPage: {
        read: true,
        write: true,
        owner: true,
        modify: false
    },
}


export const TA: Role = {
    assigmentCreation: {
        read: false,
        write: false,
        owner: false,
        modify: false
    },
    grades: {
        read: true,
        write: true,
        owner: false,
        modify: false
    },
    courseCreation: {
        read: false,
        write: false,
        owner: false,
        modify: false
    },
    assignmentUpload: {
        read: true,
        write: false,
        owner: false,
        modify: false
    },
    coursePage: {
        read: true,
        write: false,
        owner: false,
        modify: false
    },
    assignmentPage: {
        read: true,
        write: false,
        owner: false,
        modify: false
    },
}