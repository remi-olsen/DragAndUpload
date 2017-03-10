/**
 * Drag and Upload 1.2
 * A Remi A Olsen Production :D
 * remi@remiolsen.info / https://remiolsen.info
 * 
 * This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
 * https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

var
	duConfig,
	skeleton = {
		// URL to post upload to.
		url: 'DragAndUpload/uploadscripts/default.ashx',
		// Max total size of uploads.
		maxSize: 5242880,
		// Max number of files to upload.
		maxFiles: 5,
		// Allowed MIME types. Set to [] to allow all file types. E.g.: ['image/png', 'text/html']
		allowedFileTypes: [],
		// Base target CSS class.
		staticClass: 'dragAndUpload',
		// Mouse over CSS class.
		hoverClass: 'dragAndUploadActive',
		// Currently uploading CSS class.
		uploadingClass: 'dragAndUploadUploading',
		// Error CSS class.
		errorClass: 'dragAndUploadFailure',
		// Successful upload CSS class.
		successClass: 'dragAndUploadSuccess',
		// Text status ID attribute.
		statusField: 'dragAndUploadStatus',
		// Class of manual upload element.
		manualElement: 'dragAndUploadManual',
		// Class of message element.
		messageElement: 'dragAndUploadMessage',
		// Class of upload percentage counter.
		counterClass: 'dragAndUploadCounter',
		// Class of upload percentage counter when gone.
		counterClassActive: 'active',

		/**
		 * Checks if the event is a child of the drop element. If it is,
		 * it returns the parent element -- i.e. the one handling the dropped
		 * files. This is the element where we set one of the aforementioned
		 * CSS classes.
		 * @t: HTML element.
		 */
		setElement: function (t) {
			if (t) {
				return (t.className.indexOf(this.staticClass) > -1) ? t : t.parentNode;
			}
		},

		/**
		 * Removes a CSS class from the received HTML element.
		 * @t: HTML element.
		 * @className: CSS class to remove.
		 */
		removeClass: function (t, className) {
			if (t.className.indexOf(className) > -1) {
				className = ' ' + className;
				var tempClass = t.className.replace(className, '');
				t.className = tempClass;
			}
		},

		/**
		 * Changes the CSS class of the drop element, and updates
		 * the text of the status element.
		 * @text: Status text.
		 * @isError: 0 = Not an error message. 1 = Is an error message.
		 * @dropElement: Drop element.
		 * @response: HTTP response.
		 * @s: This class, passed in because of JS's object odditites.
		 */
		message: function (text, isError, dropElement, response, s) {
			var changeToClass = isError === 1 ? this.errorClass : this.successClass,
							uploadingClass = this.uploadingClass,
							messageElement = dropElement.querySelector('.' + s.messageElement),
							counterElement = dropElement.querySelector('.' + s.counterClass);
			counterElement.className = s.counterClass;
			if (isError === 1) {
				messageElement.innerHTML = text;
			}
			this.removeClass(dropElement, uploadingClass);
			dropElement.className += ' ' + changeToClass;
			document.getElementById(dropElement.getAttribute('for')).value = '';
			console.log(text, '\r\n', response);
		},

		/**
		 * Checks that files are valid for upload.
		 * @files: Files dropped onto element.
		 * @s: This class, passed in because of JS's object odditites.
		 * @dropElement: Drop element.
		 */
		validFiles: function (files, s, dropElement) {
			var data = new FormData();
			var filesTotalSize = 0,
					totalFiles = files.length,
					filePlural = totalFiles > 0 ? "files" : "file",
					allFilesAllowed = true;
			for (var i = 0; i < files.length; i++) {
				if (s.allowedFileTypes.indexOf(files[i].type) === -1 && s.allowedFileTypes.length > 0) {
					allFilesAllowed = false;
					break;
				} else {
					data.append(files[i].name, files[i]);
					filesTotalSize += files[i].size;
				}
			}
			if (allFilesAllowed === false) {
				s.message('Illegal file types in file list.', 1, dropElement, '', s);
				return 'failed';
			} else if (filesTotalSize > s.maxSize) {
				s.message('Size of ' + filePlural + ' exceeds the allowed maximum.', 1, dropElement, '', s);
				return 'failed';
			} else if (totalFiles > s.maxFiles) {
				s.message('Total number of files exceeds the allowed maximum.', 1, dropElement, '', s);
				return 'failed';
			} else {
				return data;
			}
		},

		/**
		 * Where the actual HTTP upload happens.
		 * @dropElement: Drop element.
		 * @s: This class, passed in because of JS's object odditites.
		 * @data: Form data.
		 */
		uploadFiles: function (dropElement, s, data) {
			var xhr = new XMLHttpRequest(),
				qs = dropElement.getAttribute('data-post-string') + '&cacheisbad=' + new Date().getTime(),
				counterElement = dropElement.querySelector('.' + s.counterClass);
			counterElement.className += ' ' + s.counterClassActive;
			xhr.onreadystatechange = function (e) {
				if (xhr.readyState === 4 && xhr.status === 200) {
					if (xhr.response.substring(0, 5) === "error") {
						s.message('Upload failed. Please contact site administrator for further assistance.', 1, dropElement, xhr.response, s);
					} else {
						s.message('Upload complete!', 0, dropElement, xhr.response, s);
					}
				} else if (xhr.readyState === 4 && xhr.status !== 200) {
					s.message('Upload failed. Please contact site administrator for further assistance', 1, dropElement, xhr.response, s);
				}
			};
			xhr.upload.onprogress = function (e) {
				var percent = (parseInt((e.loaded / e.total) * 100));
				if (isNaN(percent)) { percent = 0; }
				counterElement.innerHTML = percent + '%';
			};
			xhr.open('POST', s.url + qs);
			xhr.send(data);
		},

		/**
		 * Start the upload.
		 * @files: Files dropped onto element.
		 * @s: This class, passed in because of JS's object odditites.
		 * @dropElement: Files dropped onto element.
		 */
		uploadSetup: function (files, s, dropElement) {
			var data = this.validFiles(files, s, dropElement);
			if (data !== 'failed') {
				this.uploadFiles(dropElement, s, data);
			}
		},
	},

	dragAndUpload = {
		/**
		 * Handles manually uploaded files.
		 * @event: HTML element event.
		 */
		handleManualUpload: function (event) {
			event.stopPropagation();
			event.preventDefault();
			var s = duConfig,
				t = event.target,
				files = t.files,
				findId = t.getAttribute('id'),
				dropElement = document.querySelector('[for="' + findId + '"]');
			s.removeClass(dropElement, s.successClass);
			s.removeClass(dropElement, s.errorClass);
			dropElement.className += ' ' + s.uploadingClass;
			s.uploadSetup(files, s, dropElement);
		},

		/**
		 * Handles dropped files.
		 * @event: HTML element event.
		 */
		handleDrop: function (event) {
			event.stopPropagation();
			event.preventDefault();
			var s = duConfig,
				t = event.target,
				files = event.dataTransfer.files,
				dropElement = skeleton.setElement(t);
			s.removeClass(dropElement, s.successClass);
			s.removeClass(dropElement, s.hoverClass);
			dropElement.className += ' ' + s.uploadingClass;
			s.uploadSetup(files, s, dropElement);
		},

		/**
		 * Handles drag over and leave.
		 * @event: HTML element event.
		 */
		handleDrag: function (event) {
			event.stopPropagation();
			event.preventDefault();
			var s = duConfig,
					dropElement = s.setElement(event.target);
			s.removeClass(dropElement, s.successClass);
			s.removeClass(dropElement, s.errorClass);
			if (dropElement.className.indexOf(s.hoverClass) === -1) {
				dropElement.className += ' ' + s.hoverClass;
			}
		},

		handleDragLeave: function (event) {
			event.stopPropagation();
			event.preventDefault();
			var s = duConfig,
					dropElement = s.setElement(event.target);
			s.removeClass(dropElement, s.successClass);
			s.removeClass(dropElement, s.errorClass);
			s.removeClass(dropElement, s.hoverClass);
		},

		createBackground: function (dropElement) {
			for (var i = 0; i < 3; i++) {
				var dot = document.createElement('span');
				dot.className = 'dot';
				dropElement.appendChild(dot);
			}
			var messageElement = document.createElement('span');
			messageElement.className = duConfig.messageElement;
			dropElement.appendChild(messageElement);
			var counterElement = document.createElement('div');
			counterElement.className = duConfig.counterClass;
			dropElement.appendChild(counterElement);

		},

		/**
		 * Kick off.
		 */
		setUp: function (config) {
			duConfig = Object.create(skeleton);
			for (var c in config) {
				duConfig[c] = config[c];
			}
			var dropZones = document.getElementsByClassName(duConfig.staticClass);
			if (dropZones.length > 0) {
				for (var i = 0; i < dropZones.length; i++) {
					this.createBackground(dropZones[i]);
					if (window.FormData) {
						var manualElement = dropZones[i].querySelector('.' + duConfig.manualElement);
						manualElement.addEventListener('change', this.handleManualUpload, false);
						dropZones[i].addEventListener('dragover', this.handleDrag, false);
						dropZones[i].addEventListener('dragleave', this.handleDragLeave, false);
						dropZones[i].addEventListener('drop', this.handleDrop, false);
					} else {
						dropZones[i].className += ' ' + duConfig.errorClass;
						dropZones[i].querySelector('.' + duConfig.messageElement).innerHTML = 'Sorry, browser in incompatible.';
					}
				}
			}
		}
	};