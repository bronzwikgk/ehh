var data = {
    first: "firstName",
    last: "lastName",
    phoneNumber: "phoneNumber",
    city: "city",
  // serverNodeRequest: JSON.stringify(serverNodeRequest),
    serverNodeRequest : {
    serverActionRequest: 'create',
    entity: ["spreadsheet", "sheet", "namedRange", "range"],
    payloadType: ["JSON", "TEXT"],
    responseTypeReq : "TEXT",
    requestOrigin : window.location.href,
      resourceID: '1UyeN78yNshJxn1v12jQtT-idQFt7uF6F35qKoE3O6AQ'
//resourceUrl = "https://docs.google.com/spreadsheets/d/1mBZJ01Ddhl9fByyJ5K-JEsruO7XV51i7ctdnRJ6-hGk/edit#gid=1449573075";

}
};

//    var serverNodeRequest = {
//    // serverActionRequest: ['create', 'append', 'get', 'update', 'delete', 'validate'],
//        entity: "sheet",
//     //payloadType: ["JSON", "TEXT"],
//     responseTypeReq : "TEXT",
//     requestOrigin : window.location.href,
//     resourceID : '1mBZJ01Ddhl9fByyJ5K-JEsruO7XV51i7ctdnRJ6-hGk'
// //resourceUrl = "https://docs.google.com/spreadsheets/d/1mBZJ01Ddhl9fByyJ5K-JEsruO7XV51i7ctdnRJ6-hGk/edit#gid=1449573075";
// }

//service URL File https://docs.google.com/spreadsheets/d/1UyeN78yNshJxn1v12jQtT-idQFt7uF6F35qKoE3O6AQ/edit#gid=1748866202

serviceUrl = "https://script.google.com/macros/s/AKfycby2WeCEktlFN6GrKl_x84n5CjGSv4bzsivNYWDy5qix0mUUFROfW2my/exec";

let url = serviceUrl;
request = {
    method: 'GET',
    mode: 'no-cors', 

 
      body: JSON.stringify(data)
}

