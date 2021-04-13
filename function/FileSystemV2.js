var fileHandle,defaultGetStoreFunc;;



class processFS{
    static newfileObjectURL() {
        var file = new File(["foo"], "foo.txt", {
            type: "text/plain",
        });
        var file = new File([fileData[name].data], name, { type: fileData[name].type, lastModified: Date.now() });
        //  See http://docs.webplatform.org/wiki/apis/file/URL/createObjectURL
        var url = URL.createObjectURL(file, { oneTimeOnly: true });
        return url;
    }
    static async NewFile(event){
        event.preventDefault();
        if(!fileHandle || document.getElementById('textBox').innerText.length < 1){
              ActionView.updateTitle(actionStoryTemplate.name);
              ActionView.updateText(actionUserContent[0]['innerHTML']);   
        }else{
            if(confirm('You want to erase the content ?')){
                ActionView.updateTitle(actionStoryTemplate.name);
                ActionView.updateText(actionUserContent[0]['innerHTML']);    
            }
        }
    }
    static async saveFile(event){
        event.preventDefault();
        console.log('File Handle ' + fileHandle);
        if(fileHandle === undefined){
            await processFS.saveAsFile(event);
        }else{
            const writable = await fileHandle.createWritable();
            await writable.write(document.getElementById('textBox').innerText);
            await writable.close();
        }
    }
    static async saveAsFile(event){
        event.preventDefault();
        const newHandle = await window.showSaveFilePicker(pickerOpts);
        const writableStream = await newHandle.createWritable();
        await writableStream.write(document.getElementById('textBox').innerText);
        await writableStream.close();
        fileHandle = newHandle;
    }
    static async readFile(event){
        event.preventDefault();
        if(fileHandle){
            if(confirm('Want to erase all the changes made it to the file')){
                await processFS.Open(event);
            }
        }else{
            await processFS.Open(event);
        }
    }
    async OpenFileV2(event, handle) {
        var response={};
        event.preventDefault();
        if(!handle){
            [fileHandle] = await window.showOpenFilePicker(pickerOpts);
        }else{
            fileHandle = handle;
        }
       // console.log(fileHandle);
        var contents;
        var file = await fileHandle.getFile();
        if(file['name'].includes('.json') || file['name'].includes('.txt')|| file['name'].includes('.html')|| file['name'].includes('.js')||file['name'].includes('.xml')){
          
            response['name'] = file['name'];
            response['file'] = file;
            response['content'] = await file.text();
          // console.log(file['name'], response);
            return response;
          //  ActionView.updateTitle(file['name']);
           // ActionView.updateInnerText(contents);
        }else if(file['name'].includes('.xlx') || file['name'].includes('.xlsx')|| file['name'].includes('.csv')){
            console.log("Work In Progress");
        }else if(file['type'].includes('image') ||file['name'].includes('.JPG') ||file['name'].includes('.JPEG') ||file['name'].includes('.PNG')){
           var reader = new FileReader();
           reader.addEventListener("load", function () {
            var image = new Image();
            image.title = file.name;
            image.width = '460';image.height = '380';
               image.src = reader.result;
               console.log(image);
           // ActionView.updateTitle(file['name']);
          //  ActionView.displayImage(image);
           }, false);
            console.log(image);
            reader.readAsDataURL(file);
        }else if(file['name'].includes('mp4')){
            var reader = new FileReader();
            reader.addEventListener("load", function () {
             var html = '<video src="' + reader.result + '" width="460" height="380" controls></video>'
          //   ActionView.updateTitle(file['name']);
            // ActionView.updateText(html);
           }, false);
           reader.readAsDataURL(file);
        }else{
            console.log("Not supported");
        }

    }
    async OpenDirectoryV2(event) {
        event.preventDefault();
        try {
            const response = await window.showDirectoryPicker();
            console.log("returning", response);
            return response;
 
        } catch (err) {
            console.log(err);
        }

    }
    //file folder
    static async OpenFileInEditor(event, id) {
        event.preventDefault();
        try{
        
        var fileHandle = await indexDB.get(id);console.log(fileHandle);
        var file = await fileHandle.getFile();
        if (file['name'].includes('.json') || file['name'].includes('.txt') || file['name'].includes('.html') || file['name'].includes('.js') || file['name'].includes('.xml')) {
            var contents = await file.text();
            ActionView.addInnerText(contents,document.getElementById('inlineContent'));
        }else if (file['type'].startsWith('image/')||file['name'].includes('.JPG') ||file['name'].includes('.JPEG') ||file['name'].includes('.PNG')) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var html = '<image src="' + reader.result + '"width="460" height="380" title="' + file.name + '"></image>';
                ActionView.addInnerHTML(html, document.getElementById('inlineContent'));
            }, false);
            reader.readAsDataURL(file);
        }else if (file['name'].includes('mp4')) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var html = '<video src="' + reader.result + '" width="460" height="380" controls></video>';
                ActionView.addInnerHTML(html,document.getElementById('inlineContent'));
            }, false);
            reader.readAsDataURL(file);
        }else if (file['name'].includes('.xlx') || file['name'].includes('.xlsx') || file['name'].includes('.csv')) {
            console.log("Work In Progress");
        }else {
            console.log("Not supported");
        }
        await processFS.RecentFiles(event,fileHandle,id);
    }catch(err){
            console.log(err);
        }
    }
    static async RecentFiles(event,fileHandle,id){
        event.preventDefault();
        try{
            var array = await indexDB.get('RecentFiles');
            var element = document.getElementById('RecentFiles');
            if(array === undefined){
                array = [];
            }
            if(!array.includes(id)){
                console.log("Including in indexDB");
                if(array.length == 10 && element.childNodes.length == 10){
                    array.shift();element.removeChild(element.childNodes[0]);
                }
                array.push(id);
                await processFS.jsonForFile(event,fileHandle,id,'RecentFiles');
                await indexDB.set('RecentFiles',array);
            }
        }catch(err){
            console.log(err);
        }
    }
    static async OpenAFile(event){
        event.preventDefault();
        try{
            let [fileHandle] = await window.showOpenFilePicker(); 
            var fileID = uid();await indexDB.set(fileID,fileHandle);
            await processFS.jsonForFile(event,fileHandle,fileID);
        }catch(err){
            console.log(err);
        }
    }
    static async jsonForFile(event,fileHandle,fileID,collectionId= 'myFiles'){
        event.preventDefault();
        try{
          var file =await  fileHandle.getFile();
          var input = {};
          input[fileID] = JSON.parse(JSON.stringify(fileJSON));
          console.log(fileJSON);
          input[fileID]['id'] = fileID;input[fileID]['textContent'] = file.name;
          console.log(input);
          var data = new Entity(input,document.getElementById(collectionId));
          localStorage.setItem('User'+collectionId,document.getElementById(collectionId).innerHTML);
        }catch(err){
            console.log(err);
        }
    }
    static async OpenDirectory(event){
        event.preventDefault();
        try {
            const dirHandle = await window.showDirectoryPicker();
            var dirID = uid();await indexDB.set(dirID, dirHandle);
            var input = JSON.parse(JSON.stringify(directoryJSON));
            input['li']['span']['textContent'] = dirHandle.name; input['li']['list']['id'] = dirID;
            var json = await processFS.jsonForDirectory(input['li']['list'], dirHandle);
            var data = new Entity(input, document.getElementById('myCollection'));
            localStorage.setItem('UsermyCollection',document.getElementById('myCollection').innerHTML);
        } catch (err) {
            console.log(err);
        }
    }
    static async jsonForDirectory(obj, parentHandle) {
        for await (var entry of parentHandle.values()) {
            var id = uid();
            if (entry.kind == 'directory') {
                var directory = JSON.parse(JSON.stringify(directoryJSON));
                directory['li']['span']['textContent'] = entry.name; directory['li']['list']['id'] = id;
                var directoryHandle = await parentHandle.getDirectoryHandle(entry.name);
                await indexDB.set(id, directoryHandle);
                obj[entry.name] = directory;
                console.log(obj[entry.name]['li']['list']);
                await processFS.jsonForDirectory(obj[entry.name]['li']['list'], directoryHandle);
            } else if (entry.kind == 'file' && entry.name.includes('.')) {
                var fileData = JSON.parse(JSON.stringify(fileJSON));
                fileData['id'] = id; fileData['textContent'] = entry.name;
                var getfileHandle = await parentHandle.getFileHandle(entry.name);
                await indexDB.set(id, getfileHandle);
                obj[entry.name] = fileData;
            }
        }
        console.log(obj);
        return obj;
    }
    //
    static verifyPermissions() {
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("Great success! All the File APIs are supported.");
            return true; // 
        } else {
            alert('The File APIs are not fully supported in this browser.');
            return false; // 
        }
    }
    static async verifyPermission(fileHandle, readWrite) {
        const options = {};
        if (readWrite) {
            options.mode = 'readwrite';
        }
        // Check if permission was already granted. If so, return true.
        if ((await fileHandle.queryPermission(options)) === 'granted') {
            return true;
        }
        // Request permission. If the user grants permission, return true.
        if ((await fileHandle.requestPermission(options)) === 'granted') {
            return true;
        }
        // The user didn't grant permission, so return false.
        return false;
    }
    static updateProgress(evt) {
        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
                progress.style.width = percentLoaded + '%';
                progress.textContent = percentLoaded + '%';
            }
        }
    }
    static uid() {
        let timmy = Date.now().toString(36).toLocaleUpperCase();
        let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
        randy = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
        return ''.concat(timmy, '-', randy);
    }    
}
var processFSInstance = new processFS();
//console.log("iam loaded, fs,processFS", processFSInstance)