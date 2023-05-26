import { useState, useEffect, useRef } from 'react';
import { TodoList } from './Todo.js';

// const initialTodoItems = [
//     { id: 0, description: "Go shopping to the Mall", status: false, deleted: false },
//     { id: 1, description: "Go for a walk in the morning", status: true, deleted: false },
//     { id: 2, description: "Learn React.js basics", status: false, deleted: false },
// ];

const API_BASE_URL = "http://localhost:5000/todos";

function App() {
    const [todoItems, setTodoItems] = useState([]);
    const [showDeletedTodos, setShowDeletedTodos] = useState(false);
    const [createTodoInputText, setCreateTodoInputText] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const createTodoInputRef = useRef(null);

    useEffect(() => {
        fetch(API_BASE_URL)
            .then(data => data.json())
            .then(data => {
                console.log(`Fetched ${data.length} todos from API`);

                const newTodoItems = [...todoItems];

                for(const todo of data) {
                    let duplicate = false;
                    for(const currentTodo of todoItems) {
                        if(todo.id == currentTodo.id) {
                            duplicate = true;
                            break;
                        }
                    }
                    if(!duplicate) {
                        newTodoItems.push(todo);
                    }
                }

                setTodoItems(newTodoItems);
            })
            .catch(err => console.log("Failed to fetch todos from API: ", err));
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        const newTodoItem = {
            id: Math.floor( Math.random() * 1e6 ),
            description: createTodoInputText,
            status: false,
            deleted: false
        }

        setTodoItems([...todoItems, newTodoItem]);

        fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodoItem)
        }).then(response => console.log(response.status))

        createTodoInputRef.current.value = "";
    }

    const updateTodo = (id, data) => {
        const newTodoItems = [...todoItems];
        for(const todoItem of newTodoItems) {
            if(todoItem.id == id) {
                for(const key of Object.keys(data)) {
                    if(todoItem.hasOwnProperty(key)) {
                        todoItem[key] = data[key];
                    }
                }
            }
        }

        setTodoItems(newTodoItems);
        fetch(API_BASE_URL + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(response => console.log(response.status))

    }

    const deletedTodoFilter = (todo) => {
        if(showDeletedTodos) {
            return true;
        } else {
            return todo.deleted == false;
        }
    }

    const saveTodos = () => {
        fetch(API_BASE_URL + "/save").then(response => alert("Success")).catch(err => alert("Failure"));
    }

    const searchFilter = (todo) => {
        if(searchInput.length == 0) {
            return true;
        }

        // smart case
        let caseSensitive = true;

        if(searchInput.toLowerCase() == searchInput) {
            caseSensitive = false;
        }

        let pos = 0;
        // Fuzzy search
        for(let i = 0; pos < searchInput.length && i < todo.description.length; i++) {
            if(caseSensitive) {
                if(todo.description.charAt(i) == searchInput.charAt(pos)) {
                    pos++;
                }
            } else {
                if(todo.description.toLowerCase().charAt(i) == searchInput.charAt(pos)) {
                    pos++;
                }
            }
        }

        return pos >= searchInput.length;
    }

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    }
    
    const handleCreateTodoInputChange = (e) => {
        setCreateTodoInputText(e.target.value)
    } 

    return (
        <div className="App">
            <h2>Todo List</h2>
            <div>
                Search: <input value={searchInput} onChange={handleSearchInputChange} placeholder="Search todos here..." type="text" ></input>
            </div>
            <br />
            <button onClick={() => saveTodos()}>Save File</button>
            <br />
            {showDeletedTodos ? 
                <button onClick={() => setShowDeletedTodos(false)}>Hide Deleted</button>
                :
                <button onClick={() => setShowDeletedTodos(true)}>Show Deleted</button>
            }
            <div style={{ backgroundColor: "transparent", height: 100, overflow: "auto", padding: 10, borderStyle: "solid", borderWidth: 1 }}>
            <TodoList todoList={todoItems.filter(deletedTodoFilter).filter(searchFilter)} updateTodo={updateTodo} />
            </div>
            <h2>Create Todo</h2>
            <form onSubmit={onSubmit} >
                <input ref={createTodoInputRef} placeholder="Type todo here..." type="text" width={ 20 } height={ 20 } onChange={handleCreateTodoInputChange}/>
                <input type="submit" value="Add" />
            </form>
        </div>
    );
}

export default App;
