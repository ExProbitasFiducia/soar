
import React from "https://esm.sh/react@18.2.1";

const tasks = [{
    name: "Demo Task",
    id: "demo-task"
}];

const Task = ({id, name}) => {
    return (
        <div
            className="task"
        >
            <heading>
                {name}
            </heading>
            <section>
                ID: {id}
            </section>
        </div>
    );
};

const Tasks = () => {
    const tasks = useState(null);

    return tasks.map(() => (<Task />));
};


const App = () => {
    const tasks = useState(null);
    return (
        <Suspense fallback={"LOADING"}>
            <Tasks />
        </Suspense>
    );
};
