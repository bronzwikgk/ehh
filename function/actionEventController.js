//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
//this file handles all the events that are Initialised during Init.

//To make a getReq to a appScript server the queryParameter have to be added to the url using buildEncodedURI.
//when making a post request a normal post works.
// function processButtonClick(e) {
//     e.preventDefault();
//     console.log(e.target.id);
//     if (e.target.id === 'get') {
//         request.method = "GET";
//         var encodedParam = clientNodeFetch.buildEncodedUri(request);
//         var url2 = url + "?" + encodedParam;
//         clientNodeFetch.fetchUrl(url2);
//     }
//     if (e.target.id === 'post') {
//         //request = getRequest;
//         request.method = "POST";
//         clientNodeFetch.fetchHttpRequest(url, request);
//     }
//
//
// }
//
//
// document.getElementById("get").addEventListener("click", processButtonClick);
// document.getElementById("post").addEventListener("click", processButtonClick);
//

class actionEventController {
    constructor(context) {
        this._events = {};
        this.context = context
        this.createListeners(context)
    }


    on(evt, listener) {
        console.log(evt);
        (this._events[evt] || (this._events[evt] = [])).push(listener);
        return this;
    }

    emit(evt, arg) {
        (this._events[evt] || []).slice().forEach(lsn => lsn(arg));
    }

    createListeners(entity) {
        console.log(entity)
        let events = dataHelpers.find(entity, 'on')
        console.log(events)

        events.forEach((evt)=>{
            window[evt] = this.conductEvent
        })
    }



    conductEvent = (e) => {
        // console.log(e)
        if (e.type === "mouseover") {
            // console.log("Mouse moved")
            //TODO
            // this.emit(e.type, e.target)
        } else if (e.type === "click") {
            // console.log("click")
            this.emit("click", e.target)
        }
        if (e.type === "contextmenu") {
            e.preventDefault();

        } else if (e.type === "input") {
            this.emit('updateEditor',e.target.innerText)
            console.log(e.target.innerText)
        }

    }


}
