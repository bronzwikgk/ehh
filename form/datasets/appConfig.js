var activeListerners = {
    'window': {
        'onload': 'handleEvent',
        'onbeforeunload':'handleEvent',
        'onhashchange':'handleEvent',
        'onpopstate':'handleEvent',
        'onstorage':'handleEvent',
      //  'onmousemove':'handleevent',
        'onDOMContentLoaded': 'handleEvent',
        'onload': 'handleEvent',   
        'onreadystatechange':'handleEvent',
        // 'onmouseenter':'handleEvent',
        // 'onmouseover':'handleEvent',
        // 'onmouseleave':'handleEvent',
        
        // 'onmouseout':'handleEvent',
        // 'onbeforeunload':'handleEvent',
        'onunload':'handleEvent',
        'onkeydown':'handleEvent',
        'onkeyup':'handleEvent',
        'onkeypress':'handleEvent',
        'onclick':'handleEvent',
    },
    'document': {
        
    }
}
var handleEventReq = {
  
}

var activeEvents = [
{}
]
//document.addEventListener('mouseenter', e => this.emit('handleEvent', e));
    

//console.log("loaded",Object.keys(activeListerners['window']))