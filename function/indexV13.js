var actionSpaceElementInstanceIndom = document.getElementById('actionSpaceContainer');
indexDB.set('actionSpaceModel',actionSpaceViewModel);
var viewModel = indexDB.get('actionSpaceModel');
console.log("here",viewModel);
//console.log(HorizonticalMenuTemplateSchema,actionSpaceElementInstanceIndom)
//console.log(actionSpaceViewModel[0].model);
var actionSpaceInstance = new ActionView(actionSpaceViewModel[0].model, actionSpaceElementInstanceIndom);
//console.log(actionSpaceInstace._actionView.entity)
var actionEventInstance = new ActionEvent(actionSpaceInstance,window);
var actionSpaceController = new ActionController(actionSpaceInstance,actionSpaceViewModel[0].model,actionEventInstance);
