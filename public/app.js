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
          "</p>"
      );
    }
  });

  $("#notes").empty(); // Empty the notes section after submit
  // Returns the articles as a json
  $.getJSON("/articles/..", function(data) {
    for (var i = 0; i < data.length; i++) {
      // Displays the information on the page
      $("#articles").append(
        "<p data-id='" +
          data[i].title +
          "<br />" +
          data[i].body +
          "</p>"
      );
    }
  });
});

$(document).on("click", "p", function() {
  $("#notes").empty(); // Empty the notes from the note section
  var thisId = $(this).attr("data-id"); // Save the id from the p tag

  // ARTICLE ajax call
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    console.log(data);
    // TITLE
    $("#notes").append("<h2>" + data.title + "</h2>");
    // Title input
    $("#notes").append("<input id='titleinput' name='title' >");
    // TEXT AREA
    $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    // SUBMIT BUTTON
    $("#notes").append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
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
    $("#notes").empty(); // Empty the notes section after submit
  });

  // Clears the values for new entries
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
