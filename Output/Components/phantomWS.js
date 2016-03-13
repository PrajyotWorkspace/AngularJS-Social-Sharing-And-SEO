
var system = require('system');
var server = require('webserver').create();
var fs = require('fs');

//Port to listen on server
var port = parseInt(system.args[1]);

//http://localhost
var host = system.args[2];

//where to create the log ?
var logPath = system.args[3]

//should ceate snapshoots
var createSnapshoots = parseInt(system.args[4]);

var sanpshootLocation = system.args[5];

//local log file
var logFile = "log.txt";


phantom.outputEncoding = "utf8";

var gererateDateTime = function() {
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth() + 1) + "/"
                    + currentdate.getFullYear() + " @ "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();

    return datetime;
}


var getFixedUrl = function(s) {
    s = s.replace('?escaped_fragment_=', '');
    return host + s;
}

var writeLog = function (message, messageType) {
    if (!messageType) {
        messageType = 'INFO';
    }
    fs.write(logPath + logFile,gererateDateTime() + ' ' + messageType + ' : ' + message + '\r\n', 'a');
}

var renderHtml = function (url, cb) {

    var page = require('webpage').create();
    page.settings.loadImages = false;
    page.settings.localToRemoteUrlAccessEnabled = true;
	page.settings.encoding = "utf8";
	
   var settings = {
			headers: {
			"Content-Type": "text/html;charset=utf-8"
		},
		encoding: "utf8"
	};
    page.onCallback = function() {
        cb(page.content);
        page.close();
    };

    page.onInitialized = function() {
       page.evaluate(function() {
            setTimeout(function() {
                window.callPhantom();
            }, 5000);
        });
    };

    page.open(url, settings);
};

server.listen(port, function (request, response) {
    try{
        var url = getFixedUrl(request.url);
        writeLog(url);
        var snapFileFullPath = sanpshootLocation + encodeURIComponent(url) + '.html';

        if (fs.exists(snapFileFullPath) && createSnapshoots > 0) {
            var html = fs.read(snapFileFullPath);
            response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
            response.setEncoding('utf-8');
            writeLog('successfully - from snapshoots :' + request.url);
            response.write(html);
            response.close();
        }
        else {
            renderHtml(url, function (html) {
                if (!fs.exists(snapFileFullPath) && createSnapshoots > 0) {
                    fs.write(snapFileFullPath, html, 'w');
                }
                response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
                response.setEncoding('utf-8');
                writeLog('successfully :' + request.url);
                response.write(html);
                response.close();
            });
        }
    }
    catch (ex) {
        writeLog(ex, 'ERROR');
        response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
        response.setEncoding('utf-8');
        response.write(ex);
        response.close();
    }
});





writeLog("Listen on port : " + port);