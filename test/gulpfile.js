/**
 * Created by duongnhu on 24/02/15.
 */
var moreLess = require("../index")
var gulp = require("gulp")

gulp.task('test_less_more', function() {
    gulp.src("./css/*.less")
        .pipe(moreLess({less:true, more:true}))
        .pipe(gulp.dest("./build"))
})

gulp.task('test_different_path', function() {
    gulp.src("./*.less")
        .pipe(moreLess({less:true, more:true}))
        .pipe(gulp.dest("./build"))
})

gulp.task('test_src_map_inline', function() {
    gulp.src("./css/*.less")
        .pipe(moreLess({less:true,lessOpts: {sourceMap: true, sourceMapFileInline: true}}))
        .pipe(gulp.dest("./build"))
})

gulp.task('test_src_map_path', function() {
    gulp.src("./css/*.less")
        .pipe(moreLess({less:true,lessOpts: {sourceMap: true, sourceMapPath: "./build" }}))
        .pipe(gulp.dest("./build"))
})

gulp.task('default', ['test_less_more', 'test_src_map_inline', 'test_src_map_path'])