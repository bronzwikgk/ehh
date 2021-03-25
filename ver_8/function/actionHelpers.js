// Query for all available fonts and log metadata.
// const fonts = navigator.fonts.query();
// try {
//   for await (const metadata of fonts) {
//     console.log(`${metadata.family} (${metadata.fullName})`);
//   }
// } catch (err) {
//   console.error(err);
// }

function* createIndex() {
    let number = 1;
    while (true)
        yield number++;
}

function uid() {
    let timmy = Date.now().toString(36).toLocaleUpperCase();
    let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
    randy = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
    return ''.concat(timmy, '-', randy);
}


//console.log("Generate Unique Id's Like these>>>>>", uid(), 'call me at actionHelper.uid');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//console.log("orLIke this",uuidv4());
//console.log(JSON.stringify({ alpha: 'A', beta: 'B' }, null, '\t'));
// Result:
// '{
//     "alpha": A,
//     "beta": B
// }'
function obj_to_array(arg) {
    return Object.entries(arg).map(([key, value]) => `${key}: ${value}`);
}

class process {
    static processReq(input, output, key, value) {
       // console.log("process req", input, output, operate.is(input),typeof input)
        if (typeof input === 'object') {
          //  console.log("process req", input, output)
            var buffer = process.iterateObj(input, output, key);
        } else if (operate.is(input) === 'Array') {
            var buffer = process.iterateObj(input, output, key);
        } else if (operate.is(input) === 'String') {
            console.log('String >>>', key, value);
            //Entity.set(input,this.output,key,value);           
        }
        return buffer;
    }
    static iterateObj(input, output) {
        for (var key in input) {
            var value = input[key];
          //  console.log("found",key,input[key])
            if (operate.is(value) === 'Object') {
                // console.log("Object",output);
                var buffer = Entity.create(input, output, value.name);
                process.iterateObj(input[key], buffer, key, value)
                Entity.append(buffer, output);
            } else if (operate.is(value) === 'Array') {
                //  console.log("foundArray", key)
                var buffer = Entity.create(input, output, key);
                process.iterateArr(input[key], buffer, key, value)
                Entity.append(buffer, output);
                // console.log('Array',key, value, buffer);
            } else if (operate.is(value) === 'String' || operate.is(value) === 'Boolean') {
                //  console.log('String',key, value,output);
                Entity.set(input, output, key, value);
                //Entity.set(input,this.entity,key,value);           
            }

        }
        // console.log('Iterate Objoutput',output)
        return output;
    }
    static iterateArr(input, output, key, value, callback, callbackClass) {
        //  console.log("Iterating Array", input, output, key, value);

        for (var i = 0; i < input.length; i++) {
            //console.log("Object found in array", input[i]);

            if (operate.is(input[i]) === 'Object') { //console.log("Object in array",response)

                var response = Entity.create(input[i], output, input[i].name);
                process.iterateObj(input[i], response, input[i].name,)
                Entity.append(response, output);

            } else if (operate.is(input[i]) === 'Array') { // console.log("found Array", key, input[key])

            } else if (operate.is(input[i]) == 'String') { //  console.log("found property, Set Attributes in output", key, input[key])

                // Entity.set(input,output,key,input[key])
            } else {

                //  console.log("stray found")
            }
            //console.log(callbackClass,callback)
            //   console.log(key, input[key])
            //var response = operate.isNotEmpty(callback) ? conductor.conduct(input, output, key, input[key], callback, callbackClass) : null;
            if (operate.isNotEmpty(callback)) {

                //  var response = conductor.conduct(input, output, key, input[key], callback, callbackClass);

            }
        }
        // console.log("iterator Array response", response);
        return response;
    }
}

class StorageHelperV1 {
    constructor(entity) {
        //  this.entity = getEntityFromStorage()
        StorageHelper.saveToStorage(entity.name, entity);    //Can we store Objects  
        this.entity = this.getStorage();
        //  console.log("Storage >>>>>",this.getStorage);
    }
    static saveToStorage() {
       // console.log("I was called", JSON.stringify(arguments[0][1]) )
        // data=JSON.stringify(data)
        //  console.log(actionStorageInstance);
        localStorage.setItem(arguments[0][0], JSON.stringify(arguments[0][1]));
    }

    static getFromStorage(key) {
        let data = localStorage.getItem(key)
        return JSON.parse(data);
    }
    getStorage() {
        return window.localStorage;
    }


    static clearStorage() {
        localStorage.clear()
    }
    getMemoryUse(name, callback) {
        chrome.storage.local.getBytesInUse(name, callback);
    };
    static export(fileName, json) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(json, null, 2)], {
            type: "application/json"
        }));
        a.setAttribute("download", `${fileName}.json`);
        document.body.appendChild(a);
        a.click();
    }
}




function isIn(argA, entity, options) {
    var valuesArray = Object.values(entity)
    var result = Object.values(entity).filter(function (key, index, self) {
      //  console.log(argA,!key.prefix.indexOf(argA), key.prefix)
        if (!key.keyIdentifier.indexOf(argA) === true) {
           // console.log("tentative match found",key)
            if (argA.length === key.keyIdentifier.length) { 
              //  console.log("matchFound", key.prefix)    //To get strict Match To be enabled using options.
                var response = true;
              //  return true;
            }  
        }
        return !key.keyIdentifier.indexOf(argA);
    });
   // console.log("result",result);
    return result;

}


/**
 * AutComplete
 */

class AutoComplete {
    static checkSuggestion(keyword, editor) {
      //  console.log("keyword In testing",keyword,typeof keyword)
        keyword = this.removeSpecialCharacters(keyword.trim());
        if (this._isContains(snippets, keyword)) {

             console.log("editor",editor)
            for (let i = 0; i < snippets.length; ++i) {

                const obj = snippets[i];
                // console.log(obj.prefix+" "+keyword)

                if (obj.prefix === keyword.trim()) {

                   // console.log(editor.innerText.substring(0, editor.innerText.length - keyword.trim().length))

                    console.log("Found",obj.prefix);
                   // Caret.insertInTextarea(obj.body)
                    return true;
                    // this.setCaretToEnd(editor)
                }
            }
        } else {
         //   console.log("Nope");
            return false;
        }
    }
    static uniqueArray(array) {
        const uniqueArray = [...new Set(array)];
    }
    static removeSpecialCharacters(keyword) {
        // console.log(keyword)
        const desired = keyword.replace(/[^\w\s]/gi, '');
        // console.log(desired.trim())
        return desired
    }

    static _isContains(json, value) {
        // console.log(value.trim())
        let contains = false;
        Object.keys(json).some(key => {
            contains = typeof json[key] === 'object' ? this._isContains(json[key], value.trim()) : json[key] === value.trim();
            return contains;
        });
        return contains;
    }

    static setCaretToEnd(target) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(target);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        target.focus();
        range.detach(); // optimization

        // set scroll to the end if multiline
        target.scrollTop = target.scrollHeight;
    }
}


function* createIndex() {
    let number = 1;
    while (true)
        yield number++;
}


let cache = new Map();

function loadCached(url) {
    if (cache.has(url)) {
        return Promise.resolve(cache.get(url)); // (*)
    }

    return fetch(url)
        .then(response => response.text())
        .then(text => {
            cache.set(url, text);
            return text;
        });
}