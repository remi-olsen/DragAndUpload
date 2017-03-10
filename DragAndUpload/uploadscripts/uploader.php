<?php
	/*
		A very simple, basic file-upload class.
		Modify and secure code if you plan on using this live.
	*/
	$allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
	$maxFiles = 2;
	$savePath = "../../uploads/";
	if (count($_FILES) > 0 && count($_FILES) <= $maxFiles) {
		foreach($_FILES as $file) {
			if(in_array($file["type"], $allowedFileTypes)) {
				$fileName = $savePath . $file["name"];
				move_uploaded_file($file["tmp_name"], $fileName);
			}
		}
	}
?>