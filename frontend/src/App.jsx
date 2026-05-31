import { useEffect, useState } from "react";
import axios from "axios";
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import "./index.css";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/todos");
        setTodos([...response.data].reverse());
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError("Please enter a task");
      return;
    }

    setError("");

    try {
      const response = await axios.post("/api/todos", {
        text: newTodo,
      });

      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error(error);
    }
  };
  const toggleComplete = async (todo) => {
    try {
      const response = await axios.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed,
      });

      setTodos(
        todos.map((t) =>
          t._id === todo._id ? response.data : t
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);

      setTodos(
        todos.filter((todo) => todo._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditedText("");
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        text: editedText,
      });

      setTodos(
        todos.map((todo) =>
          todo._id === id ? response.data : todo
        )
      );

      setEditingTodo(null);
      setEditedText("");
    } catch (error) {
      console.error(error);
    }
  };
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-3 pb-8 sm:p-6 ">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-5">
          Task Manager
        </h1>

        <form
          onSubmit={addTodo}
          className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-4"        >
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 px-3 py-2 text-sm outline-none"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 text-sm font-medium"
          >
            Add Task
          </button>
        </form>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar-arrows">
          {sortedTodos.map((todo) => (
          <div
            key={todo._id}
            className="flex items-center justify-between py-2"
          >
            {editingTodo === todo._id ? (
              <>
                <div className="flex-1 mr-3">
                  <input
                    type="text"
                    value={editedText}
                    onChange={(e) =>
                      setEditedText(e.target.value)
                    }
                    className="w-full px-4 py-2 border-2 border-blue-300 rounded-xl outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveEdit(todo._id)
                    }
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg cursor-pointer"
                  >
                    <IconCheck size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg cursor-pointer"
                  >
                    <IconX size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      toggleComplete(todo)
                    }
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0
                        ${todo.completed
                        ? "bg-green-500 border-green-500"
                        : "bg-white border-gray-300"
                      }`}
                  >
                    {todo.completed && (
                      <IconCheck
                        size={16}
                        color="black"
                        stroke={3}
                      />
                    )}
                  </button>

                  <p
                    className={`text-sm sm:text-base font-medium truncate
                        ${todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                      }`}
                  >
                    {todo.text}
                  </p>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 ml-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(todo)}
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                  >
                    <IconEdit size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(todo._id)
                    }
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default App;