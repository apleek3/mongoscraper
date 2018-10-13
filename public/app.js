$(document).ready(function() {
  console.log("READY!"); //Document ready check
  $("#articles").empty(); //Empty articles
  // $.ajax({
  //   //initial scrape
  //   method: "GET",
  //   url: "/scrape"
  // }).done(function(data) {
  //   console.log(data);
  // });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// SCRAPE BUTTON //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  $("#newScrape").on("click", function() {
    $.ajax({
      //new scrape call to refresh articles
      method: "GET",
      url: "/scrape"
    }).done(function(data) {
      console.log(data);
    });

    console.log("SCRAPE!");
    $("#articles").empty();
    // Returns the articles as a json
    $("#articles").append(
      //Appends instructions for the user so they will know what to do with each article
      "<h1 style='font-weight:1000' class='text-center'>Click on the title of any article to add a note to it.</h1>"
    );

    $.getJSON("/articles", function(data) {
      for (var i = 0; i < data.length; i++) {
        // Displays the information on the page
        $("#articles").append(
          "<hr>" + //Starting line break to separate Articles
          "<div class='container'>" + //Container to hold article, buttons, and links
          //Adds a button with the title that can be used as an easy signal for ready to interact with it and add a note
          "<button style='font-weight:1000; font-size:20px' class='titleButton badge badge-light' data-id='" +
          data[i]._id +
          "'>" +
          data[i].title +
          "</button>" +
          // After the button, appends the summary description of the article
          "<p>" +
          data[i].summary +
          // Posts the link of the article directly after
          "<a href='" +
          data[i].link +
          "'>Link to Article</a></p>" +
          //  Adds a delete button after the summary
          "<button id='delete-article' class='btn btn-danger' data-id='" +
          data[i]._id +
          "'>Delete</button>" +
          "</div>" + //ends the Div
            "<hr>" // Ending line break for each post
        );
      }
    });
  });
  ////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// NOTE BUTTON ////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  $(document).on("click", ".titleButton", function() {
    $("#notes").empty(); // Empty the notes from the note section
    $("#notesFooter").empty(); // Empty the modal footer
    $("#articleTitle").empty(); // Empty the modal title
    $("#modalButton").click(); //activate the modal
    var thisId = $(this).attr("data-id"); // Save the id from the p tag
    console.log(thisId);

    // ARTICLE ajax call
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    }).then(function(data) {
      console.log(data);
      // TITLE
      $("#articleTitle").append(
        "<h4> The Article you have clicked on is: <h1> '" +
          data.title +
          "' </h1></h4><p>To close this note and cancel click the 'x' </p>"
      );
      // Title input
      $("#notes").append(
        "<div class='col-10'>This note's current Title:<input style='width:90%; border-width:3px' id='titleinput' name='title' ></div>"
      );
      // TEXT AREA
      $("#notes").append(
        "<div class='col-10'>The last note for this article is:<textarea style='width:90%; border-width:2px' id='bodyinput' name='body'></textarea></div>"
      );
      // SAVE BUTTON & SUBMIT BUTTON
      $("#notesFooter").append(
        "<button data-id='" +
          data._id +
          "' id='savenote' class='btn btn-primary'>Submit</button>",
        "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Save Article & Close</button>"
      );

      if (data.note) {
        console.log("note added to Div!")
        // Modifies the title based on the title input
        $("#titleinput").val(data.note.title);
        // Modifies the body based on text input
        $("#bodyinput").val(data.note.body);
        $("#notesDiv").append(
          "<div style='opacity:0.8' class='row container-fluid bg-light'>" + //Container to hold article, buttons, and links
            //Adds a button with the title that can be used as an easy signal for ready to interact with it and add a note
            "<button style='font-weight:1000; font-size:20px' class='titleButton badge badge-light' data-id='" +
            data._id +
            "'>" +
            data.title +
            "</button>" +
            "<div><button id='delete-article' class='btn btn-danger' data-id='" +
            data._id +
            "'>Delete</button></div>" +
            // After the button, appends the summary description of the article
            "<p>" +
            data.summary +
            // Posts the link of the article directly after
            "<a href='" +
            data.link +
            "'>Link to Article</a><br></p><h6 style='font-weight:1000'>NOTE TITLE: " +
            //  Adds a delete button after the summary
            data.note.title +
            "   <br>NOTE BODY: " +
            data.note.body +
            "</h6><br><br>" +
            "</div>" //ends the Div
        );
      }
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// SAVE BUTTON ////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // SAVE BUTTON for the notes
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id"); // Grabs the id associated with the article from the submit button
    console.log(thisId);

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
    $("#notes").append(
      "<div class='col-9-sm'><h4> Thank you. Your note has been saved! </h4></div>"
    );
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// DELETE BUTTON //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  $(document).on("click", "#delete-article", function() {
    console.log("DELETE!");
    var thisId = $(this).attr("data-id"); // Save the id from the p tag
    console.log(thisId);
    //Send the DELETE request.
    $.ajax({
      method: "DELETE",
      url: "/delete/" + thisId
    }).then(function() {
      console.log("deleted article", thisId);
      // Reload the page to get the updated list
      //location.reload();
      // window.location = "/saved";
      $('#articles').load(document.URL +  ' #articles')
    });
  });

}); // DOCUMENT READY

//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

