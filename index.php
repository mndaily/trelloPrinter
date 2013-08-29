<?php
	//Make sure apiKey has a member named key which contains your trello API key
	$keyFile = 'apiKey.json';
	$json = json_decode( file_get_contents($keyFile), true);
?>
<html>
	<head>
		<title>Trello Board Printer</title>
		<link rel="stylesheet" type="text/css" href="trelloPrinter.css">
  		<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
  		<script src="https://api.trello.com/1/client.js?key=<?php echo $json['key']; ?>"></script>
  		<script src="trelloPrinter.js" type="text/javascript"></script>
	</head>
	<body>
		<div id="loggedout">
		    <a id="connectLink" href="#">Connect To Trello</a>
		</div>

		<div id="loggedin">
		    <div id="header">
		        Logged in to as <span id="fullName"></span> 
		        <a id="disconnect" href="#">Log Out</a>
		    </div>
		    
			<div id="output">
				<table id = "outputTable">
					<thead class = 'outputHead'>
						<tr class = 'card' id = "tableLabels">
							<td class = 'slug'>Slug</td>
							<td class = 'due'>Due</td>
							<td class = 'headline'>Headline</td>
							<td class = 'summary'>Summary</td>
							<td class = 'reporters'>Reporters</td>
							<td class = 'desk'>Desk</td>
							<td class = 'inches'>Inch Count</td>
						</tr>
					</thead>
				</table>
			</div>
		</div>  
	</body>

</html>  