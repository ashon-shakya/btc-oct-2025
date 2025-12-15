import express from "express";
import fs from "fs-extra";
import cors from "cors";

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

// task api
// { task, hour, type}
// Create Task
// {task,hour,type}
app.post("/api/v1/tasks", (req, res) => {
  // get new task data from request
  let newTaskData = req.body;

  // read tasks.json
  let taskList = JSON.parse(fs.readFileSync("./data/tasks.json"));

  // update task list
  taskList.push(newTaskData);

  //  write task list
  fs.writeFileSync("./data/tasks.json", JSON.stringify(taskList));

  return res.json({
    status: "success",
    message: "New Task created!",
  });
});

// Read Task all tasks
app.get("/api/v1/tasks", (req, res) => {
  // read tasks.json
  let taskList = JSON.parse(fs.readFileSync("./data/tasks.json"));

  return res.json({
    status: "success",
    message: "TASK fetched!",
    tasks: taskList,
  });
});

// Update Task
// TODO: update task
app.patch("/api/v1/tasks/:_id", (req, res) => {});

// TODO: delete Task
// Delete Task
app.delete("/api/v1/tasks/:_id", (req, res) => {});

app.listen(PORT, (error) => {
  if (error) {
    console.error("SERVER NOT STARTED");
  } else {
    console.log("SERVER STARTE AT PORT : ", PORT);
  }
});
