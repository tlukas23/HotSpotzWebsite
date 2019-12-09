var urlBase = 'http://ec2-54-164-237-212.compute-1.amazonaws.com';

var userId = 0;
var username = "";
var password = "";
var temp = 0;
var globalverified = "";
var globalid = "";

var editname = "";
var editaddress = "";
var editphone = "";
var editdistance = "";

function doLogin()
{
	userId = 0;
	username = "";
	password = "";

	// Take in the username and password from the user
	username = document.getElementById("loginUsername").value;
	password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"username" : "' + username + '", "password" : "' + password + '"}';
	var url = urlBase + '/login.php';

	// send the json
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=utf8");
	
	try
	{
		// send the json information to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				userId = jsonObject.id;

				// if return 0, login was unsuccessful
				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = jsonObject.error;
					return;
				}

				// assign username & password to global vars
				username = jsonObject.username;
				password = jsonObject.password;

				document.getElementById("loginUsername").value = "";
				document.getElementById("loginPassword").value = "";

				hideOrShow("loggedInDiv", true);
				hideOrShow("Dashboard", true);
				hideOrShow("loginDiv", false);
			}
		};
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";

	hideOrShow("Locations", false);
	hideOrShow("Dashboard", false);
	hideOrShow("loggedInDiv", false);
	hideOrShow("Back", false);
	hideOrShow("loginDiv", true);
}

function hideOrShow( elementId, showState )
{
	var vis = "visible";
	var dis = "block";
	if( !showState )
	{
		vis = "hidden";
		dis = "none";
	}

	document.getElementById( elementId ).style.visibility = vis;
	document.getElementById( elementId ).style.display = dis;
}

function getLocation(verified)
{
	// In order to grab the correct contacts we need to send the database the userid so we only
	// receive contacts associated with that user
	var url = urlBase + '/locations.php';

	globalverified = verified;

	var jsonPayload = '{"Verified" : "' + verified + '"}';

    var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	hideOrShow("Dashboard", false);
	hideOrShow("Locations", true);
	
	try
	{
		xhr.send(jsonPayload);
		
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				temp = 0;

				// clear the table
				for (var i = document.getElementById("conTable").rows.length; i > 1;i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				if(globalverified == 1)
				{
					while (temp < jsonObject.Address.length)
					{
						var table = document.getElementById('conTable');

						// add a new row to the bottom of the table, then fill with information
						var row = table.insertRow(-1);

						var cell1 =row.insertCell(0);
						var cell2 =row.insertCell(1);
						var cell3 =row.insertCell(2);
						var cell4 =row.insertCell(3);
						var cell5 =row.insertCell(4);
						var cell6 =row.insertCell(5);

						cell1.innerHTML = jsonObject.Name[temp];
						cell2.innerHTML = jsonObject.Address[temp];
						cell3.innerHTML = jsonObject.Phone[temp];
						cell4.innerHTML = jsonObject.Review[temp];
						cell5.innerHTML = jsonObject.Distance[temp];
						cell6.innerHTML = '<td><button type="button" class="button" id="editbut" onclick="editLocation(' + (jsonObject.Id[temp]) + ');">Edit</button></td>'+'<td><button type="button" class="button" id ="deletebut" onclick="deleteLocation(' + (jsonObject.Id[temp]) + ');">Delete</button></td>';
						temp++;
					}
				}
				else
				{
					while (temp < jsonObject.Address.length)
					{
						var table = document.getElementById('conTable');

						// add a new row to the bottom of the table, then fill with information
						var row = table.insertRow(-1);

						var cell1 =row.insertCell(0);
						var cell2 =row.insertCell(1);
						var cell3 =row.insertCell(2);
						var cell4 =row.insertCell(3);
						var cell5 =row.insertCell(4);
						var cell6 =row.insertCell(5);

						cell1.innerHTML = jsonObject.Name[temp];
						cell2.innerHTML = jsonObject.Address[temp];
						cell3.innerHTML = jsonObject.Phone[temp];
						cell4.innerHTML = jsonObject.Review[temp];
						cell5.innerHTML = jsonObject.Distance[temp];
						cell6.innerHTML = '<td><button type="button" class="button" id="verifybut" onclick="verifyLocation(' + (jsonObject.Id[temp]) + ');">Verify</button></td>'+'<td><button type="button" class="button" id ="deletebut" onclick="deleteLocation(' + (jsonObject.Id[temp]) + ');">Delete</button></td>';
						temp++;
					}
				}

			}
		};
	}
	catch(err)
	{
		document.getElementById("locationview").innerHTML = err.msg;
	}
	hideOrShow("Back", true);
}

function verifyLocation(id)
{
	// Only need the contact's id in order to delete them from the database
	var jsonPayload = '{"Id" : "' + id + '"}';
	var url = urlBase + '/verify.php';
 
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
	try
	{
		// send the json info to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// clear the table so it can be reprinted
				for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				getLocation(globalverified);
			}
		};
	}
	catch(err)
	{
		 document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function deleteLocation(id)
{
	// Only need the contact's id in order to delete them from the database
	var jsonPayload = '{"Id" : "' + id + '"}';
	var url = urlBase + '/deleteLocation.php';
 
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
	try
	{
		// send the json info to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// clear the table so it can be reprinted
				for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				getLocation(globalverified);
			}
		};
	}
	catch(err)
	{
		 document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function editLocation(id)
{
	globalid = id;
	hideOrShow("editDiv", true);
	editAutofill(id);
}

function closeEdit()
{
	hideOrShow("editDiv", false);
}

function editAutofill(id)
{
	var jsonPayload = '{"Id" : "' + id + '"}';
	var url = urlBase + '/editLocationHelper.php';
	

	// Create and open a connection to the server
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// Send the json info to php
		xhr.send(jsonPayload);
		
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				document.getElementById("name").placeholder = jsonObject.Name;
				document.getElementById("address").placeholder = jsonObject.Address;
				document.getElementById("distance").placeholder = jsonObject.Distance;
				document.getElementById("phone").placeholder = jsonObject.Phone;

				editname = jsonObject.Name;
				editaddress = jsonObject.Address;
				editdistance = jsonObject.Distance;
				editphone = jsonObject.Phone;
				
			}
		};
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}

}

function doEdit()
{
	// Get the contact info from the HTML	
	var name = document.getElementById("name").value;
	var address = document.getElementById("address").value;
	var distance = document.getElementById("distance").value;
	var phone = document.getElementById("phone").value;

	if(name == "")
	{
		name = editname;
	}
	if(address == "")
	{
		address = editaddress;
	}
	if(distance == "")
	{
		distance = editdistance;
	}
	if(phone == "")
	{
		phone = editphone;
	}

	var jsonPayload = '{"Name" : "' + name + '", "Address" : "' + address + '", "Phone" : "' + phone + '", "Distance" : "' + distance + '", "Id" : "' + globalid + '"}';
	var url = urlBase + '/editLocation.php';
	
	// Create and open a connection to the server
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try
	{
		// Send the json info to php
		xhr.send(jsonPayload);
		
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// clear the table so it can reprint
				for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				closeEdit();
				getLocation(globalverified);
			}
		};
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}

function searchContact()
{
	// Get info from the html
	var search = document.getElementById("searchText").value;

	document.getElementById("contactAddResult").innerHTML = "";
	document.getElementById("contactSearchResult").innerHTML = "";

	var jsonPayload = '{"search" : "' + search + '", "id" : "' + userId + '"}';
	var url = urlBase + '/searchContacts.php';
	
	var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		// Send the json info to php
		xhr.send(jsonPayload);

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);

				temp = 0;
				
				// clear the table
				for (var i = document.getElementById("conTable").rows.length; i > 1; i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				while (temp < jsonObject.phone.length)
				{
					var table = document.getElementById('conTable');

					// insert row at the bottom of the table and then fill with the found contact information
					var row = table.insertRow(-1);

					var cell1 = row.insertCell(0);
					var cell2 = row.insertCell(1);
					var cell3 = row.insertCell(2);
					var cell4 = row.insertCell(3);
					var cell5 = row.insertCell(4);
					var cell6 = row.insertCell(5);


					cell1.innerHTML = jsonObject.firstname[temp];
					cell2.innerHTML = jsonObject.lastname[temp];
					cell3.innerHTML = jsonObject.phone[temp];
					cell4.innerHTML = jsonObject.email[temp];
					cell5.innerHTML = '<td><button type="button" class="button" onclick="editContact(' + (jsonObject.id[temp]) + ');">Edit</button></td>';
					cell6.innerHTML = '<td><button type="button" class="button" id ="deletebut" onclick="deleteContact(' + (jsonObject.id[temp]) + ');">Delete</button></td>';

					temp++;
				}
			}
		};
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function getDashboard()
{
	hideOrShow("Locations", false);
	hideOrShow("Back", false);
	hideOrShow("Dashboard", true);
}
function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
  
	  // Check if the XMLHttpRequest object has a "withCredentials" property.
	  // "withCredentials" only exists on XMLHTTPRequest2 objects.
	  xhr.open(method, url, true);
  
	} else if (typeof XDomainRequest != "undefined") {
  
	  // Otherwise, check if XDomainRequest.
	  // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
	  xhr = new XDomainRequest();
	  xhr.open(method, url);
  
	} else {
  
	  // Otherwise, CORS is not supported by the browser.
	  xhr = null;
  
	}
	return xhr;
  }

function sortLocation(value)
{
	if(value == 0)
	{
		getLocation(globalverified);
	}
	else if(value != 0)
	{
		// In order to grab the correct contacts we need to send the database the userid so we only
	// receive contacts associated with that user
	var url = urlBase + '/sort.php';

	var jsonPayload = '{"Category" : "' + value + '", "Verified" : "' + globalverified + '"}';

    var xhr = createCORSRequest('GET', url);
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	hideOrShow("Dashboard", false);
	hideOrShow("Locations", true);
	
	try
	{
		xhr.send(jsonPayload);
		
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse(xhr.responseText);
				temp = 0;

				// clear the table
				for (var i = document.getElementById("conTable").rows.length; i > 1;i--)
				{
					document.getElementById("conTable").deleteRow(i -1);
				}

				if(globalverified == 1)
				{
					while (temp < jsonObject.Address.length)
					{
						var table = document.getElementById('conTable');

						// add a new row to the bottom of the table, then fill with information
						var row = table.insertRow(-1);

						var cell1 =row.insertCell(0);
						var cell2 =row.insertCell(1);
						var cell3 =row.insertCell(2);
						var cell4 =row.insertCell(3);
						var cell5 =row.insertCell(4);
						var cell6 =row.insertCell(5);

						cell1.innerHTML = jsonObject.Name[temp];
						cell2.innerHTML = jsonObject.Address[temp];
						cell3.innerHTML = jsonObject.Phone[temp];
						cell4.innerHTML = jsonObject.Review[temp];
						cell5.innerHTML = jsonObject.Distance[temp];
						cell6.innerHTML = '<td><button type="button" class="button" id="editbut" onclick="editLocation(' + (jsonObject.Id[temp]) + ');">Edit</button></td>'+'<td><button type="button" class="button" id ="deletebut" onclick="deleteLocation(' + (jsonObject.Id[temp]) + ');">Delete</button></td>';
						temp++;
					}
				}
				else
				{
					while (temp < jsonObject.Address.length)
					{
						var table = document.getElementById('conTable');

						// add a new row to the bottom of the table, then fill with information
						var row = table.insertRow(-1);

						var cell1 =row.insertCell(0);
						var cell2 =row.insertCell(1);
						var cell3 =row.insertCell(2);
						var cell4 =row.insertCell(3);
						var cell5 =row.insertCell(4);
						var cell6 =row.insertCell(5);

						cell1.innerHTML = jsonObject.Name[temp];
						cell2.innerHTML = jsonObject.Address[temp];
						cell3.innerHTML = jsonObject.Phone[temp];
						cell4.innerHTML = jsonObject.Review[temp];
						cell5.innerHTML = jsonObject.Distance[temp];
						cell6.innerHTML = '<td><button type="button" class="button" id="verifybut" onclick="verifyLocation(' + (jsonObject.Id[temp]) + ');">Verify</button></td>'+'<td><button type="button" class="button" id ="deletebut" onclick="deleteLocation(' + (jsonObject.Id[temp]) + ');">Delete</button></td>';
						temp++;
					}
				}

			}
		};
	}
	catch(err)
	{
		document.getElementById("locationview").innerHTML = err.msg;
	}

	hideOrShow("Back", true);
	}
	
}
