import express from "express";
import fs from "fs-extra";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// task schema
const taskSchema = new mongoose.Schema({
  task: String,
  hour: Number,
  type: String,
});

const Task = mongoose.model("Task", taskSchema);

// // user schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   age: Number,
// });

// const User = mongoose.model("User", userSchema);

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

// app.<requestType>(endpoint, (req, res)=>{
//   return res.json({
//     status: "success",
//     message: "THIS IS API"
//   })
// })

app.post("/api/v1/tasks", async (req, res) => {
  // get new task data from request
  let newTaskData = req.body;

  // read tasks.json
  // let taskList = readTaskData();

  // // update task list
  // taskList.push(newTaskData);

  // //  write task list
  // // fs.writeFileSync("./data/tasks.json", JSON.stringify(taskList));
  // writeTaskData(taskList);

  // database operation
  let data = await Task.insertOne(newTaskData);

  return res.json({
    status: "success",
    message: "New Task created!",
  });
});

// Read Task all tasks
app.get("/api/v1/tasks", async (req, res) => {
  // read tasks.json
  // let taskList = readTaskData();

  // let queryVariables = req.query;
  // if (queryVariables) {
  //   console.log("Query", queryVariables);
  // }
  const { type } = req.query;
  let filter = {};

  if (type) {
    filter.type = type;
  }

  // read from database
  let data = await Task.find(filter);

  data = data.map((item) => {
    return { type: item.type, task: item.task, hour: item.hour, id: item._id };
  });

  return res.json({
    status: "success",
    message: "TASK fetched!",
    tasks: data,
  });
});

// Read Task of specific id
app.get("/api/v1/tasks/:_id", async (req, res) => {
  const taskId = req.params._id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found!",
      });
    }

    return res.json({
      status: "success",
      message: "Task fetched!",
      task,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid task ID",
    });
  }
});

// Update Task
// update task
app.patch("/api/v1/tasks/:_id", async (req, res) => {
  // get task id
  let taskId = req.params._id;

  // body
  let updatedData = req.body;
  // {task,type,hour}

  // update data in database
  // let data = await Task.findOneAndUpdate({_id: taskId} , updatedData)
  let data = await Task.findByIdAndUpdate(taskId, updatedData);

  // console.log(111, updatedData);

  // // read data
  // let taskList = readTaskData();

  // // select task
  // let task = taskList.find((item) => item.id == taskId);
  // // {id,task,type,hour}
  // // task = {...{id,task,hour,type} , ...udpatedData}
  // // task= {id,task,hour,type , ...{task,hour,type}}
  // // task = {id,task,hour, type, task, hour ,type}
  // // using spread operator
  // // task = { ...task, ...updatedData };

  // // simple if conditions

  // if (updatedData.type) {
  //   task.type = updatedData.type;
  // }

  // if (updatedData.task) {
  //   task.task = updatedData.task;
  // }

  // if (updatedData.hour) {
  //   task.hour = updatedData.hour;
  // }

  // write data
  // writeTaskData(taskList);

  return res.json({
    status: "success",
    message: "Task updated!",
  });
});

// TODO: delete Task
// Delete Task
app.delete("/api/v1/tasks/:_id", (req, res) => {});

// // make connection to mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected!", process.env.MONGO_URL))
  .catch((err) => {
    console.log("DB Failed to connect at ", process.env.MONGO_URL);
  });

app.listen(PORT, (error) => {
  if (error) {
    console.error("SERVER NOT STARTED");
  } else {
    console.log("SERVER STARTE AT PORT : ", PORT);
  }
});
