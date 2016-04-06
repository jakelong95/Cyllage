/* Global Variables */

imagesTabButton_jQ = $("#imagesTabButton");
layersTabButton_jQ = $("#layersTabButton");

imagesTab_jQ = $("#imagesTab");
layersTab_jQ = $("#layersTab");



// Interact.js
interact('.draggable')
    .draggable({
        onmove: window.dragMoveListener,
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
    })
    .resizable({
        preserveAspectRatio: true,
        edges: { left: true, right: true, bottom: true, top: true },
        restrict: {
            restriction: "parent"
        }
    })
    .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style

        // prevent resizing an image smaller than 20x20 pixels
        if(event.rect.width > 20 && event.rect.width > 20){
            console.log(x +", " + y);
            target.style.width  = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
        
    });

function dragMoveListener (event) {
    var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;



$(document).ready(function() {
    imagesTabButton_jQ.click(function(){
        imagesTabButton_jQ.addClass("activeTabButton");
        imagesTabButton_jQ.removeClass("inactiveTabButton");
        layersTabButton_jQ.addClass("inactiveTabButton");
        layersTabButton_jQ.removeClass("activeTabButton");
        imagesTab_jQ.show();
        layersTab_jQ.hide();


    });
    layersTabButton_jQ.click(function(){
        layersTabButton_jQ.addClass("activeTabButton");
        layersTabButton_jQ.removeClass("inactiveTabButton");
        imagesTabButton_jQ.addClass("inactiveTabButton");
        imagesTabButton_jQ.removeClass("activeTabButton");
        layersTab_jQ.show();
        imagesTab_jQ.hide();
    });
});
