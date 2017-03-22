# Drag and Upload

> Drag and drop files and upload them via HTTP. Also includes two barebones back-end scripts, written in PHP and C#.
> 
> A Remi A Olsen Production :D
> remi@remiolsen.info / https://remiolsen.info
> 
> This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
> https://creativecommons.org/licenses/by-nc/4.0/

## HTML, JavaScript, and CSS basics

For the sake of example, we will point to the C# ASHX script. You would, in all likelihood, want to create your own back-end script, and point the `setUp` call to it.

The default scripts uploads to `uploads` folder in the root. Make sure to create that folder before running the script, or, much preferably, create a folder somewhere else.

In the `head` block, add the following:

		<link rel="stylesheet" type="text/css" href="dragAndUpload/css/dragAndUpload.css">
		<link rel="stylesheet" type="text/css" href="dragAndUpload/css/dragAndUploadAnimations.css">
		<script type="text/javascript" src="dragAndUpload/js/dragAndUpload.js"></script>
		<script type="text/javascript">
			window.onload = function () {
				try {
					var d = Object.create(dragAndUpload);
					d.setUp({ url: 'dragandupload/uploadscripts/default.ashx' });
				} catch (exception) {
					console.log('Error creating menus. In all likelihood your browser is out of date.\r\n', exception, '\r\n', navigator.userAgent);
				}
			};
		</script>
		
To create a drop element, put the following into your `form` block:

		<label for="myDragElement" class="dragAndUpload" data-post-string="?todo=test">
			<span>Click or drag and drop to upload file</span>
			<input type="file" multiple="multiple" class="dragAndUploadManual" name="myDragElement" id="myDragElement" />
		</label>
		
When the file is dropped (or the drop element is clicked for manual uploads), it will post to the URL passed in the setup with the `data-post-string` appended to it, i.e.:

		dragAndUpload/uploadscripts/default.ashx?todo=test
		
The `skeleton` object in the JavaScript holds all configuration properties, and the can all be configured in `setUp`. The commone ones are:

		// URL to post upload to.
		url: 'dragAndUpload/uploadscripts/default.ashx',
		
		// Max total size of uploads.
		maxSize: 5242880,
		
		// Max number of files to upload.
		maxFiles: 5,
		
		// Allowed MIME types. Set to [] to allow all file types. E.g.: ['image/png', 'text/html']
		allowedFileTypes: []
