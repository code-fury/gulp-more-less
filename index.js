/**
 * Created by duongnhu on 24/02/15.
 */
var less = require("less")
var more = require("more-css")
var map = require("map-stream")
var wait = require("wait.for")
var File = require("vinyl")
var fs = require("fs")
var _ = require("lodash")
function lessWrapper(input, options, cb) {
    less.render(input, options, function (error, output) {
        cb(error, output)
    })
}

function createNewCssFile(file) {
    return new File({
        cwd: file.cwd,
        base: file.base,
        path: file.base + "/" + file.relative.split(".")[0] + ".css",
        contents: file.contents
    })
}

var moreLess = function (opts) {
    var options = (opts == undefined) ? {} : opts
    return map(function (file, cb) {
        var content = file.contents.toString("utf8")
        function lessFiber(lessOpts, input) {
            var lessOutput = wait.for(lessWrapper, input, lessOpts)
            var output = lessOutput.css
            if (opts.more == true) {
                output = more.compress(output)
            }
            if(lessOutput.map != undefined) {
                if(lessOpts.sourceMapPath != undefined) {
                    console.log(lessOpts.sourceMapPath)
                    var mapFileName = _.trimRight(lessOpts.sourceMapPath, "/") + "/" + file.relative.split(".")[0] + ".map"
                    fs.writeFileSync(mapFileName, lessOutput.map)
                }
            }
            file.contents = new Buffer(output, "utf8")
            cb(null, createNewCssFile(file))
        }
        if (options.less === true) {
            var inputOpts = (opts.lessOpts == undefined )? {} : opts.lessOpts
            var lessOpts = {}
            if(inputOpts.sourceMap === true) {
                lessOpts.sourceMap = (inputOpts.sourceMapFileInline === true)? {sourceMapFileInline: true} : {}
                if(inputOpts.sourceMapPath != undefined) {
                    lessOpts.sourceMapPath = inputOpts.sourceMapPath
                }
            }
            wait.launchFiber(lessFiber, lessOpts, content)
        } else {
            if (options.more == true) {
                var output = more.compress(content)
                file.contents = new Buffer(output, "utf8")
                cb(null, createNewCssFile(file))
            }
        }
    })
}

module.exports = moreLess