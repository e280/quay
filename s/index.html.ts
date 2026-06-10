import {darkreaderDisable, favicon, html, socialCard, template, utf8, viewport} from "@e280/scute"

const domain = "quay.e280.org"
const faviconUrl = "/assets/favicon.png"

export default template(import.meta.url, async orb => {
	const version = await orb.packageVersion()

	return html`
		<!doctype html>
		<html>
			<head>
				${utf8()}
				${viewport()}
				${darkreaderDisable()}
				<title>Quay</title>
				${favicon(faviconUrl)}

				${socialCard({
					themeColor: "#eb6f1d",
					siteName: domain,
					title: "Quay - File-browser UI Framework",
					description: "Customizable outliner web ui toolkit for nested things",
					image: `https://${domain}${faviconUrl}`,
					url: `https://${domain}/`,
				})}

				<link rel="stylesheet" href="${orb.hashurl("demo/main.css")}"/>
				<script type="importmap">${orb.inject("$/x/importmap.json")}</script>
				<script type="module" src="${orb.hashurl("demo/main.bundle.min.js")}"></script>

				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/themes/dark.css"/>
				<!-- loading every shoelace component for now (should be cherry picked instead) -->
				<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/shoelace.js"></script>
			</head>
			<body>
				<header class=title>
					<img alt="" src="/assets/favicon.png"/>
					<div>
						<h1>Quay</h1>
						<span class=version>v${version}</span>
					</div>
				</header>

				<div class=components>
					<div class="component dropzone">
						<h4>quay-dropzone</h4>
						<quay-dropzone></quay-dropzone>
					</div>

					<div class="component outliner">
						<h4>quay-outliner</h4>
						<quay-outliner></quay-outliner>
					</div>

					<div class="component searchbar">
						<h4>quay-searchbar</h4>
						<quay-searchbar></quay-searchbar>
					</div>

					<div class="component breadcrumb">
						<h4>quay-breadcrumb</h4>
						<quay-breadcrumb></quay-breadcrumb>
					</div>

					<div class="component filter">
						<h4>quay-filter</h4>
						<quay-filter></quay-filter>
					</div>

					<div class="component sort">
						<h4>quay-sort</h4>
						<quay-sort></quay-sort>
					</div>

					<div class="component browser">
						<h4>quay-browser</h4>
						<quay-browser></quay-browser>
					</div>
				</div>
			</body>
		</html>
	`
})

