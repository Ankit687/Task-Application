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

class TaskDto1 {
  constructor(id, taskTitle, taskDescription) {
    this.id = id;
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
const searchTitle = document.querySelector(".search-title");
const searchTitleButton = document.querySelector(".search-task-button");

// Event Listeners
document.addEventListener("DOMContentLoaded", getAllTaskList);
createTaskButton.addEventListener("click", addTask);
taskList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTask);
searchTitleButton.addEventListener("click", searchTask);

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
        // console.log('Task Response:', taskResponse);
        // console.log("date: ", data.task.createdDate.toLocaleString('en-IN', options));
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
        newTaskCreateDate.classList.add("date-item");
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

        // edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.innerHTML = '<i class="fas fa-edit"> </i>';
        taskDiv.appendChild(editButton);

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
      } else {
        showMessage(data.status);
      }
      console.log('API Response:', data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
}

function deleteCheck(e) {
  let flag = false;
  const item = e.target;
  const task = item.parentElement;
  // console.log('task', task);
  // console.log("item", item.classList)

  // Delete task
  if (item.classList[0] === "trash-btn") {
    // Animation
    task.classList.add("fall");
    removeTasks(task.childNodes[0].innerText);
    task.addEventListener("transitionend", function () {
      task.remove();
    });
  }

  // edit task
  if (item.classList[0] === "edit-btn") {
    // task.childNodes[6].childNodes[0].classList.remove("fa-edit");
    item.childNodes[0].classList.add("fa-plus-square");
    item.classList.remove("edit-btn");
    item.classList.add("update-btn");

    const inputElementTitle = document.createElement("input");
    inputElementTitle.type = "text";
    inputElementTitle.value = task.childNodes[1].textContent;
    // task.childNodes[1].innerHTML = "";
    inputElementTitle.classList.add("edit-item");
    task.replaceChild(inputElementTitle, task.childNodes[1]);
    // task.childNodes[1].appendChild(inputElementTitle);

    const inputElementDes = document.createElement("input");
    inputElementDes.type = "text";
    inputElementDes.value = task.childNodes[2].textContent;
    // task.childNodes[2].innerHTML = "";
    inputElementDes.classList.add("edit-item");
    task.replaceChild(inputElementDes, task.childNodes[2]);
    // task.childNodes[2].appendChild(inputElementDes);
    flag = true;
  }

  // update task
  if (item.classList[0] === "update-btn" && flag == false) {
    item.childNodes[0].classList.remove("fa-plus-square");
    item.childNodes[0].classList.add("fa-edit");
    item.classList.remove("update-btn");
    item.classList.add("edit-btn");

    updateTask(task.childNodes[0].innerText, task);
    // window.location.reload();
  }

  // check mark
  if (item.classList[0] === "complete-btn") {
    task.classList.toggle("completed");
    completedTask(task.childNodes[0].innerText, task);
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
      
      case "reset":
        window.location.reload();
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
        newTaskCreateDate.classList.add("date-item");
        taskDiv.appendChild(newTaskCreateDate);

        if (task.status == 0) {
          const newTaskEndDate = document.createElement("li");
          newTaskEndDate.innerText = task.endDate.toLocaleString('en-IN', options);
          newTaskEndDate.classList.add("task-item");
          newTaskEndDate.classList.add("date-item");
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

        // edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.innerHTML = '<i class="fas fa-edit"> </i>';
        taskDiv.appendChild(editButton);

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

function completedTask(id, task) {
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
          task.removeChild(task.childNodes[4]);
          const newTaskEndDate = document.createElement("li");
          newTaskEndDate.innerText = taskData.endDate.toLocaleString('en-IN', options);
          newTaskEndDate.classList.add("task-item");
          newTaskEndDate.classList.add("date-item");
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

        // edit button
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        editButton.innerHTML = '<i class="fas fa-edit"> </i>';
        task.appendChild(editButton);

        // check trash button
        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-btn");
        trashButton.innerHTML = '<i class="fas fa-trash"> </i>';
        task.appendChild(trashButton);

        // console.log("taskData: ", taskData);
      }
      console.log(data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
}

function updateTask(id, task) {
  // check already is there
  // Define the API endpoint
  const apiUrl = 'http://localhost:8080/createTask';

  // Create a new TaskDto instance with data
  const taskData = new TaskDto1(id, task.childNodes[1].value, task.childNodes[2].value);

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
      if (data.status === "Task Created Successfully") {
        const taskData = new Task(
          data.task.id,
          data.task.title,
          data.task.description,
          new Date(data.task.createdDate),
          data.task.endDate ? new Date(data.task.endDate) : null,
          data.task.status
        );

        const liElementTitle = document.createElement("li");
        liElementTitle.innerText = taskData.title;
        liElementTitle.classList.add("task-item");
        task.replaceChild(liElementTitle, task.childNodes[1]);
        const liElementDes = document.createElement("li");
        liElementDes.innerText = taskData.description;
        liElementDes.classList.add("task-item");
        task.replaceChild(liElementDes, task.childNodes[2]);

        // console.log("taskData: ", taskData);
      }
      console.log(data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });
}

function searchTask(event) {
  event.preventDefault();

  const apiUrl = 'http://localhost:8080/getTask/' + searchTitle.value;

  // Make a GET request using the Fetch API
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const taskData = new Task(
        data.id,
        data.title,
        data.description,
        new Date(data.createdDate),
        data.endDate ? new Date(data.endDate) : null,
        data.status
      );

      const taskResponse = new TaskResponseDto(data.status, taskData);
      // console.log('Task Response:', taskResponse);
      // console.log("date: ", data.task.createdDate.toLocaleString('en-IN', options));
      // create DIV
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task");

      // create li
      const newTaskId = document.createElement("li");
      newTaskId.innerText = data.id;
      // newTaskId.classList.add("task-item");
      newTaskId.classList.add("hidden-item");
      taskDiv.appendChild(newTaskId);

      const newTaskTitle = document.createElement("li");
      newTaskTitle.innerText = data.title;
      newTaskTitle.classList.add("task-item");
      taskDiv.appendChild(newTaskTitle);

      const newTaskDescription = document.createElement("li");
      newTaskDescription.innerText = data.description;
      newTaskDescription.classList.add("task-item");
      taskDiv.appendChild(newTaskDescription);

      const newTaskCreateDate = document.createElement("li");
      newTaskCreateDate.innerText = new Date(data.createdDate).toLocaleString('en-IN', options);
      newTaskCreateDate.classList.add("task-item");
      newTaskCreateDate.classList.add("date-item");
      taskDiv.appendChild(newTaskCreateDate);

      if (data.status == 0) {
        const newTaskEndDate = document.createElement("li");
        newTaskEndDate.innerText = new Date(data.endDate).toLocaleString('en-IN', options);
        newTaskEndDate.classList.add("task-item");
        newTaskEndDate.classList.add("date-item");
        taskDiv.appendChild(newTaskEndDate);

        const newTaskStatus = document.createElement("li");
        newTaskStatus.innerText = 'COMPLETED';
        newTaskStatus.classList.add("task-item");
        taskDiv.appendChild(newTaskStatus);

        filterOption.value = "completed";

        taskDiv.classList.toggle("completed");
      } else {
        const newTaskStatus = document.createElement("li");
        newTaskStatus.innerText = 'IN-PROGRESS';
        newTaskStatus.classList.add("task-item");
        taskDiv.appendChild(newTaskStatus);

        filterOption.value = "uncompleted";
      }

      // check mark button
      const completedButton = document.createElement("button");
      completedButton.classList.add("complete-btn");
      completedButton.innerHTML = '<i class="fas fa-check"> </i>';
      taskDiv.appendChild(completedButton);

      // edit button
      const editButton = document.createElement("button");
      editButton.classList.add("edit-btn");
      editButton.innerHTML = '<i class="fas fa-edit"> </i>';
      taskDiv.appendChild(editButton);

      // check trash button
      const trashButton = document.createElement("button");
      trashButton.classList.add("trash-btn");
      trashButton.innerHTML = '<i class="fas fa-trash"> </i>';
      taskDiv.appendChild(trashButton);

      // append to list
      // console.log(taskList.childNodes.length);
      // console.log(taskList.removeChild(taskList.childNodes[0]));
      while(taskList.childNodes.length != 0) {
        taskList.removeChild(taskList.childNodes[0]);
      }
      taskList.appendChild(taskDiv);
      console.log(data);
    })
    .catch((error) => {
      console.error('API Error:', error);
    });

  searchTitle.value = "";
}

function showMessage(message) {
  const modal = document.getElementById("popupModal");
  const popupMessage = document.getElementById("popupMessage");
  popupMessage.textContent = message;
  modal.style.display = "block";

  // Close the pop-up when the user clicks the close button
  const closeModalButton = document.getElementById("closeModal");
  closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

// !localStorage.clear();
