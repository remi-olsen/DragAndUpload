<?php
/**
 * Drag and Upload 1.2
 * A Remi A Olsen Production :D
 * remi@remiolsen.info / https://remiolsen.info
 * 
 * This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
 * https://creativecommons.org/licenses/by-nc/4.0/
 *
 * A very simple, basic file-upload class.
 * Modify and secure code if you plan on using this live.
*/

	$maxFiles = 5;
	$savePath = "../../uploads/";
	if (count($_FILES) > 0 && count($_FILES) <= $maxFiles) {
		foreach($_FILES as $file) {
			$fileName = $savePath . $file["name"];
			move_uploaded_file($file["tmp_name"], $fileName);
		}
	}
?>