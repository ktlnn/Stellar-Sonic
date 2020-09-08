$(document).ready(() => {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(data => {
    $(".member-name").text(data.email);
    console.log("1st get at members.js");
  });
});

// When the page loads, grab and display all of the current  posts
$.get("/api/posts", function (data) {
  if (data.length !== 0) {
    for (var i = 0; i < data.length; i++) {
      var row = $("<div>");
      row.addClass("chirp");
      row.append("<p>" + data[i].author + " posted: " + data[i].body + "  " + moment(data[i].created_at).format("h:mma on dddd") + "</p>");
       $("#post-area").prepend(row);
    }
  }
});

// When user posts (clicks addBtn)
$("#post-submit").on("click", function (event) {
  event.preventDefault();
  // Make a newPost object
  var newPost = {
    author: $("#author").val().trim(),
    body: $("#post-box").val().trim()

  };
  console.log(newPost);
  // Send an AJAX POST-request with jQuery
  $.post("/api/posts", newPost)
    // On success, run the following code
    .then(function () {
      var row = $("<div>");
      row.addClass("post");
      row.append("<p>" + newPost.author + " posted: " + newPost.body + "  " + moment(newPost.created_at).format("h:mma on dddd") + "</p>");
      // row.append("<p>" + newPost.body + "</p>");
      // row.append("<p>At " + moment(newPost.created_at).format("h:mma on dddd") + "</p>");
      $("#post-area").prepend(row);

    });

  // Empty each input box by replacing the value with an empty string
  $("#author").val("");
  $("#post-box").val("");
});



//==================shazam API call - 
var searchString = "a kiss the driver era";
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://shazam.p.rapidapi.com/auto-complete?locale=en-US&term=" + searchString,
  "method": "GET",
  "headers": {
    "x-rapidapi-host": "shazam.p.rapidapi.com",
    "x-rapidapi-key": "847928476cmsheaaf2b6abd565d9p1758d2jsn129d9533941b"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
});

// all music api get==============================

$(".btn-allMusic").on("click", function (event) {
  event.preventDefault();
  $.get("/api/mainlists", function (data) {
    if (data.length !== 0) {
      for (var i = 0; i < data.length; i++) {
        var row = $("<div>");
        row.addClass("mainlists");
        row.append("<p>" + data[i].artist + " release: " + data[i].release + "genre: " + data[i].genre + "title:" + data[i].title + " year" + data[i].year + "</p>");
        $("#main-music-area").prepend(row);
      }
    }
  });
});

    // ====================  not used presently ======================can be re used ========================
    $(document).ready(function () {
      // Getting a reference to the input field where user adds a new todo
      var $newItemInput = $("input.new-item");
      // Our new todos will go inside the todoContainer
      var $todoContainer = $(".todo-container");
      // Adding event listeners for deleting, editing, and adding todos
      $(document).on("click", "button.delete", deleteTodo);
      $(document).on("click", "button.complete", toggleComplete);
      $(document).on("click", ".todo-item", editTodo);
      $(document).on("keyup", ".todo-item", finishEdit);
      $(document).on("blur", ".todo-item", cancelEdit);
      $(document).on("submit", "#todo-form", insertSong); - //changed name
    
        // Our initial todos array
        // var todos = [];
    
        // Getting todos from database when page loads
        // getTodos();
    
        // This function resets the todos displayed with new todos from the database
        function initializeRows() {
          $todoContainer.empty();
          var rowsToAdd = [];
          for (var i = 0; i < todos.length; i++) {
            rowsToAdd.push(createNewRow(todos[i]));
          }
          $todoContainer.prepend(rowsToAdd);
        }
    
      // This function grabs todos from the database and updates the view
      function getTodos() {
        $.get("/api/todos", function (data) {
          todos = data;
          initializeRows();
        });
      }
    
      // This function deletes a todo when the user clicks the delete button
      function deleteTodo(event) {
        event.stopPropagation();
        var id = $(this).data("id");
        $.ajax({
          method: "DELETE",
          url: "/api/todos/" + id
        }).then(getTodos);
      }
    
      // This function handles showing the input box for a user to edit a todo
      function editTodo() {
        var currentTodo = $(this).data("todo");
        $(this).children().hide();
        $(this).children("input.edit").val(currentTodo.text);
        $(this).children("input.edit").show();
        $(this).children("input.edit").focus();
      }
    
      // Toggles complete status
      function toggleComplete(event) {
        event.stopPropagation();
        var todo = $(this).parent().data("todo");
        todo.complete = !todo.complete;
        updateTodo(todo);
      }
    
      // This function starts updating a todo in the database if a user hits the "Enter Key"
      // While in edit mode
      function finishEdit(event) {
        var updatedTodo = $(this).data("todo");
        if (event.which === 13) {
          updatedTodo.text = $(this).children("input").val().trim();
          $(this).blur();
          updateTodo(updatedTodo);
        }
      }
    
      // This function updates a todo in our database
      function updateTodo(todo) {
        $.ajax({
          method: "PUT",
          url: "/api/todos",
          data: todo
        }).then(getTodos);
      }
    
      // This function is called whenever a todo item is in edit mode and loses focus
      // This cancels any edits being made
      function cancelEdit() {
        var currentTodo = $(this).data("todo");
        if (currentTodo) {
          $(this).children().hide();
          $(this).children("input.edit").val(currentTodo.text);
          $(this).children("span").show();
          $(this).children("button").show();
        }
      }
    
      // This function constructs a todo-item row
      function createNewRow(todo) {
        var $newInputRow = $(
          [
            "<li class='list-group-item todo-item'>",
            "<span>",
            todo.text,
            "</span>",
            "<input type='text' class='edit' style='display: none;'>",
            "<button class='delete btn btn-danger'>x</button>",
            "<button class='complete btn btn-primary'>✓</button>",
            "</li>"
          ].join("")
        );
    
        $newInputRow.find("button.delete").data("id", todo.id);
        $newInputRow.find("input.edit").css("display", "none");
        $newInputRow.data("todo", todo);
        if (todo.complete) {
          $newInputRow.find("span").css("text-decoration", "line-through");
        }
        return $newInputRow;
      }
    
      // This function inserts a new todo into our database and then updates the view
      function insertSong(event) {
        event.preventDefault();
        var Song = {
          name: $newSongInput.val().trim(),  // needs a form in members HTML - actual variables
          artist: $newSongInputArtist.val().trim(),
          genre: $newSongInputGenre.val().trim(),
          year: $newSongInputYear.val().trim(),
        };
    
        $.post("/api/mMusics", song)
          .done((response) => {
            if (response.hasOwnProperty('error')) {
              alert(response.error);
            }
            else {
              getMmusics();   //need function remake
            }
          })
    
        $newItemInput.val("");
      }
    });
    
    //==============================================