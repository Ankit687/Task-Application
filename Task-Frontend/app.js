class Task {
  constructor(id, title, description, createDate, endDate, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createDate = createDate;
    this.endDate = endDate;
    this.status = status;
  }
}

class TaskDto {
  constructor(taskTitle, taskDescription) {
    this.taskTitle = taskTitle;
    this.taskDescription = taskDescription;
  }
}

class TaskResponseDto {
  constructor(status, task) {
    this.status = status;
    this.task = task;
  }
}

// default things
const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };

// Selectors
const createTaskTitle = document.querySelector(".create-task-title");
const createTaskDescription = document.querySelector(".create-task-description");
const createTaskButton = document.querySelector(".create-task-button");
const taskList = document.querySelector(".task-list");
const filterOption = document.querySelector(".filter-task");

// Event Listeners
document.addEventListener("DOMContentLoaded", getAllTaskList);
createTaskButton.addEventListener("click", addTask);
taskList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTask);

// Functions
function addTask(event) {
  // prevent form from submitting
  event.preventDefault();

  // Define the API endpoint
  const apiUrl = 'http://localhost:8080/createTask';

  // Create a new TaskDto instance with data
  const taskData = new TaskDto(createTaskTitle.value, createTaskDescription.value);

  // Configure the fetch request
  const requestOptions = {
    method: 'POST', // or 'PUT', 'GET', etc. depending on your API
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  };

  // Make the API request
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the API response data
      // Parse the response into a TaskResponseDto
      if (data.status == "Task Created Successfully") {
        const taskData = new Task(
          data.task.id,
          data.task.title,
          data.task.description,
          new Date(data.task.createdDate),
          data.task.endDate ? new Date(data.task.endDate) : null,
          data.task.status
        );

        const taskResponse = new TaskResponseDto(data.status, taskData);
        console.log('Task Response:', taskResponse);
        console.log("date: ", data.task.createdDate.toLocaleString('en-IN', options));
        // create DIV
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        // create li
        const newTaskId = document.createElement("li");
        newTaskId.innerText = data.task.id;
        // newTaskId.classList.add("task-item");
        newTaskId.classList.add("hidden-item");
        taskDiv.appendChild(newTaskId);

        const newTaskTitle = document.createElement("li");
        newTaskTitle.innerText = data.task.title;
        newTaskTitle.classList.add("task-item");
        taskDiv.appendChild(newTaskTitle);

        const newTaskDescription = document.createElement("li");
        newTaskDescription.innerText = data.task.description;
        newTaskDescription.classList.add("task-item");
        taskDiv.appendChild(newTaskDescription);

        const newTaskCreateDate = document.createElement("li");
        newTaskCreateDate.innerText = new Date(data.task.createdDate).toLocaleString('en-IN', options);
        newTaskCreateDate.classList.add("task-item");
        taskDiv.appendChild(newTaskCreateDate);

        const newTaskStatus = document.createElement("li");
        newTaskStatus.innerText = 'IN-PROGRESS';
        newTaskStatus.classList.add("task-item");
        taskDiv.appendChild(newTaskStatus);

        // check mark button
        const completedButton = document.createElement("button");
        completedButton.classList.add("complete-btn");
        completedButton.innerHTML = '<i class="fas fa-check"> </i>';
        taskDiv.appendChild(completedButton);

        // check trash button
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-btn");
        trashButton.innerHTML = '<i class="fas fa-trash"> </i>';
        taskDiv.appendChild(trashButton);

        // append to list
        taskList.appendChild(taskDiv);

        // clear Task input values
        createTaskTitle.value = "";
        createTaskDescription.value = "";
      }
      console.log('API Response:', data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
}

function deleteCheck(e) {
  const item = e.target;
  const task = item.parentElement;
  // console.log('task', task);
  // task.removeChild(task.childNodes[0]);
  console.log('task2', task);
  console.log('task2', task.classList.value);
  // console.log('item', item);
  // console.log('task', task.childNodes[0].innerText);

  // Delete task
  if (item.classList[0] === "trash-btn") {
    // Animation
    task.classList.add("fall");
    removeTasks(task.childNodes[0].innerText);
    task.addEventListener("transitionend", function () {
      task.remove();
    });
  }

  // check mark
  if (item.classList[0] === "complete-btn") {
    task.classList.toggle("completed");
    completedTasks(task.childNodes[0].innerText, task);
  }
}

function filterTask(e) {
  const tasks = taskList.childNodes;

  tasks.forEach(function (task) {
    switch (e.target.value) {
      case "all":
        task.style.display = "flex";
        break;

      case "completed":
        if (task.classList.contains("completed")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;

      case "uncompleted":
        if (!task.classList.contains("completed")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
    }
  });
}

function getAllTaskList() {
  let tasks = []

  const apiUrl = `http://localhost:8080/getTaskList`;

  // Make a GET request using the Fetch API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response data here (data contains the task)
      // Convert the API response into a list of Task objects
      tasks = data.map((item) => {
        return new Task(
          item.id,
          item.title,
          item.description,
          new Date(item.createdDate),
          item.endDate ? new Date(item.endDate) : null,
          item.status
        );
      });
      // console.log("tasks: ", tasks);
      // console.log('Task Data:', data);
      tasks.forEach(function (task) {
        // create DIV
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        // create li
        const newTaskId = document.createElement("li");
        newTaskId.innerText = task.id;
        // console.log('taskTitle: ', task.title)
        // newTaskId.classList.add("task-item");
        newTaskId.classList.add("hidden-item");
        taskDiv.appendChild(newTaskId);

        const newTaskTitle = document.createElement("li");
        newTaskTitle.innerText = task.title;
        // console.log('taskTitle: ', task.title)
        newTaskTitle.classList.add("task-item");
        taskDiv.appendChild(newTaskTitle);

        const newTaskDescription = document.createElement("li");
        newTaskDescription.innerText = task.description;
        newTaskDescription.classList.add("task-item");
        taskDiv.appendChild(newTaskDescription);

        const newTaskCreateDate = document.createElement("li");
        newTaskCreateDate.innerText = task.createDate.toLocaleString('en-IN', options);
        newTaskCreateDate.classList.add("task-item");
        taskDiv.appendChild(newTaskCreateDate);

        if (task.status == 0) {
          const newTaskEndDate = document.createElement("li");
          newTaskEndDate.innerText = task.endDate.toLocaleString('en-IN', options);
          newTaskEndDate.classList.add("task-item");
          taskDiv.appendChild(newTaskEndDate);

          const newTaskStatus = document.createElement("li");
          newTaskStatus.innerText = 'COMPLETED';
          newTaskStatus.classList.add("task-item");
          taskDiv.appendChild(newTaskStatus);
          
          taskDiv.classList.toggle("completed");
        } else {
          const newTaskStatus = document.createElement("li");
          newTaskStatus.innerText = 'IN-PROGRESS';
          newTaskStatus.classList.add("task-item");
          taskDiv.appendChild(newTaskStatus);
        }

        // check mark button
        const completedButton = document.createElement("button");
        completedButton.classList.add("complete-btn");
        completedButton.innerHTML = '<i class="fas fa-check"> </i>';
        taskDiv.appendChild(completedButton);

        // check trash button
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-btn");
        trashButton.innerHTML = '<i class="fas fa-trash"> </i>';
        taskDiv.appendChild(trashButton);

        // append to list
        taskList.appendChild(taskDiv);
      });
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
}

function removeTasks(id) {
  // check already is there
  const apiUrl = 'http://localhost:8080/deleteTask/' + id;

  // Configure the fetch request
  const requestOptions = {
    method: 'POST', // or 'PUT', 'GET', etc. depending on your API
  };

  // Make the API request
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response;
    })
    .then((data) => {
      // Handle the API response data
      // Parse the response into a TaskResponseDto
      console.log(data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
}

function completedTasks(id, task) {
  // check already is there
  const apiUrl = 'http://localhost:8080/completedTask/' + id;

  // Configure the fetch request
  const requestOptions = {
    method: 'POST', // or 'PUT', 'GET', etc. depending on your API
  };

  // Make the API request
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the API response data
      // Parse the response into a TaskResponseDto
      if (data.status === "Updated Task Successfully") {
        const taskData = new Task(
          data.task.id,
          data.task.title,
          data.task.description,
          new Date(data.task.createdDate),
          data.task.endDate ? new Date(data.task.endDate) : null,
          data.task.status
        );
        
        if (taskData.status == 0) {
          task.removeChild(task.childNodes[4]);
          task.removeChild(task.childNodes[4]);
          task.removeChild(task.childNodes[4]);
          const newTaskEndDate = document.createElement("li");
          newTaskEndDate.innerText = taskData.endDate.toLocaleString('en-IN', options);
          newTaskEndDate.classList.add("task-item");
          task.appendChild(newTaskEndDate);

          const newTaskStatus = document.createElement("li");
          newTaskStatus.innerText = 'COMPLETED';
          newTaskStatus.classList.add("task-item");
          task.appendChild(newTaskStatus);

        } else {
          task.removeChild(task.childNodes[4]);
          task.removeChild(task.childNodes[4]);
          task.removeChild(task.childNodes[4]);
          task.removeChild(task.childNodes[4]);
          const newTaskStatus = document.createElement("li");
          newTaskStatus.innerText = 'IN-PROGRESS';
          newTaskStatus.classList.add("task-item");
          task.appendChild(newTaskStatus);
        }

        // check mark button
        const completedButton = document.createElement("button");
        completedButton.classList.add("complete-btn");
        completedButton.innerHTML = '<i class="fas fa-check"> </i>';
        task.appendChild(completedButton);

        // check trash button
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-btn");
        trashButton.innerHTML = '<i class="fas fa-trash"> </i>';
        task.appendChild(trashButton);

        console.log("taskData: ", taskData);
      }
      console.log(data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
}

// !localStorage.clear();
