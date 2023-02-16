import React, { useState, useEffect, Suspense } from "https://esm.sh/react@18.2.0";
const tasks = [
    {
        name: "YAA STILL NOisasdlifkjasdg",
        id: "demo-tuisk",
        running: false
    },
    {
        name: "OLD bessie",
        id: "old-groanie",
        running: false
    },
    {
        name: "Blhce",
        id: "of-you-to-say",
        running: false
    },
    {
        name: "OLD TAK",
        id: "new-talk",
        running: false
    }
];
const Task = ({ id , name  })=>{
    useEffect(()=>{
        console.log("Render");
        return ()=>{};
    }, []);
    return /*#__PURE__*/ React.createElement("article", null, /*#__PURE__*/ React.createElement("header", null, name), /*#__PURE__*/ React.createElement("dl", null, /*#__PURE__*/ React.createElement("dt", null, "ID:"), /*#__PURE__*/ React.createElement("dd", null, id)), /*#__PURE__*/ React.createElement("button", {
        onClick: ()=>{
            console.log("Clicked");
        }
    }, "Button"));
};
const Tasks = ()=>{
    return /*#__PURE__*/ React.createElement("ul", {
        className: "task-list"
    }, tasks.map(({ id , name  })=>/*#__PURE__*/ React.createElement("li", null, /*#__PURE__*/ React.createElement(Task, {
            id: id,
            name: name
        }))));
};
export const Dashboard = ()=>{
    const tasks = useState(null);
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("header", null, "Tasks"), /*#__PURE__*/ React.createElement("main", null, /*#__PURE__*/ React.createElement(Suspense, {
        fallback: "LOADING"
    }, /*#__PURE__*/ React.createElement(Tasks, null))), /*#__PURE__*/ React.createElement("footer", null, /*#__PURE__*/ React.createElement("span", null, "Soar"), /*#__PURE__*/ React.createElement("span", null, "Built by Joshua")));
};
