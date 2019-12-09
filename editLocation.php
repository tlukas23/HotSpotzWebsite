<?php
    $inData = getRequestInfo();
    $Id = $inData["Id"];
    $Distance = $inData["Distance"];
    $Name = $inData["Name"];
    $Address = $inData["Address"];
    $Phone = $inData["Phone"];
    
    $conn = new mysqli("localhost", "guest", "guest123", "HotSpotz");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
    }
    
    $query = "UPDATE `Locations` SET `Name`= '$Name',`Address` = '$Address', `Phone`= '$Phone',`Distance`= '$Distance' WHERE Id=$Id";
    $conn->query($query);
    
    $conn->close();
    // Decode json file received
    function getRequestInfo($Name, $Address, $Phone, $Distance, $Id)
    {
        return json_decode(file_get_contents('php://input'), true);
    }
    
    // Send off json
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
    
    // Return error in json file
    function returnWithError($err)
    {
        $retVal = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retVal);
    }
    
    // Format return information in json
    function returnWithInfo($Name, $Address, $Distance, $Phone, $Id)
    {
        $retVal = '{"Name":[' . $Name . '], "Address":[' . $Address . '], "Distance":[' . $Distance . '], "Phone":[' . $Phone . '], "Id":[' . $Id . '],"error":""}';
        sendResultInfoAsJson($retVal);
    }
?>