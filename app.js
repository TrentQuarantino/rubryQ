$("#login").show();
$("#app").hide();
$("#tabs").tabs();

//Authentication with Dropbox
var client = new Dropbox.Client({key:"iz1dsortzogoweu"});
client.authenticate({interactive:false}, function(error){
	if(error) {
		alert('Authentication error:' + error);
	}
});
if (client.isAuthenticated()) {
	$("#login").hide();
	$("#app").show();
}

// Bind authenticate method to your login button and listen for click on button

$("#login").on("click", client.authenticate());



var datastoreManager = client.getDatastoreManager();
datastoreManager.openDefaultDatastore(function (error, datastore) {
    if (error) {
        alert('Error opening default datastore: ' + error);
    }

   // Let the user read all tasks by printing them to the screen
	var taskTable = datastore.getTable('names');
	var results = taskTable.query({completed: false});

	for (var k=0; k<results.length;k++ ) {
        //$("#todos").append( "<li>"+results[k].get("taskname") + "</li>");

        var words = results[k].get("taskname");
        var iddio = words[0];
        console.log(iddio + "---" + words);
        $("#" +  iddio).append("<p id='paragraph'>"+words + "</p>");
  }
	$("li").addClass("list-group-item");


  // Let users add tasks
	$("#add").on("click", function() {
    	taskTable.insert({
        	taskname: $("#newTask").val(),
        	completed: false,
        	created: new Date()
     	});
  });

  // As new tasks are added automatically update the task list
	datastore.recordsChanged.addListener(function (event) {
    	var records = event.affectedRecordsForTable('names');
    	for (var k=0; k<records.length;k++ ) {
        	//$("#todos").append( "<li>"+records[k].get("taskname") + "</li>");
          var words = records[k].get("taskname");
          var iddio = words[0];
          console.log(iddio + "---" + words);
          $("#" +  iddio).append("<p id='paragraph'>"+words + "</p>");
    	}
    	$("li").addClass("list-group-item");
	});
});
// No list visualization