import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  return res.json({
    status: "success",
    message: "THIS IS TASK API! APP IS HEALTHY!",
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error("SERVER NOT STARTED");
  } else {
    console.log("SERVER STARTE AT PORT : ", PORT);
  }
});
