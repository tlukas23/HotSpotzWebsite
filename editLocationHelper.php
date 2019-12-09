<?php
    $inData = getRequestInfo();

    $id = $inData["Id"];

    $conn = new mysqli("localhost", "guest", "guest123", "HotSpotz");
    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }


    $sql = $conn->prepare("SELECT * FROM Locations WHERE Id=?");
    $sql->bind_param("s", $id);
    //Execute the query
    $sql->execute();
    $result = $sql->get_result();
    
    // If no rows exist with entered username, account does not exist
    if($result->num_rows > 0)
    {
       // Store row result from query into $row variable
       $row = $result->fetch_assoc();
        $Name = $row["Name"];
        $Address = $row["Address"];
        $Distance = $row["Distance"];
        $Phone = $row["Phone"];
        
        returnWithInfo($Name, $Address, $Distance, $Phone);
        $conn->close();
    }
    else
    {
        $conn->close();
        returnWithError("Problem with the contact id");
    }
    // Decode json file received
    function getRequestInfo()
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
      $retVal = '{"Id":0,"error":"' . $err . '"}';
      sendResultInfoAsJson($retVal);
    }
    
    // Format return into json
    function returnWithInfo($Name, $Address, $Distance, $Phone)
    {
      $retVal = '{"Name": "' . $Name . '" ,"Address": "' . $Address . '", "Distance": "' . $Distance . '", "Phone": "' . $Phone . '","error":""}';
      sendResultInfoAsJson($retVal);
    }
?>