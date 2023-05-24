import { useState } from 'react';

const EDIT_MODE = 1;
const NORMAL_MODE = 2;

/**
 * Item:
 *  - description
 *  - status: pending/completed
 *  - deleted 
 *  - category
 *  - tags
 */

export function Todo({ todo, updateTodo } ) {
    const [mode, setMode] = useState(NORMAL_MODE);
    const [editModeInputText, setEditModeInputText] = useState("");

    const handleNormalModeInputChange = () => {
        updateTodo(todo.id, { status: !todo.status });
    }

    const onEdit = () => {
        setMode(EDIT_MODE);
        setEditModeInputText(todo.description);
    }

    const onDelete = () => {
        updateTodo(todo.id, { deleted: true });
    }

    const onSave = () => {
        setMode(NORMAL_MODE);
        updateTodo(todo.id, { description: editModeInputText });
    }

    const onCancel = () => {
        setMode(NORMAL_MODE);
        setEditModeInputText(todo.description);
    }

    const onRestore = () => {
        updateTodo(todo.id, { deleted: false });
    }

    const handleEditModeInputChange = (e) => {
        setEditModeInputText(e.target.value);
    }

    if(todo.deleted == true) {
        return (
            <div>
                <input type="checkbox" checked={todo.status} onChange={handleNormalModeInputChange} />
                <span>{todo.description}</span>
                <button onClick={onRestore}>Restore</button>
            </div>
        );
    }

    if(mode == NORMAL_MODE) {
        return (
            <div>
            <input type="checkbox" checked={todo.status} onChange={handleNormalModeInputChange} />
            <span>{todo.description}&nbsp;</span>
            <button onClick={onEdit}>Edit</button>
            <button onClick={onDelete}>Delete</button>
            </div>
        ) 
    }

    else if(mode == EDIT_MODE)
    {
        return <div>
            <input type="text" value={editModeInputText} onChange={handleEditModeInputChange} />
            <button onClick={onSave}>Save</button>
            <button onClick={onCancel}>Cancel</button>
            </div>
    }

    return "";
}

export function TodoList({ todoList, updateTodo }) {
    return <ul>{todoList.map(todo => 
        <li key={todo.id}>
            <Todo todo={todo} updateTodo={updateTodo} />
        </li>
    )}</ul>
}
