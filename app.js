$("#login").show();
$("#app").hide();
//$("#tabs").tabs();
var alphabet = "abcdefghijklmnopqrstuvwxyz";
for (var k = 0; k < alphabet.length; ++k) {
    c = alphabet[k];
    cc = c.toUpperCase() + c;
    $("#tabs ul").append('<li><a href="#' + c +'">'+ cc +'</a></li>');
    $("#tabs").append('<div id="' + c + '"><p>toca ala -- ' + cc + '</p></div>');
}
$( "#tabs" ).tabs();

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

datastoreManager.listDatastores(function(error, info){
    if (error) {
        alert('Error no list: ' + error);
    } else {
        for (x in info) {
            console.log(info[x]);
        }
    }
});
datastoreManager.openDefaultDatastore(function (error, datastore) {
    if (error) {
        alert('Error opening default datastore: ' + error);
    }
    datastore.setTitle('RubryDb');
    var title = datastore.getTitle();
    console.log("el nom del DB" + title);
   // Let the user read all tasks by printing them to the screen
	var taskTable = datastore.getTable('names');
	var results = taskTable.query({completed: false});

	for (var k=0; k<results.length;k++ ) {
        var words = results[k].get("taskname");
        var traduz = results[k].get("tradname");
        var risultati = results[k].getId();
        var iddio = words[0];
        console.log(iddio + "---" + words);
        $("#" +  iddio).append("<p id='paragraph'>"+words +' = ' + traduz +"</p>");
    }

  // Let users add tasks
	$("#add").on("click", function() {
        var newTask = $("#newTask").val();
        var newTrad = $("#newTrad").val();
        console.log("--newTrad--" + newTrad);
        //var newTask = voc + " = " + tra;
    	taskTable.insert({
        	taskname: newTask,
            tradname: newTrad,
        	completed: false,
        	created: new Date()
     	});
        $("#newTask").val("");
        $("#newTrad").val("");
	});

    $("#delete").on("click", function() {
        toDelete = $("#deleteble").val();
        console.log("La Parola = " + toDelete);
        //$("#res").val(toDelete);
        for (var ind=0; ind<results.length;ind++ ) {
            var tname = results[ind].get("taskname");

            if (tname == toDelete) {
                console.log("L'INDICE" + ind );
                //console.log("elPesa" + results[ind].getSize());
                rec = results[ind];
                var iddio = tname[0];
                results.splice(ind,1);
                rec.deleteRecord();

                $('#' + iddio + ' p:contains("' + tname +'")').remove();
                break;
            }
        }
        $("#deleteble").val("");
    });

  // As new tasks are added automatically update the task list
	datastore.recordsChanged.addListener(function (event) {
    	var modrecords = event.affectedRecordsForTable('names');
    	for (var k=0; k<modrecords.length;k++ ) {
            modrec = modrecords[k];
            if (!modrec.isDeleted()) {
                var words = modrec.get("taskname");
                var traduz = modrec.get("tradname");
                var iddio = words[0];
                console.log(iddio + "---" + words);
                results.push(modrec);

                $("#" +  iddio).append("<p id='paragraph'>"+words +' = ' + traduz + "</p>");
            }
    	}

        //lista delle tabelle
        var listu = datastore.listTableIds();
        for (y in listu) {
            console.log("Listu" + listu[y]);
        }
    });
});
// No list visualization
/*ListDatastores(function (error, info) {
for (x in info)*/


