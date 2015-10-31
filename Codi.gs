/**
 * Serves HTML of the application for HTTP GET requests.
 * If folderId is provided as a URL parameter, the web app will list
 * the contents of that folder (if permissions allow). Otherwise
 * the web app will list the contents of the root folder.
 *
 * @param {Object} e event parameter that can contain information
 *     about any URL parameters provided.
 */
function doGet(e) {
  // return HtmlService.createHtmlOutput('<html> <body> <p> Hello World </p> </body> </html');

  var template = HtmlService.createTemplateFromFile('Index');

  // Retrieve and process any URL parameters, as necessary.
  if (e.parameter.folderId) { template.folderId = e.parameter.folderId; }
  else {                      template.folderId = 'root'; }

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
      .setTitle('Web App Window Title')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/**
 * Return an array of up to 20 filenames contained in the
 * folder previously specified (or the root folder by default).
 *
 * @param {String} folderId String ID of folder whose contents
 *     are to be retrieved; if this is 'root', the
 *     root folder is used.
 * @return {Object} list of content filenames, along with
 *     the root folder name.
 */

function getFolderContents(folderId) {
  var topFolder;
  var contents = {
    folder_path : [],
    folder_list : [],
    file_list   : []
  };

  if (folderId == 'root') topFolder = DriveApp.getRootFolder();
  else                    topFolder = DriveApp.getFolderById(folderId);

  var folders = topFolder.getFolders();
  var files = topFolder.getFiles();
  var parents = topFolder.getParents();
  var numFolders = 0;
  var numFiles = 0;

  // Get a list with the full folder path
  contents.folder_path.push({
    folder_name : topFolder.getName(),
    folder_ID   : topFolder.getId()
  });
  while (parents.hasNext()) {
    var pare = parents.next();
    contents.folder_path.push({
        folder_name : pare.getName(),
        folder_ID   : pare.getId()
     });
    parents = pare.getParents();
  }
  contents.folder_path.reverse();

  // Loop all folder list
  while (folders.hasNext()) {
   var folder = folders.next();
   contents.folder_list.push({
        folder_name : folder.getName(),
        folder_ID   : folder.getId()
     });
  }

  // Loop all file list
  while (files.hasNext()) {
   var file = files.next();
   contents.file_list.push({
        file_name : file.getName(),
        file_ID   : file.getId()
     });
   numFiles++;
  }

  return contents;
}

function addFolder(folderId, folder_name) {

  if (folderId == 'root') Current_Folder = DriveApp.getRootFolder();
  else                    Current_Folder = DriveApp.getFolderById(folderId);

  Current_Folder.createFolder(folder_name);

}
