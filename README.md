# gulp-more-less
more-css and less are bundled into this gulp plugin.

**Less** provides more flexible syntax than the traditional CSS syntax. Less's documentations and tutorials can be found here:  http://lesscss.org/

**more-css** is a minifying css tool. It by far has the best performance among other minifying tools. Benhcmark can be found here: http://goalsmashers.github.io/css-minification-benchmark/

## Syntax
```javascript
moreLess({
  [less],
  [lessOpts: { [sourceMap], [sourceMapPath], [sourceMapFileInline] },
  [more]]
  })
```
If you do not pass any argument, the plug-in does nothing.
### less: boolean
If true, the content of the file will be compiled with less compiler.

### more: boolean
If true, the content of the file will be minified with more-css.

### lessOpts
This defines some options for __Less__.

##### sourceMap: boolean
If true, the plugin will produce the soure map.

##### sourceMapPath: String
This is the directory to save the source map files.

##### sourceMapFileInline
Set to true if you want to put the source map inside the output css file.

## Usage
```javascript
var moreLess = require("gulp-more-less")
var gulp = require("gulp")

gulp.task('test_less_more', function() {
    gulp.src("demo.less")
        .pipe(moreLess({less:true, more:true}))
        .pipe(gulp.dest("./build"))
})

gulp.task('test_src_map_inline', function() {
    gulp.src("demo.less")
        .pipe(moreLess({less:true,lessOpts: {sourceMap: true, sourceMapFileInline: true}}))
        .pipe(gulp.dest("./build"))
})

gulp.task('test_src_map_path', function() {
    gulp.src("demo.less")
        .pipe(moreLess({less:true,lessOpts: {sourceMap: true, sourceMapPath: "./build" }}))
        .pipe(gulp.dest("./build"))
})
```
