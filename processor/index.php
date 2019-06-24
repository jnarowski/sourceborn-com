<?php 

$postData = isset($_POST) ? $_POST : null;
$response = ['success'=>false];

if($postData){
	$requiredFields = ['name','email','message'];
	$validFields = true;

	foreach($requiredFields as $field) {
		if(!isset($postData[$field])){
			$validFields = !$validFields;
			break;
		}
	}

	if($validFields){
		$to      = "joe070484@hotmail.com";
		$subject = "New lead - ".$postData['email'];
		$message = "<p style=\"width:100%;margin:20px 0 0 0;float:left;\">The following lead has been captured<br /><br /><b>Name:</b> ".$postData['name']."<br /><b>Email:</b> ".$postData['email']."<br /><b>Message:</b> ".$postData['message']."</p>";
		$header = "From: JP <noreply@".str_ireplace('www.','',$_SERVER['SERVER_NAME']).">\r\n"; 
		$header.= "Reply-To: ".$postData['email']."\r\n";
		$header.= "MIME-Version: 1.0\r\n"; 
		$header.= "Content-Type: text/html; charset=utf-8\r\n"; 

		if(mail($to, $subject, $message, $header)){
			$response['mail'] = true; 
		}else{
			$response['mail'] = false; 
		};
	
		$response['success'] = true;
	}else{
		$error = 'Missing required fields!';
	}
}

if(isset($error)){
	$response['error'];
}

print(json_encode($response));

?>