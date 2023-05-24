import { useState } from 'react';
import { TodoList } from './Todo.js';

const initialTodoItems = [
    { id: 0, description: "Go shopping to the Mall", status: false, deleted: false },
    { id: 1, description: "Go for a walk in the morning", status: true, deleted: false },
    { id: 2, description: "Learn React.js basics", status: false, deleted: false },
];

function App() {
    const [todoItems, setTodoItems] = useState(initialTodoItems);
    const [showDeletedTodos, setShowDeletedTodos] = useState(false);
    const [createTodoInputText, setCreateTodoInputText] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        setTodoItems([...todoItems, {
            id: Math.random(),
            description: createTodoInputText,
            status: false,
            deleted: false
        }]);
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
    }

    const deletedTodoFilter = (todo) => todo.deleted == true;

    return (
        <div className="App">
        <h2>Todo List</h2>
        <TodoList todoList={todoItems} updateTodo={updateTodo} />
        <h2>Deleted</h2>
        {showDeletedTodos ?
            <div>
                <button onClick={() => setShowDeletedTodos(false)}>Hide Deleted</button>
                <TodoList todoList={todoItems} updateTodo={updateTodo} filter={deletedTodoFilter} />
            </div> :
            <button onClick={() => setShowDeletedTodos(true)}>Show Deleted</button>
        }
        <h2>Create Todo</h2>
        <form onSubmit={onSubmit} >
        <input placeholder="Type todo here..." type="text" width={ 20 } height={ 20 } onChange={(e) => setCreateTodoInputText(e.target.value)} />
        <input type="submit" value="Add" />
        </form>
        </div>
    );
}

export default App;
