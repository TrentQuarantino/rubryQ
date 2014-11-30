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
    //var toDelete = "test";
    //var toDelete ;


	for (var k=0; k<results.length;k++ ) {
        //$("#todos").append( "<li>"+results[k].get("taskname") + "</li>");
        //console.log("NEL FOR" + toDelete);
        var words = results[k].get("taskname");
        var risultati = results[k].getId();
        var iddio = words[0];
        console.log(iddio + "---" + words);
        //console.log(risultati );
        /*if(words == "asnu") {
            console.log("L'INDICE" + k);

            var a = k;
            console.log("var a " + a);
            //var b = results[a].getSize();
            //console.log("EL peso = " + b);
            results[a].deleteRecord();
        }*/

        $("#" +  iddio).append("<p id='paragraph'>"+words +"</p>");
    }
	    /*$("li").addClass("list-group-item");
        console.log("UN RISULTATO" + results[4].get("taskname"));*/

  // Let users add tasks
	$("#add").on("click", function() {
    	taskTable.insert({
        	taskname: $("#newTask").val(),
        	completed: false,
        	created: new Date()
     	});
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
                //var iddio = rec[0];
                results.splice(ind,1);
                rec.deleteRecord();

                $('p:contains("' + tname +'")').remove();
                break;
            }
        }

    });


    //console.log("FUORI" + toDelete);

  // As new tasks are added automatically update the task list
	datastore.recordsChanged.addListener(function (event) {
    	var records = event.affectedRecordsForTable('names');
    	for (var k=0; k<records.length;k++ ) {
        	//$("#todos").append( "<li>"+records[k].get("taskname") + "</li>");
            modrec = records[k];
            if (!modrec.isDeleted()) {
                var words = records[k].get("taskname");
                var iddio = words[0];
                console.log(iddio + "---" + words);

                $("#" +  iddio).append("<p id='paragraph'>"+words + "</p>");
            }


    	}
    	//$("li").addClass("list-group-item");

        var listu = datastore.listTableIds();
        for (y in listu) {
            console.log(listu[y]);
        }
    });
});
// No list visualization
/*ListDatastores(function (error, info) {
for (x in info)*/


