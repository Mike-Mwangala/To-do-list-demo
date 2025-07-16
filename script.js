document.addEventListener('DOMContentLoaded', () => {
    // 1. Get DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const emptyListMessage = document.querySelector('.empty-list-message');

    // 2. Load Tasks from Local Storage on Page Load
    let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Initialize with empty array if no tasks saved

    // Function to save tasks to local storage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to render all tasks from the 'tasks' array
    const renderTasks = () => {
        taskList.innerHTML = ''; // Clear current list

        if (tasks.length === 0) {
            emptyListMessage.style.display = 'block'; // Show empty message
        } else {
            emptyListMessage.style.display = 'none'; // Hide empty message
            tasks.forEach((task, index) => {
                createTaskElement(task, index);
            });
        }
    };

    // Function to create a single task list item (li)
    const createTaskElement = (task, index) => {
        const listItem = document.createElement('li');
        listItem.dataset.index = index; // Store original index for easy access

        // Add 'completed' class if task is completed
        if (task.completed) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" title="Mark Complete">
                    <i class="${task.completed ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
                </button>
                <button class="delete-btn" title="Delete Task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        // Event listener for toggling completion (on the task text itself or the check button)
        const taskTextSpan = listItem.querySelector('.task-text');
        const completeBtn = listItem.querySelector('.complete-btn');
        const deleteBtn = listItem.querySelector('.delete-btn');

        // Toggle completion on text click
        taskTextSpan.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed; // Toggle the completed state in our array
            saveTasks(); // Save updated tasks
            renderTasks(); // Re-render the list to update UI
        });

        // Toggle completion on check button click
        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent text click event from firing
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Delete task on delete button click
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent text click event from firing
            tasks.splice(index, 1); // Remove task from array
            saveTasks(); // Save updated tasks
            renderTasks(); // Re-render the list
        });

        taskList.appendChild(listItem);
    };

    // 3. Add New Task Functionality
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === "") {
            alert("Please enter a task!");
            return;
        }

        const newTask = {
            text: taskText,
            completed: false
        };

        tasks.push(newTask); // Add new task to our array
        saveTasks(); // Save the updated array
        taskInput.value = ''; // Clear input field
        renderTasks(); // Re-render the list to show new task
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // 4. Clear Completed Tasks Functionality
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed); // Keep only uncompleted tasks
        saveTasks();
        renderTasks();
    });

    // Initial render when the page loads
    renderTasks();
});