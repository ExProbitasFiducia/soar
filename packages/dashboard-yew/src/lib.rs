use wasm_bindgen::prelude::*;
use yew::prelude::*;
use yew::Renderer;
use yew::suspense::{Suspension, SuspensionResult};


struct Task {
    task_id: String
}

fn load_tasks() -> Option<Vec<Task>> {
    let post_request = R
    //Some(vec![
    //    Task {
    //        task_id: String::from("Demo") 
    //    }
    //])
}

fn on_load_tasks_complete<F: FnOnce()>(_fn: F) {
    todo!();
}


#[hook]
fn use_tasks() -> SuspensionResult<Vec<Task>> {
    match load_tasks() {
        Some(m) => Ok(m),
        None => {
            let (s, handle) = Suspension::new();
            on_load_tasks_complete(move || {
                handle.resume();
            });
            Err(s)
        }
    }
}

#[function_component]
fn Tasks() -> HtmlResult {
    let tasks = use_tasks()?;
    Ok(html! { 
        <ul>
            {tasks.into_iter().map(|task| {
                html!{
                    <li>{task.task_id}</li>
                }
            }).collect::<Html>()}
        </ul>
    })
}

#[function_component]
pub fn App() -> Html {
    let fallback = html! {
        <div> {"LOADING SKELETRON"} </div>
    };
    html! {
        <>
            <header>
                <h1>{"Dashboard"}</h1>
                <a>{"Home"}</a>
            </header>
            <main>
                <Suspense {fallback}>
                    <Tasks />
                </Suspense>
            </main>
            <footer>
                {"Deno Cloud Platform"}
            </footer>
        </>
    }
}

#[wasm_bindgen]
pub async fn render() -> String {
    yew::LocalServerRenderer::<App>::new().render().await
}

#[wasm_bindgen]
pub fn hydrate() {
    Renderer::<App>::new().hydrate();
}
