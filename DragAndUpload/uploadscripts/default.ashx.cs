using System;
using System.Linq;
using System.Web;

namespace uploader.uploader {
	/// <summary>
	/// A very simple, basic file-upload class.
	/// Modify and secure code if you plan on using this live.
	/// </summary>
	public class _default1 : IHttpHandler {
		private readonly string savePath = HttpContext.Current.Server.MapPath("~/DragAndUpload/uploads/");
		private readonly string[] allowedFileTypes = { "image/png", "image/jpeg", "image/gif" };
		private const int maxFiles = 20;

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