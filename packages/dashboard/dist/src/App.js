import React from "https://esm.sh/react@18.2.1";
const tasks = [
    {
        name: "Demo Task",
        id: "demo-task"
    }
];
const Task = ({ id , name  })=>{
    return /*#__PURE__*/ React.createElement("div", {
        className: "task"
    }, /*#__PURE__*/ React.createElement("heading", null, name), /*#__PURE__*/ React.createElement("section", null, "ID: ", id));
};
const Tasks = ()=>{
    const tasks = useState(null);
    return tasks.map(()=>/*#__PURE__*/ React.createElement(Task, null));
};
const App = ()=>{
    const tasks = useState(null);
    return /*#__PURE__*/ React.createElement(Suspense, {
        fallback: "LOADING"
    }, /*#__PURE__*/ React.createElement(Tasks, null));
};
