// task data source
// get data from local storage
const localData = JSON.parse(localStorage.getItem("taskList"));
let taskList = [];

// to edit
let selectedTask = {};

// add button event lister
const addButton = document.getElementById("add-btn");
addButton.addEventListener("click", () => {
  console.log("LOPG");
});

// render current state of task list
const renderTaskList = () => {
  // render good list

  let goodTaskList = taskList.filter((item) => item.type === "good");

  // select goodListTable Element
  let goodListTableElement = document.getElementById("goodListTable");

  let goodTrList = "";
  let goodIndex = 0;

  // populate good Tr list using goodTaskList
  for (let item of goodTaskList) {
    goodIndex += 1;
    // template literals
    let tr = ` <tr>
                    <td scope="row">${goodIndex}   <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
</td>
                            <td>${item.task}</td>
                            <td>${item.hour} Hour</td>
                            <td>
                                <button type="button" class="btn btn-danger" onclick="deleteTask('${item.id}')"><i
                                        class="fa-solid fa-dumpster"></i></button>

                                <button type="button" class="btn btn-success" onclick="swapTask('${item.id}')"><i
                                        class="fa-solid fa-arrow-right-to-bracket" ></i></button>
                                <button type="button" class="btn btn-primary" onclick="selectTask('${item.id}')">Edit</button>
                    </td>
                </tr>`;

    goodTrList += tr;
  }

  console.log("GOOD TR LIST", goodTrList);

  goodListTableElement.innerHTML = goodTrList;

  //   render bad list

  let badTaskList = taskList.filter((item) => item.type === "bad");

  // select badListTable Element
  let badListTableElement = document.getElementById("badListTable");

  let badTrList = "";
  let badIndex = 0;

  // populate good Tr list using goodTaskList
  for (let item of badTaskList) {
    badIndex += 1;
    let tr = ` <tr>
                            <td scope="row">${badIndex}   <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
</td>
                            <td>${item.task}</td>
                            <td>${item.hour} Hour</td>
                            <td>
                                <button type="button" class="btn btn-warning" onclick="swapTask('${item.id}')"><i
                                        class="fa-solid fa-arrow-left-long"></i></button>
                                <button type="button" class="btn btn-danger" onclick="deleteTask('${item.id}')"><i
                                        class="fa-solid fa-dumpster"></i></button>
                                <button type="button" class="btn btn-primary" onclick="selectTask('${item.id}')">Edit</button>

                            </td>
                        </tr>`;

    badTrList += tr;
  }

  // console.log(goodTrList);
  badListTableElement.innerHTML = badTrList;

  // update bad hours
  let badHourElement = document.getElementById("badHours");
  let badHours = badTaskList.reduce((acc, item) => acc + item.hour, 0);

  badHourElement.innerText = badHours;

  // update total hours
  let totalHourElement = document.getElementById("totalHours");

  let totalHours = taskList.reduce((acc, item) => acc + item.hour, 0);

  totalHourElement.innerText = totalHours;
};

renderTaskList();

// get data from not to do list api
const fetchTasksFromAPI = async () => {
  // call api
  // taskList = tasks from api
  console.log("FETCH DATA FROM API");

  // call api get th resposne
  let response = await fetch("http://localhost:3000/api/v1/tasks");
  // convert response to json data
  let data = await response.json();

  console.log("RESPONSE FROM API", data);

  if (data.status === "success") {
    taskList = data.tasks;
    renderTaskList();
  }
};

fetchTasksFromAPI();

// random id generator
const randomIdGenerator = (inputLen = 6) => {
  /**
   * Function Description: Generate random string with length 6
   * inputLen: input length of string, default value is 6
   */
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let rString = "";
  let length = inputLen;

  for (let i = 0; i < length; i++) {
    let randomNumber = Math.floor(Math.random() * characters.length);

    rString += characters[randomNumber];
  }

  return rString;
};

// update localStorage
const updateLocalStorage = () => {
  localStorage.setItem("taskList", JSON.stringify(taskList));
};

// adding task
const addTask = () => {
  /**
   * 1. get value of task input element
   * 2. get value of hour input element
   * 3. get value of type input element
   * 3.1 check for business rule
   * 4. create a task object
   * 5. push task object to task list array
   * 6. render task list
   */

  let taskInputElement = document.getElementById("task");
  let taskInputValue = taskInputElement.value;

  let hourInputValue = document.getElementById("hour").value;
  let typeInputValue = document.getElementById("type").value;

  if (
    taskInputValue.trim() != "" &&
    hourInputValue.trim() != "" &&
    typeInputValue.trim() != ""
  ) {
    let taskObject = {
      id: randomIdGenerator(),
      task: taskInputValue,
      hour: parseInt(hourInputValue),
      type: typeInputValue,
    };

    // business rule
    // 1. max weekly hour
    const MAX_WEEKLY_HOUR = 7 * 24;

    const totalHours = taskList.reduce((acc, item) => acc + item.hour, 0);

    if (totalHours + taskObject.hour <= MAX_WEEKLY_HOUR) {
      taskList.push(taskObject);

      // analyse our task
      analyzeTask();
      updateLocalStorage();
      renderTaskList();
    } else {
      alert("Max Weekly Hour Exceeded. Do not exert yourserlf.");
    }
  } else {
    alert("require input values");
  }
};

// swap task
const swapTask = (id) => {
  if (confirm("Do you want to Swap?")) {
    let selectedTask = taskList.find((item) => item.id === id);

    //   if(selectedTask.type == "good"){
    //     selectedTask.type = "bad";
    //   }
    //   else{
    //     selectedTask.type = "good";
    //   }

    selectedTask.type = selectedTask.type === "good" ? "bad" : "good";

    analyzeTask();
    updateLocalStorage();
    renderTaskList();
  }
};

// delete task
const deleteTask = (id) => {
  if (confirm("Do you want to Delete Task ?")) {
    taskList = taskList.filter((item) => item.id != id);
    analyzeTask();
    updateLocalStorage();
    renderTaskList();
  }
};

// analyze Task
const analyzeTask = () => {
  /**
   * Function analyses task
   * 1. Analyze more bad task
   */

  //1. more bad task
  // Step 1: get good hours, bad hours
  // Step 2: compare good hours and bad hours
  // Step 3: warning message if good hours < bad hours

  // step 1
  // good hours
  let goodTaskList = taskList.filter((item) => item.type == "good");
  let totalGoodHours = goodTaskList.reduce((acc, item) => acc + item.hour, 0);

  // let totalGoodHours = taskList.reduce((acc,item)=>{
  //   return item.type == "good" ? acc + item.hour : acc
  // }, 0)

  // bad hours
  let badTaskList = taskList.filter((item) => item.type == "bad");
  let totalBadHours = badTaskList.reduce((acc, item) => acc + item.hour, 0);

  // step 2
  if (totalGoodHours < totalBadHours) {
    alert("WARNING BAD HOURS EXCEEDING GOOD HOURS");
  }
};

const selectTask = (id) => {
  // fill input fields with previous value
  selectedTask = taskList.find((item) => item.id == id);

  console.log(selectedTask);

  let taskElement = document.getElementById("task");
  let hourElement = document.getElementById("hour");
  let typeElement = document.getElementById("type");

  taskElement.value = selectedTask.task;
  hourElement.value = selectedTask.hour;
  typeElement.value = selectedTask.type;

  // show the update butoon
  document.getElementById("update-btn").classList.remove("hidden");
  // hide the add button
  document.getElementById("add-btn").classList.add("hidden");
};

const updateTask = () => {
  // update selected task with input values
  let taskElement = document.getElementById("task");
  let hourElement = document.getElementById("hour");
  let typeElement = document.getElementById("type");

  selectedTask.task = taskElement.value;
  selectedTask.hour = parseInt(hourElement.value);
  selectedTask.type = typeElement.value;

  // clear selected task
  selectedTask = {};

  // hide the update butoon
  document.getElementById("update-btn").classList.add("hidden");
  // show the add button
  document.getElementById("add-btn").classList.remove("hidden");

  // reset input fields
  taskElement.value = "";
  hourElement.value = "";
  typeElement.value = "good";

  analyzeTask();
  updateLocalStorage();
  renderTaskList();
};
