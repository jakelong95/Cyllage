var layers = [];

$(document).ready(function () {
    removeOldImages();
    updateLocalImgs();
});

$("#uploadImg").on( "change", function (event) {
    var input = event.target;
    var files = input.files;
    var errors = "";
    if (!files) {
        errors += "File upload not supported by your browser.";
    }

    if (files && files[0]) {
        if ( (/\.(png|jpeg|jpg|gif)$/i).test(files[0].name) ) {
            uploadLocalImg( files[0]);
        } else {
            errors += files[0].name +" Unsupported Image extension\n";
        }
    }

    console.log(errors);
    return false;
});


var removeOldImages = function() {
    localStorage.removeItem("images");
    localStorage.setItem("images", JSON.stringify([]));
};

var uploadLocalImg = function (file) {
    var reader = new FileReader();
    reader.addEventListener("load", function () {
            var imgArray = [];

            if(localStorage.getItem("images") != null)
            {
                imgArray = JSON.parse(localStorage.getItem("images"));
            }

            imgArray.push(reader.result);
            localStorage.setItem("images", JSON.stringify(imgArray));

            updateLocalImgs();
    });

    reader.readAsDataURL(file);
};

var updateLocalImgs = function () {
    var images = JSON.parse(localStorage.getItem("images"));
    $("#sideBarImgs").html("");
    images.forEach(function (img) {
        var imgString = "<img class='sideBarImage' src='" + img + "' ";
        imgString += "draggable='true' ondragstart='sideBarImgDrag(event)'>";
        $("#sideBarImgs").append(imgString);
    });
};

var sideBarImgDrag = function (ev) {
    ev.dataTransfer.setData("src", ev.target.src);
};

$("#canvasDiv").on("drop", function (ev) {
    ev.preventDefault();
    var src = ev.originalEvent.dataTransfer.getData("src");
    var img = new Image();
    img.addEventListener("load", function () {
        img.id = "canvasImg-" + layers.length;
        img.className = "draggable canvas-img";
        img.style.position = "absolute";
        img.style.zIndex = layers.length;
        layers[layers.length] = img.id;
        console.log(layers);
        //$("#canvasDiv").append("<canvas id='canvas-" + img.id + "'></canvas>");
       // document.getElementById("canvas-" + img.id).getContext("2d").drawImage(img, 0, 0);
       $("#canvasDiv").append(img);
        selectImg(img.id);
    });
    img.src = src;
}).on("dragover", function (ev) {
    ev.preventDefault();
});

$(document.body).on("mousedown", ".canvas-img", function (event) {
    var img = event.target;
    selectImg(img.id);
});

$("#back1Button").click(function () {
    var selectedImg = $(".canvas-img.active");
    var id = selectedImg.attr("id");
    var curZ = selectedImg.css("z-index");
    var index = layers.indexOf(id);
    console.log(index);
    if(layers.length > 1 && index != 0)
    {
        console.log("hello");
        var tempId = layers[index - 1];
        var tempImg = $("#" + tempId);
        var tempZ = tempImg.css("z-index");
        layers[index - 1] = id;
        layers[index] = tempId;
        selectedImg.css("z-index", tempZ);
        tempImg.css("z-index", curZ);
    }
});

var selectImg = function (imgID) {
    var selectedImg = $(".canvas-img.active");
    var img = $("#" + imgID);
    selectedImg.css({"border":"", "border-color": ""});
    selectedImg.removeClass("active");
    img.css({"border":"dashed 2px", "border-color": "blue"});
    img.addClass("active");
};

$("#forward1Button").on("click", function () {
    var selectedImg = $(".canvas-img.active");
    var id = selectedImg.attr("id");
    var curZ = parseInt(selectedImg.css("z-index"));
    var index = layers.indexOf(id);
    if(layers.length > 1 &&  id != layers[layers.length - 1])
    {
        var tempId = layers[index + 1];
        var tempImg = $("#" + tempId);
        var tempZ = tempImg.css("z-index");
        layers[index + 1] = id;
        layers[index] = tempId;
        selectedImg.css("z-index", tempZ);
        tempImg.css("z-index", curZ);
    }
});

var resizePlusInt;
$("#resizePlusButton").mousedown(function () {
    resizePlus();
    resizePlusInt = setInterval("resizePlus()", 50);
}).mouseup(function () {
    clearInterval(resizePlusInt);
});

var resizePlus = function () {
    var img = $(".canvas-img.active");
    img.height((img.height() + 1));
    img.width((img.width() + 1));
};

var resizeMinusInt;
$("#resizeMinusButton").mousedown(function () {
    resizeMinus();
    resizeMinusInt = setInterval("resizeMinus()", 50);
}).mouseup(function () {
    clearInterval(resizeMinusInt);
});

var resizeMinus = function () {
    var img = $(".canvas-img.active");
    img.height((img.height() - 1));
    img.width((img.width() - 1));
};

$("#moveToBackButton").on("click", function () {
    var selectedImg = $(".canvas-img.active");
    var id = selectedImg.attr("id");
    if(layers.length > 1 && id != layers[0])
    {
        var frontZ = $("#" + layers[0]).css("z-index");
        selectedImg.css("z-index", frontZ - 1);
        var tempLayer = layers[0];
        for(var i = 1; i <= layers.indexOf(id); i++)
        {
            var temp = layers[i];
            layers[i] = tempLayer;
            tempLayer = temp;
        }
        layers[0] = id;
    }
});

$("#moveToFrontButton").on("click", function () {
    var selectedImg = $(".canvas-img.active");
    var id = selectedImg.attr("id");
    if(layers.length > 1 && id != layers[layers.length - 1])
    {
        var backZ = parseInt($("#" + layers[layers.length - 1]).css("z-index"));
        selectedImg.css("z-index", backZ + 1);
        for(var i = layers.indexOf(id); i < layers.length - 1; i++)
        {
            layers[i] = layers[i+1];
        }
        layers[layers.length - 1] = id;
    }
});


