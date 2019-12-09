<?php

    $inData = getRequestInfo();
    $verified = $inData["Verified"];
    $category = $inData["Category"];

    $conn = new mysqli("localhost", "guest", "guest123", "HotSpotz");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    $Name = "";
    $Address = "";
    $Phone = "";
    $Review = "";
    $Distance = "";
    $Category = "";
    $Id = "";

    $searchCount = 0;
    if($verified == 1)
    {
        $sql = "SELECT * FROM Locations WHERE Verified = '1' AND Category = '$category'  ORDER BY Name";
    }
    else
    {
        $sql = "SELECT * FROM Locations WHERE Verified = '0' AND Category = '$category'  ORDER BY Name";
    }
    $result = $conn->query($sql);
    
    $rowNumber = $result->num_rows;
    
    if($rowNumber > 0)
    {
      while($row = $result->fetch_assoc())
      {
        if( $searchCount > 0 )
        {
          $Name .=",";
          $Address .=",";
          $Phone .=",";
          $Review .=",";
          $Distance .=",";
          $Category .=",";
          $Id .=",";
        }
        $searchCount++;
        $Name .= '"' . $row["Name"] . '"';
        $Address .= '"' . $row["Address"] . '"';
        $Phone .= '"' . $row["Phone"] . '"';
        $Review .= '"' . $row["Review"] . '"';
        $Distance.= '"' . $row["Distance"] . '"';
        $Category.= '"' . $row["Category"] . '"';
        $Id .= '"' . $row["Id"] . '"';
      }
      $conn->close();
      returnWithInfo( $Name, $Address, $Phone, $Review, $Distance, $Category, $Id);
    }
    else
    {
      $conn->close();
      returnWithError("No Locations Added Yet");
      exit();
    }
    
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
    function returnWithInfo($Name, $Address, $Phone, $Review, $Distance, $Category, $Id)
    {
      $retVal = '{"Name":[' . $Name . '], "Address":[' . $Address . '], "Phone":[' . $Phone . '], "Review":[' . $Review . '], "Distance":[' . $Distance . '], "Category":[' . $Category . '], "Id":[' . $Id . '],"error":""}';
      sendResultInfoAsJson($retVal);
    }
?>