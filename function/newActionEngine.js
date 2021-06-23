class ActionEngine{
   
	static maxDebugDepth = 100;
	static async processRequest(flowRequest, l = {}, copyl = false){
 
	   if(! operate.isArray(flowRequest)){
		   flowRequest = [flowRequest];
	   }
	   var answer = [];
	   await Entity.walk(
		   {rngstart:0, rngend: flowRequest.length},
		   {
			   value : {
				   func: async function(i, flowRequest, l, answer) {
				   if(operate.isString(flowRequest[i]))
					  flowRequest[i] = Entity.get(flowRequest, window);
 
					  if(operate.isArray(flowRequest[i])){
						 answer.push((await ActionEngine.processRequest(flowRequest[i], l, copyl)) || []);
						 return false;
					  }
					  var response = await ActionEngine.action(Entity.requestExpander(flowRequest[i]), l);
					//   if((operate.isEqual(response,false) && flowRequest[i].exit) || (operate.isEqual(response,null) && flowRequest[i].exit))
					//   		return false;
					  answer.push(response);
				   },
				   args: [flowRequest, l, answer],
				wait:true
			   }
		   }
	   );
	   // console.log("Returning", answer, "for", flowRequest);
	   return (answer.length > 1 ? answer : answer[0]);
	}
	/* 
	   Request is evaluated Like->
	   
		  extends{
			 delete                     // default:{}
		  }
 
 
		  Loop {                        // default:1
			 condition {                //default:true
				declare
				if(method exists){
				   arguments            //default:[]
				   objectModel
				   method
				   response
				   
				}
				callback
			 }
		  }
		  passStates
		  return
 
	*/
	static async action(requestF, l = {}, copyl = false){
	   // console.log(requestF, l, copyl);
	   if(copyl) 
		  l = {...l};
 
	   requestF = {...requestF}; //copy the request
 
		if(operate.isString(requestF)){
			requestF = Entity.get(requestF, window);
		}
 
	   var lastl;
 
		  lastl = {...l};
 
	   if(! requestF.hasOwnProperty('loop')) requestF.loop = 1;
 
	   requestF.loop = Entity.getValue(requestF.loop, l);
 
	   if((! operate.isInt(requestF['loop'])) || requestF.loop < 0) {
		  console.error("Request.loop should be a whole number. What's this?", requestF.loop);
		  throw Error("Terminate Called");
	   }
	   
 
	   await Entity.walk(
		   {rngstart:0, rngend: requestF.loop},
		   {
			   value: {
				   func: async function(i, requestF, l){
				   var request = {...requestF};
 
					 if(request.hasOwnProperty('condition')) request.condition = Entity.getValue(request.condition, l);
 
					 if(! request.hasOwnProperty('condition')) request.condition = true;
				  
					 if(! (eval(request['condition']))){ // we should not execute this
						requestF.__exitRequest = true;
					  return false;
					 }
 
					 if(! request.hasOwnProperty('declare')) request.declare = {};
 
					 var x = l;
					 l = await Entity.updateProps(request.declare, l, x);
				     if(Object.keys(l).length > 0)
					 		console.log(l);
					 if(request.hasOwnProperty('method')){
 
						if(! request.hasOwnProperty('arguments'))request.arguments = [];
 
						if(! operate.isArray(request.arguments)){
						   request.arguments = [request.arguments];
						}
						await Entity.walk(
							  {rngstart:0, rngend: request.arguments.length},
							  {
								  value: {
									  func: async function(i, request, l){
										  request.arguments[i] = Entity.getValue(request.arguments[i], l);
									  },
									  args: [request, l],
							   wait:true
								  }
							  }
					  );
					  
						if(! request.hasOwnProperty('objectModel')){
						
						   console.error("Request.objectModel is not present, while Request.method is.");
						   throw Error("Terminate Called");
						}
 
						var objectModel = Entity.getValue(request.objectModel, l, null) || Entity.get(request.objectModel, window);
						
					  if(!objectModel){
						   console.error(objectModel, " is not a valid objectModel");
						   throw Error("Terminate Called");
						}
						var method = objectModel[request.method];
						if(method === undefined)
						 console.error("UNDEFINED METHOD CALL", objectModel, method, request.objectModel, request.method);
 
					  var response = await method.apply(objectModel, request.arguments);
					  console.log(request.response + "=>" + response);
						if(request.hasOwnProperty('response')){
						   if(! operate.isString('response')){
							  console.error("Request.response should be a string. What's this? ", request['response']);
							  throw Error("Terminate Called");
						   }
						   l[request['response']] = response;
						}
					 }
 
					 if(request.hasOwnProperty('callback')){
						await ActionEngine.processRequest(request['callback'], l);
					 }
				  },
				  args: [requestF, l],
				wait:true
			   }
			}
		 );
	   var returnVal;
 
	   if((!requestF.__exitRequest) && requestF.hasOwnProperty('return')){
		  
		  returnVal = Entity.getValue(requestF.return, l);
	   }
	   // console.log(returnVal);
	   if(requestF.hasOwnProperty('passStates') && !requestF.passStates) 
	   {
		   var x = {
			   func: function(lastl, key, l){
				   lastl[key] = l[key];
				   return false;
			   },
			   args: [l]
		   };
		   Entity.walk(
			   lastl, 
			   { object:x, array:x, value:x }
		   );
 
		  l = lastl;
	   }
	   // console.log(requestF, l, returnVal, requestF.__exitRequest);
	   if(!requestF.__exitRequest){
		  return returnVal;
	   }
	   return null;
	}
 }
 
 var engine = {
	maxDebugDepth: ActionEngine.maxDebugDepth,
	processRequest: ActionEngine.processRequest,
	action: ActionEngine.action
 };
 var httpService = {
    urlBuilder:HttpService.urlBuilder,
    requestBuilder:HttpService.requestBuilder,
    fetchRequest:HttpService.fetchRequest,
};
var ActionControllerObject = {
    onChangeRoute:ActionController.onChangeRoute
};

 