/* Global Variables */

imagesButton_jQ = $("#imagesButton");
layersButton_jQ = $("#layersButton");

imagesTab_jQ = $("#imagesTab");
layersTab_jQ = $("#layersTab");


$(document).ready(function() {
    imagesButton_jQ.click(function(){
        imagesTab_jQ.show();
        layersTab_jQ.hide();
    });
    layersButton_jQ.click(function(){
        layersTab_jQ.show();
        imagesTab_jQ.hide();
    });
});