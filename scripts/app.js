function saveTask(){
    //1. get values from the DOM
    const title = $("#txtTitle").val();
    const desc = $("#txtDescription").val();
    const color = $("#selColor").val();
    const date = $("#selDate").val();
    const status = $("#selStatus").val();
    const budget = $("#numBudget").val();
    const priority = $("#selPriority").val();

    // stop if the title is empty
    if (title.trim() === "") {
        $("#errorMsg").text("Please enter a title.");
        return; // leave the function, don't save
    }
    $("#errorMsg").text(""); // clear any old error

    // create an Object using  our class

    const taskToSave = new Task(title, desc, color, date, status, budget, priority);
    //send the task to the server
    $.ajax(
      {
        type: "Post", //HTTP verb Create
        url: serverName,
        data: JSON.stringify(taskToSave),
        contentType: "application/json",
        success: function(response) {
            console.log(response);
            clearForm();
            loadTask();
        },
        error: function(fail) {
            console.log(fail);
        }
      }
    )

}

// puts every input in the form back to its starting value
function clearForm() {
    $("#taskForm")[0].reset();
}

const serverName="https://106api-b0bnggbsgnezbzcz.westus3-01.azurewebsites.net/api/tasks";

let allTasks = []; // every task we got from the server

function updateTask(){
  $.ajax({
      type: "put", //HTTP verb Update
      url:"https://106api-b0bnggbsgnezbzcz.westus3-01.azurewebsites.net/api/tasks/1",
      data:JSON.stringify({
       title:"Hello",
       budget: 100,
      }),
      contentType: "application/json",
      success: function(response) {
          console.log(response);
      },
      error: function(fail) {
          console.log(fail);
      }
  })
}

function loadTask(){
    $.ajax(
        {
            type: "get", //HTTP verb Read
            url: serverName,
            dataType: "json",
            success: function(data)
            {
                console.log(data);
                allTasks = data;  // save them
                renderList();     // draw them (with the filter applied)
            },
            error: function(fail)
            {
                console.log(fail)
            }
        }
    )
}

// shows only the tasks that match the filter dropdown
function renderList() {
    const filter = $("#selFilter").val();
    let shown = allTasks;

    if (filter !== "All") {
        // keep only tasks whose status matches the dropdown
        shown = allTasks.filter(function(task) {
            return task.status === filter;
        });
    }

    $(".list").empty();
    shown.forEach(displayTask);
}

function displayTask(task) {
  // Template literal using backticks
  let html = `
    <div class="task" id="${task.id}" style="border-color:${task.color}">
      <div class="info">
        <h4>${task.title}</h4>
        <p>${task.desc}</p>
      </div>
      <label class="status">${task.status}</label>
      <label class="priority">Priority: ${task.priority || "—"}</label>
      <div class="date-budget">
        <label>Due: ${task.date}</label>
        <label>Budget: $${task.budget}</label>
      </div>
      <button class="btn-delete">Delete</button>
    </div>`;

  // Add to DOM
  $(".list").append(html);
}

function deleteTask(id) {
  // ask first - if the user clicks "Cancel", stop here
  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }
  console.log("Deleting task with ID:", id);
  $.ajax(
    {
      type: "delete", //HTTP verb Delete
      url: serverName + "/" + id,
      success: function() {
          $("#" + id).fadeOut(500, function() {
              loadTask();
          });
      },
      error: function(fail) {
          console.log(fail);
      }
    }
  );
}

    function init(){
        console.log("hello");
        // hook the  save button up
        $("#btnSave").on("click", saveTask);
        // hook the delete buttons up (they're created later, so listen on .list)
        $(".list").on("click", ".btn-delete", function() {
            const id = $(this).closest(".task").attr("id");
            deleteTask(id);
        });
        // redraw the list when the filter dropdown changes
        $("#selFilter").on("change", renderList);
        // load data from the server
        loadTask()
    }
    // force the HTML and CSS to be loaded before running the init function
    window.onload = init;









