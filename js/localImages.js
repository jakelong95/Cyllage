var layers = {id:0, imgs:[]};

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
        if ( (/\.(png)$/i).test(files[0].name) ) {
            if(files[0].size < 50000) uploadLocalImg( files[0]);
            else errors += files[0].name +" is to large\n";
        } else {
            errors += files[0].name +" Unsupported Image extension\n";
        }
    }

    if(errors != "") console.log(errors);
    return false;
});


var removeOldImages = function() {
    localStorage.removeItem("images");
    localStorage.setItem("images", JSON.stringify([]));
};

var uploadLocalImg = function (file) {
    var reader = new FileReader();
    reader.addEventListener("load", function () {
            var imgArray = new Array();

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
        imgString += "draggable='true'>";
        $("#sideBarImgs").append(imgString);
    });
};

$(document).on("dragstart", ".sideBarImage", function (ev) {
    ev.originalEvent.dataTransfer.setData("src", ev.target.src);
});

$("#canvasDiv").on("drop", function (ev) {
    ev.preventDefault();
    var src = ev.originalEvent.dataTransfer.getData("src");
    if(src == "") return;
    var canvasImg = new Image();
    var layoutImg = new Image();
    canvasImg.addEventListener("load", function () {
        var id = layers["id"]++;
        canvasImg.id = "canvasImg-" + id;
        canvasImg.className = "draggable canvas-img";
        canvasImg.style.position = "absolute";
        canvasImg.style.zIndex = id;
        layers["imgs"][layers["imgs"].length] = canvasImg.id;
        //$("#canvasDiv").append("<canvas id='canvas-" + img.id + "'></canvas>");
       // document.getElementById("canvas-" + img.id).getContext("2d").drawImage(img, 0, 0);
       $("#canvasDiv").append(canvasImg);
    });

    layoutImg.addEventListener("load", function () {
        var id = layers["id"] - 1;
        layoutImg.id = "layoutImg-" + id;
        layoutImg.className = "layout-img";
        $("#layerImgs").prepend("<tr id='layout-panel-" + id + "' class='layout-panel'><td>" +
            "<button id='delete-" + layoutImg.id + "' type='button' class='deleteBtn'>X</button></td></tr>");
        $("#layout-panel-" + id + " td:first-child").prepend(layoutImg);
        selectImg(id);
    });

    canvasImg.src = src;
    layoutImg.src = src;
    
}).on("dragover", function (ev) {
    ev.preventDefault();
});

$(document.body).on("mousedown", ".canvas-img", function (event) {
    var img = event.target;
    selectImg(img.id.split("-")[1]);
});

$("#back1Button").click(function () {
    if(layers["imgs"].length > 1)
    {
        var selectedImg = $(".canvas-img.active");
        var id = selectedImg.attr("id");
        var idNum = id.split("-")[1];
        var curZ = selectedImg.css("z-index");
        var index = layers["imgs"].indexOf(id);
        if(index != 0)
        {
            var tempId = layers["imgs"][index - 1];
            var prevIdNum = tempId.split("-")[1];
            var tempImg = $("#" + tempId);
            var tempZ = tempImg.css("z-index");
            layers["imgs"][index - 1] = id;
            layers["imgs"][index] = tempId;
            selectedImg.css("z-index", tempZ);
            tempImg.css("z-index", curZ);
            var row = document.getElementById("layout-panel-" + idNum);
            var tempRow = document.getElementById("layout-panel-" + prevIdNum);
            var table = row.parentNode;
            table.insertBefore(tempRow, row);
        }
    }
});

var selectImg = function (imgID) {
    var selectedImg = $(".canvas-img.active");
    var selectedRow = $(".layout-panel.active");
    var img = $("#canvasImg-" + imgID);
    var row = $("#layout-panel-" + imgID);
    selectedImg.removeClass("active");
    selectedRow.removeClass("active");
    img.addClass("active");
    row.addClass("active");
};

$("#forward1Button").on("click", function () {
    if(layers["imgs"].length > 1) {
        var selectedImg = $(".canvas-img.active");
        var id = selectedImg.attr("id");
        var idNum = id.split("-")[1];
        var curZ = parseInt(selectedImg.css("z-index"));
        var index = layers["imgs"].indexOf(id);
        if (id != layers["imgs"][layers["imgs"].length - 1]) {
            var tempId = layers["imgs"][index + 1];
            var prevIdNum = tempId.split("-")[1];
            var tempImg = $("#" + tempId);
            var tempZ = tempImg.css("z-index");
            layers["imgs"][index + 1] = id;
            layers["imgs"][index] = tempId;
            selectedImg.css("z-index", tempZ);
            tempImg.css("z-index", curZ);
            var row = document.getElementById("layout-panel-" + idNum);
            var tempRow = document.getElementById("layout-panel-" + prevIdNum);
            var table = row.parentNode;
            table.insertBefore(row, tempRow);
        }
    }
});

var resizePlusInt;
$("#resizePlusButton").mousedown(function () {
    resizePlus();
    resizePlusInt = setInterval("resizePlus()", 50);
}).mouseup(function () {
    clearInterval(resizePlusInt);
}).mouseout(function () {
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
}).mouseout(function () {
    clearInterval(resizeMinusInt);
});

var resizeMinus = function () {
    var img = $(".canvas-img.active");
    img.height((img.height() - 1));
    img.width((img.width() - 1));
};

$("#moveToBackButton").on("click", function () {
    if(layers["imgs"].length > 1) {
        var selectedImg = $(".canvas-img.active");
        var id = selectedImg.attr("id");
        var idNum = id.split("-")[1];
        if (id != layers["imgs"][0]) {
            var frontZ = $("#" + layers["imgs"][0]).css("z-index");
            selectedImg.css("z-index", frontZ - 1);
            var tempLayer = layers["imgs"][0];
            for (var i = 1; i <= layers["imgs"].indexOf(id); i++) {
                var temp = layers["imgs"][i];
                layers["imgs"][i] = tempLayer;
                tempLayer = temp;
            }
            layers["imgs"][0] = id;
            var row = document.getElementById("layout-panel-" + idNum);
            var table = row.parentNode;
            table.insertBefore(row, null);
        }
    }
});

$("#moveToFrontButton").on("click", function () {
    if(layers["imgs"].length > 1) {
        var selectedImg = $(".canvas-img.active");
        var id = selectedImg.attr("id");
        var idNum = id.split("-")[1];
        if (id != layers["imgs"][layers["imgs"].length - 1]) {
            var backZ = parseInt($("#" + layers["imgs"][layers["imgs"].length - 1]).css("z-index"));
            selectedImg.css("z-index", backZ + 1);
            for (var i = layers["imgs"].indexOf(id); i < layers["imgs"].length - 1; i++) {
                layers["imgs"][i] = layers["imgs"][i + 1];
            }
            layers["imgs"][layers["imgs"].length - 1] = id;
            var row = document.getElementById("layout-panel-" + idNum);
            var table = row.parentNode;
            table.insertBefore(row, table.firstChild);
        }
    }
});

$(document).on("click", ".deleteBtn", function (event) {
    event.stopPropagation();
    var delBtn = event.target;
    var idNum = $(delBtn).attr("id").split("-")[2];
    deleteImg(idNum);
});

var deleteImg = function (idNum) {
    var index = layers["imgs"].indexOf("canvasImg-" + idNum);
    layers["imgs"].splice(index, 1);
    $("#canvasImg-" + idNum).remove();
    $("#layout-panel-" + idNum).remove();
};

$(document).on("click", ".layout-panel", function (event) {
    var tr = $(event.target);
    while(!tr.is("tr"))
    {
        tr = tr.parent();
    }
    var id = $(tr).attr("id").split("-")[2];
    selectImg(id);
});

$(document).on("dragstart", ".layout-img", function (ev) {
    ev.originalEvent.dataTransfer.setData("id", ev.target.id);
});

$(document).on("drop", ".layout-panel", function (ev) {
    ev.preventDefault();
    var tr = $(event.target);
    while(!tr.is("tr"))
    {
        tr = tr.parent();
    }
    var tempIdNum = tr.attr("id").split("-")[2];
    var id = ev.originalEvent.dataTransfer.getData("id");
    var idNum = id.split("-")[1];
    var row = document.getElementById("layout-panel-" + idNum);
    var tempRow = document.getElementById("layout-panel-" + tempIdNum);
    var table = row.parentNode;
    if($(row).index() < $(tempRow).index())
    {
        table.insertBefore(row, tempRow.nextSibling);
        moveImgBehind(idNum, tempIdNum);
    }
    else {
        table.insertBefore(row, tempRow);
        moveImgAhead(idNum, tempIdNum);
    }
}).on("dragover", function (ev) {
    ev.preventDefault();
});

var moveImgAhead = function (toMove, where) {
    var toMoveIndex = layers["imgs"].indexOf("canvasImg-" + toMove);
    var whereIndex = layers["imgs"].indexOf("canvasImg-" + where);
    var z = $("#" + layers["imgs"][toMoveIndex]).css("z-index");
    for(var i = toMoveIndex; i < whereIndex; i++)
    {
        var img = $("#" + layers["imgs"][i + 1]);
        var tempZ = img.css("z-index");
        img.css("z-index", z);
        z = tempZ;
        layers["imgs"][i] = layers["imgs"][i + 1];

    }
    layers["imgs"][whereIndex] = "canvasImg-" + toMove;
    $("#" + layers["imgs"][whereIndex]).css("z-index", z);
};

var moveImgBehind = function (toMove, where) {
    var toMoveIndex = layers["imgs"].indexOf("canvasImg-" + toMove);
    var whereIndex = layers["imgs"].indexOf("canvasImg-" + where);
    var tempRow = layers["imgs"][toMoveIndex];
    var lastZ = $("#" + tempRow).css("z-index");
    for (var i = whereIndex; i <= toMoveIndex; i++) {
        var temp = layers["imgs"][i];
        var z = $("#" + temp).css("z-index");
        layers["imgs"][i] = tempRow;
        $("#" + layers["imgs"][i]).css("z-index", z);
        tempRow = temp;
    }
    $("#" + layers["imgs"][toMoveIndex]).css("z-index", lastZ);
};

$("#doneButton").click(function() {
    var getCollage = function(sessionID) {
        //TODO Instead of 1024 put whatever the user wanted
        $.get("http://localhost:3000/collage?session=" + sessionID + "&width=1024&height=1024", function(data) {
            var imageData = JSON.parse(data).image;
            var download = document.createElement("a");
            download.setAttribute("href", "data:image/png;base64," + imageData);
            download.setAttribute("download", "collage.png");
            download.style.display = "none";
            document.body.appendChild(download);
            download.click();
            document.body.removeChild(download);
        });
    };
    
    var sendImages = function(sessionID) {
        var numSent = 0;
        
      
        for(var i = 0; i < layers.imgs.length; i++)
        {
            var image = $("#" + layers.imgs[i]);
            var toSend = {
                sessionID: sessionID,
                image: image.attr("src"),
                operations: {
                    crop: {x1: -1, x2: -1, y1: -1, y2: -1},
                    layer: image.css("z-index"),
                    size: {w: image.width(), h: image.height()},
                    pos: {x: image.position().left, y: image.position().top}
                }
            };

            $.post("http://localhost:3000/images", toSend, function(data) {
                numSent++;
                if(numSent >= layers.imgs.length)
                {
                    setTimeout(500, getCollage(sessionID));  
                }
            });
        }
    };
    
    $.get("http://localhost:3000/start", function(data) {
        sendImages(data.id);
    });
});


var rotateCWInt;
$("#rotateButtonPlus").mousedown(function () {
    rotateClockWise();
    rotateCWInt = setInterval("rotateClockWise()", 30);
}).mouseup(function () {
    clearInterval(rotateCWInt);
}).mouseout(function () {
    clearInterval(rotateCWInt);
});

var rotateClockWise = function () {
    var selectedImg = $(".canvas-img.active");
    if(selectedImg == null) return;
    var r = (parseFloat(selectedImg.attr('data-r')) || 0) + 1;
    var x = (parseFloat(selectedImg.attr('data-x')) || 0);
    var y = (parseFloat(selectedImg.attr('data-y')) || 0);
    var transform = 'translate(' + x + 'px, ' + y  + 'px) rotate(' + r + 'deg)';
    selectedImg.css("transform", transform);
    selectedImg.attr("data-r", r);
};

var rotateCCWInt;
$("#rotateButtonMinus").mousedown(function () {
    rotateCounterClockWise();
    rotateCCWInt = setInterval("rotateCounterClockWise()", 30);
}).mouseup(function () {
    clearInterval(rotateCCWInt);
}).mouseout(function () {
    clearInterval(rotateCCWInt);
});

var rotateCounterClockWise = function () {
    var selectedImg = $(".canvas-img.active");
    if(selectedImg == null) return;
    var r = (parseFloat(selectedImg.attr('data-r')) || 0) - 1;
    var x = (parseFloat(selectedImg.attr('data-x')) || 0);
    var y = (parseFloat(selectedImg.attr('data-y')) || 0);
    var transform = 'translate(' + x + 'px, ' + y  + 'px) rotate(' + r + 'deg)';
    selectedImg.css("transform", transform);
    selectedImg.attr("data-r", r);
};