import "@benev/slate/x/node.js"
import {template, html, easypage, headScripts, git_commit_hash, read_file, renderSocialCard} from "@benev/turtle"

const domain = "quay.com"
const favicon = "/assets/favicon.png"

export default template(async basic => {
	const path = basic.path(import.meta.url)
	const hash = await git_commit_hash()

	return easypage({
		path,
		dark: true,
		title: "Quay",
		css: "demo/main.css",
		head: html`
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/themes/dark.css" />
			<!-- loading every sholeace component for now (should be cherry picked instead) --!>
			<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/shoelace.js" ></script>
			<link rel="icon" href="${favicon}"/>
			<meta data-commit-hash="${hash}"/>

			${renderSocialCard({
				themeColor: "#8800ff",
				siteName: "Quay",
				title: "Quay – outliner",
				description: "",
				image: `https://${domain}${favicon}`,
				url: `https://${domain}/`,
			})}

			${headScripts({
				devModulePath: await path.version.root("demo/main.bundle.js"),
				prodModulePath: await path.version.root("demo/main.bundle.min.js"),
				importmapContent: await read_file("x/importmap.json"),
			})}
		`,
		body: html`
			<h1 class=title>
				<span>Quay</span>
			</h1>

			<quay-outliner></quay-outliner>
		`,
	})
})
