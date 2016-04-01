/* Global Variables */

myImagesButton_jQ = $("#myImagesButton");
layersButton_jQ = $("#layersButton");

myImagesTab_jQ = $("#myImagesTab");
layersTab_jQ = $("#layersTab");


$(document).ready(function() {
    myImagesButton_jQ.click(function(){
        myImagesTab_jQ.show();
        layersTab_jQ.hide();
    });
    layersButton_jQ.click(function(){
        layersTab_jQ.show();
        myImagesTab_jQ.hide();
    });
});