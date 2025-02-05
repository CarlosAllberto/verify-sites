import axios from 'axios'
import * as cheerio from 'cheerio'
import fs from 'fs'

fs.readFile('./sites.txt', 'utf-8', (err: any, data: any) => {
	if (err) { return console.error(err) }
	
	data.split(/\r?\n/).forEach((url:any) => {
		if (url != '') {
			axios
				.get(`https://${url.replace('https://', '').replace('http://', '')}`)
				.then(async response => {
					let srcList: any = []

					if (response.data.indexOf('e-con-inner') == -1 || response.data.indexOf('container') == -1) {
						console.log(`[!] ${url}: OFFLINE`)
						return console.log()
					}

					console.log(`[+] ${url}`)

					const $ = cheerio.load(response.data)
					$('script').each((index, element) => {
						let src = $(element).attr('src')?.replace('https://', '').replace('http://', '')

						if (typeof src === 'string') {
							if (src?.indexOf('/wp-content/themes') != -1)
								console.log(`[i] THEME: ${src?.split('/')[3]}`)
							if (src?.indexOf('/wp-content/plugins') != -1) {
								let theme = src?.split('/')[3]
								if (srcList.indexOf(theme) == -1) srcList.push(theme)
							}
						}
					})

					srcList.forEach((theme: any) => console.log(`[i] PLUGIN: ${theme}`))
					console.log()
				})
				.catch(err => {
					console.log(`[!] DOMÍNIO NÃO ENCONTRADO: ${url}`)
					console.log()
				})
		}
	})
})
