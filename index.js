/**
 * Created by duongnhu on 24/02/15.
 */
var less = require("less")
var more = require("more-css")
var through = require("through2")
var wait = require("wait.for")
var File = require("vinyl")
var fs = require("fs")
var _ = require("lodash")
var path = require("path")
var gutil = require("gulp-util")
var cwd = process.cwd()
function lessWrapper(input, options, cb) {
    less.render(input, options, function (error, output) {
        if(error != undefined) {
            output = {error: error}
        }
        cb(null, output)
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
    return through.obj(function (file, enc, cb) {
        var content = file.contents.toString("utf8")
        var that = this
        function lessFiber(lessOpts, input) {
            process.chdir(path.dirname(file.path))
            var lessOutput = wait.for(lessWrapper, input, lessOpts)
            if (lessOutput.error != undefined) {
                that.push(file)
                var error = new gutil.PluginError('gulp-more-css error', lessOutput.error)
                process.chdir(cwd)
                cb(error, lessOutput)
                return
            }
            var output = lessOutput.css
            if (opts.more == true) {
                output = more.compress(output)
            }
            if(lessOutput.map != undefined) {
                if(lessOpts.sourceMapPath != undefined) {
                    var mapFileName = _.trimRight(lessOpts.sourceMapPath, "/") + "/" + file.relative.split(".")[0] + ".map"
                    fs.writeFileSync(mapFileName, lessOutput.map)
                }
            }
            file.contents = new Buffer(output, "utf8")
            that.push(createNewCssFile(file))
            process.chdir(cwd)
            cb()
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
                this.push(createNewCssFile(file))
                cb()
            }
        }
    })
}

module.exports = moreLess