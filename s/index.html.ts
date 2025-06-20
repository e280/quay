import "@benev/slate/x/node.js"
import {template, html, easypage, headScripts, git_commit_hash, read_file, renderSocialCard, read_json} from "@benev/turtle"

const domain = "quay.e280.org"
const favicon = "/assets/favicon.png"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()
	const version = (await read_json("package.json")).version as string

	return easypage({
		path,
		dark: true,
		title: "Quay",
		css: "demo/main.css",
		head: html`
			<link rel="icon" href="${favicon}"/>
			<meta data-commit-hash="${hash}"/>

			${renderSocialCard({
				themeColor: "#eb6f1d",
				siteName: domain,
				title: "Quay — File-browser UI Framework",
				description: "Customizable outliner web ui toolkit for nested things",
				image: `https://${domain}${favicon}`,
				url: `https://${domain}/`,
			})}

			${headScripts({
				devModulePath: await path.version.root("demo/main.bundle.js"),
				prodModulePath: await path.version.root("demo/main.bundle.min.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}

			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/themes/dark.css" />
			<!-- loading every sholeace component for now (should be cherry picked instead) --!>
			<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/shoelace.js" ></script>
		`,
		body: html`
			<header class=title>
				<img alt="" src="/assets/favicon.png"/>
				<div>
					<h1>Quay</h1>
					<span class=version>v${version}</span>
				</div>
			</header>

			<div class=components>

				<div class="component dropzone">
					<h4>quay-dropzone</h2>
					<quay-dropzone></quay-dropzone>
				</div>

				<div class="component outliner">
					<h4>quay-outliner</h2>
					<quay-outliner></quay-outliner>
				</div>

				<div class="component searchbar">
					<h4>quay-searchbar</h2>
					<quay-searchbar></quay-searchbar>
				</div>

				<div class="component breadcrumb">
					<h4>quay-breadcrumb</h2>
					<quay-breadcrumb></quay-breadcrumb>
				</div>

				<div class="component filter">
					<h4>quay-filter</h2>
					<quay-filter></quay-filter>
				</div>

				<div class="component sort">
					<h4>quay-sort</h2>
					<quay-sort></quay-sort>
				</div>

				<div class="component browser">
					<h4>quay-browser</h2>
					<quay-browser></quay-browser>
				</div>

			</div>
		`,
	})
})
