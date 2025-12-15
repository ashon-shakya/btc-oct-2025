import express from "express";
import fs from "fs-extra";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

// cors
// allow every origin
app.use(cors());

// request.body
// application-json
app.use(express.json());
// form data
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({
    status: "success",
    message: "THIS IS TASK API! APP IS HEALTHY!",
  });
});

// read task data
const readTaskData = () => {
  let taskList = JSON.parse(fs.readFileSync("./data/tasks.json"));
  return taskList;
};

const writeTaskData = (data) => {
  fs.writeFileSync("./data/tasks.json", JSON.stringify(data));
};

// task api
// { task, hour, type}
// Create Task
// {task,hour,type}
app.post("/api/v1/tasks", (req, res) => {
  // get new task data from request
  let newTaskData = req.body;

  // read tasks.json
  let taskList = readTaskData();

  // update task list
  taskList.push(newTaskData);

  //  write task list
  // fs.writeFileSync("./data/tasks.json", JSON.stringify(taskList));
  writeTaskData(taskList);

  return res.json({
    status: "success",
    message: "New Task created!",
  });
});

// Read Task all tasks
app.get("/api/v1/tasks", (req, res) => {
  // read tasks.json
  let taskList = readTaskData();

  return res.json({
    status: "success",
    message: "TASK fetched!",
    tasks: taskList,
  });
});

// Update Task
// update task
app.patch("/api/v1/tasks/:_id", (req, res) => {
  // get task id
  let taskId = req.params._id;

  // body
  let updatedData = req.body;
  // {task,type,hour}

  console.log(111, updatedData);

  // read data
  let taskList = readTaskData();

  // select task
  let task = taskList.find((item) => item.id == taskId);
  // {id,task,type,hour}
  // task = {...{id,task,hour,type} , ...udpatedData}
  // task= {id,task,hour,type , ...{task,hour,type}}
  // task = {id,task,hour, type, task, hour ,type}
  // using spread operator
  // task = { ...task, ...updatedData };

  // simple if conditions

  if (updatedData.type) {
    task.type = updatedData.type;
  }

  if (updatedData.task) {
    task.task = updatedData.task;
  }

  if (updatedData.hour) {
    task.hour = updatedData.hour;
  }

  // write data
  writeTaskData(taskList);

  return res.json({
    status: "success",
    message: "Task updated!",
  });
});

// TODO: delete Task
// Delete Task
app.delete("/api/v1/tasks/:_id", (req, res) => {});

// // make connection to mongoose
// mongoose
//   .connect("mongodb://127.0.0.1:27017/ntdl-db")
//   .then(() => console.log("Database Connected!"));

app.listen(PORT, (error) => {
  if (error) {
    console.error("SERVER NOT STARTED");
  } else {
    console.log("SERVER STARTE AT PORT : ", PORT);
  }
});
