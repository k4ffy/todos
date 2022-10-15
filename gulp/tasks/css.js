import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer';
import gcmq from 'gulp-group-css-media-queries';
import replace from 'gulp-replace';
import sourcemaps from 'gulp-sourcemaps';

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "SCSS",
				message: "Error: <%= error.message %>"
			})
		))
		.pipe(
			app.plugins.if(
				app.isDev,
				sourcemaps.init()
			)
		)
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(
			app.plugins.if(
				app.isBuild,
				gcmq()
			)
		)
		// .pipe(
		// 	app.plugins.if(
		// 		app.isBuild,
		// 		webpcss({
		// 			webpClass: ".webp",
		// 			noWebpClass: ".no-webp"
		// 		})
		// 	)
		// )
		.pipe(
			app.plugins.if(
				app.isBuild,
				autoprefixer({
					grid: true,
					overrideBrowserslist: ["last 3 versions"],
					cascade: true
				})
			)
		)
		.pipe(
			app.plugins.if(
				app.isBuild,
				cleanCss()
			)
		)
		.pipe(rename({
			basename: "style",
			extname: ".min.css"
		}))
		.pipe(
			app.plugins.if(
				app.isDev,
				sourcemaps.write('./maps')
			)
		)

		// Исправляет ошибку gulp-group-css-media-queries
		// из-за которой в ссылке на Google Font добавлялся
		// пробел, из-за которого шрифт переставал загружаться
		.pipe(
			replace(/family=\w+\:\w+\@\d+;.+\)/g, (match) => match.replaceAll(/00; /g, '00;'))
		)

		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.browsersync.stream())
} 