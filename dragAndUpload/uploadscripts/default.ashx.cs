/**
 * Drag and Upload 1.2.1
 * A Remi A Olsen Production :D
 * remi@remiolsen.info / https://remiolsen.info
 * 
 * This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
 * https://creativecommons.org/licenses/by-nc/4.0/
 */

using System;
using System.Web;

namespace uploader.uploader {
	/// <summary>
	/// A very simple, basic file-upload class.
	/// Modify and secure code if you plan on using this live.
	/// </summary>
	public class _default1 : IHttpHandler {
		private readonly string savePath = HttpContext.Current.Server.MapPath("~/dragAndUpload/uploads/");
		private const int maxFiles = 5;

		public void ProcessRequest(HttpContext context) {
			try {
				if (context.Request.Files.Count <= 0 || context.Request.Files.Count > maxFiles) { return; }
				foreach (string rf in context.Request.Files) {
					HttpPostedFile file = context.Request.Files[rf];
					string fileName = System.IO.Path.GetFileName(file.FileName);
					string fileToSave = this.savePath + fileName;
					file.SaveAs(fileToSave);
					context.Response.Write(fileName + "\r\n");
				}
			} catch (Exception ex) {
				context.Response.Write("error " + ex);
			}
		}

		public bool IsReusable {
			get {
				return false;
			}
		}
	}
}