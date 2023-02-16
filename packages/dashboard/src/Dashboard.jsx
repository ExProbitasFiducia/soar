import React, { useState, useEffect, Suspense } from "https://esm.sh/react@18.2.0";

const tasks = [{
    name: "YAA STILL NOisasdlifkjasdg",
    id: "demo-tuisk",
    running: false
}, {
    name: "OLD bessie",
    id: "old-groanie",
    running: false
}, {
    name: "Blhce",
    id: "of-you-to-say",
    running: false
}, {
    name: "OLD TAK",
    id: "new-talk",
    running: false
}];

const Task = ({ id, name }) => {
    useEffect(() => {
        console.log("Render");
        return () => {};
    }, []);
    return (
        <article>
            <header>
                {name}
            </header>
            <dl>
                <dt>ID:</dt><dd>{id}</dd>
            </dl>
            <button onClick={() => {
                console.log("Clicked")
            }}>
                Button
            </button>
        </article>
    );
};

const Tasks = () => {
    return (
        <ul className="task-list">
            {tasks.map(({id, name}) => (
                <li>
                    <Task id={id} name={name} />
                </li>
            ))}
        </ul>
    );
};


export const Dashboard = () => {
    const tasks = useState(null);
    
    return (
        <>
            <header>
                Tasks
            </header>
            <main>
                <Suspense fallback={"LOADING"}>
                    <Tasks />
                </Suspense>
            </main>
            <footer>
                <span>Soar</span>
                <span>Built by Joshua</span>
            </footer>
        </>
    );
};
