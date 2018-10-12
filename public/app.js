// // Returns the articles as a json
// $.getJSON("/articles", function(data) {
//   for (var i = 0; i < data.length; i++) {
//     // Displays the information on the page
//     $("#articles").append(
//       "<p data-id='" +
//         data[i]._id +
//         "'>" +
//         data[i].title +
//         "<br />" +
//         data[i].link +
//         "</p>"
//     );
//   }
// });

$(document).ready(function() {
  console.log("READY!");
  $("#articles").empty(); // Empty the notes section after submit
  // Returns the articles as a json
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      // Displays the information on the page
      $("#articles").append(
        "<p data-id='" +
          data[i]._id +
          "'>" +
          data[i].title +
          "<br />" +
          data[i].link +
          "<br />" +
          data[i].summary +
          "</p>"
      );
    }
  });

  // $("#notes").empty(); // Empty the notes section after submit
  // Returns the articles as a json
  // $.getJSON("/articles/..", function(data) {
  //   for (var i = 0; i < data.length; i++) {
  //     // Displays the information on the page
  //     $("#articles").append(
  //       "<p data-id='" +
  //         data[i].title +
  //         "<br />" +
  //         data[i].body +
  //         "</p>"
  //     );
  //   }
  // });
});

$(document).on("click", "p", function() {
  $("#notes").empty(); // Empty the notes from the note section
  $("#notesFooter").empty(); // Empty the modal footer
  $("#articleTitle").empty(); // Empty the modal title
  $("#modalButton").click(); //activate the modal
  var thisId = $(this).attr("data-id"); // Save the id from the p tag

  // ARTICLE ajax call
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    // TITLE
    $("#articleTitle").append("<h4> The Article you have clicked on is: <h1> '" + data.title + "' </h1></h4>");
    // Title input
    $("#notes").append("<div class='col-10'>This note's current Title:<input style='width:90%; border-width:3px' id='titleinput' name='title' ></div>");
    // TEXT AREA
    $("#notes").append("<div class='col-10'>The last note for this article is:<textarea style='width:90%; border-width:2px' id='bodyinput' name='body'></textarea></div>");
    // SUBMIT BUTTON
    $("#notesFooter").append(
      "<button data-id='" + data._id + "' id='savenote' class='btn btn-primary'>Save Note</button>",
      "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"
    );

    if (data.note) {
      // Modifies the title based on the title input
      $("#titleinput").val(data.note.title);
      // Modifies the body based on text input
      $("#bodyinput").val(data.note.body);
    }
  });
});

// SAVE BUTTON for the notes
$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id"); // Grabs the id associated with the article from the submit button

  // POST request to change the notes, using the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // TITLE INPUT
      title: $("#titleinput").val(),
      // TEXT INPUT
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data); // For confirmation
  });

  // Clears the values for new entries
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $("#notes").empty();
  $("#notes").append("<div class='col-9-sm'><h4> Thank you. Your note has been saved! </h4></div>")
  
});
