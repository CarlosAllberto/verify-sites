import * as cheerio from 'cheerio'
import fs from 'fs'

fs.readFile('./sites.txt', 'utf-8', (err, data) => {
	if (err) {
		return console.error(err)
	}

	data.split(/\r?\n/).forEach((url: string) => {
		if (url != '') {
			fetch(url)
				.then(async response => await response.text())
				.then(async data => {
					let theme = ''
					let pluginList: Array<string> = []

					const $ = cheerio.load(data)

					if (!$('.elementor-element')) {
						return console.log(`[!] ${url}: OFFLINE\n`)
					}
					console.log(`[+] ${url}`)

					$('script').each((index, element) => {
						let src = $(element).attr('src')?.replace('https://', '').replace('http://', '')

						if (!src) return
						if (src?.indexOf('/wp-content/themes') != -1) theme = src?.split('/')[3]

						if (src?.indexOf('/wp-content/plugins') != -1) {
							let plugin = src?.split('/')[3]
							if (pluginList.indexOf(plugin) == -1) pluginList.push(plugin)
						}
					})

					pluginList.forEach((plugin: string) => console.log(`[i] PLUGIN: ${plugin}`))
					console.log(`[i] THEME: ${theme}\n`)
				})
				.catch(err => console.log(`[!] DOMÍNIO NÃO ENCONTRADO: ${url}\n ${err}`))
		}
	})
})
