const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/world/luiz-inacio-lula-da-silva',
        base: '',
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/search?query=lula',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/search?source=nav-desktop&q=lula',
        base: 'https://www.thetimes.co.uk',
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Lula")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })

            })
        })
})

app.get('/', (req, res) => {
    res.json("Welcome to my Lula's Latest World News API")
})

app.get('/news', (req, res) => {
    res.json(articles)
})


app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Lula")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
