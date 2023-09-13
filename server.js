import express from 'express'
import cookieParser from 'cookie-parser'

import { missBugService } from './services/miss-bug.service.js'
import { loggerService } from './services/logger.service.js'
import { utilService } from './services/utils.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('miss-bug'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {

    const filterBy = {
        title: req.query.title || '',
        severity: +req.query.severity || 0,
        pageIdx: +req.query.pageIdx ? +req.query.pageIdx : undefined,
        label: req.query.label,
        sort: req.query.sort,
        dir: req.query.dir
    }
    console.log('filterBy:', filterBy)
    missBugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.post('/api/bug', (req, res) => {
    console.log('req.query:', req.body)

    const labels = ['critical', 'need-CR', 'dev-branch']
    const bug = {
        severity: +req.body.severity,
        title: req.body.title,
        description: req.body.description,
        label: labels[utilService.getRandomIntInclusive(0, labels.length)],
        cratedAt: Date.now(),
        creator: {
            _id: req.body.creator._id,
            fullname: req.body.creator.fullname
        }
    }
    missBugService.save(bug)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.put('/api/bug', (req, res) => {
    console.log('req.body:', req.body)
    const bug = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        label: req.body.label,
        cratedAt: req.body.cratedAt,
        updatedAt: Date.now(),
        creator: {
            _id: req.body.creator._id,
            fullname: req.body.creator.fullname
        }
    }
    missBugService.save(bug)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {

    let visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3) res.status(401).send('Wait for a bit');

    const bugId = req.params.bugId

    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId);
        res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 });
    }
    console.log(visitedBugs.length);
    console.log('visitedBugs:', visitedBugs)

    missBugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    console.log('bugId:', bugId)

    missBugService.remove(bugId)
        .then(() => {
            console.log(`bug ${bugId} removed!`);
            // res.redirect('/api/bug')
            res.send('Car removed successfully')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })

})

app.get('/api/user/:userId', (req, res) => {

    const { userId } = req.params

    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })
})

app.get('/api/user/profile/bug', (req, res) => {
    const { _id: loggedInUserId, fullname, score } = userService.validateToken(req.cookies.loginToken)

    if (!loggedInUserId) return res.status(401).send('Cannot get bugs')

    const bugs = utilService.readJsonFile('data/miss-bug.json')
    const userCreatedBugs = bugs.filter(bug => bug.creator._id === loggedInUserId)

    res.send(userCreatedBugs)
})

app.delete('/api/admin/:userId', (req, res) => {
    const userId = req.params.bugId

    userService.remove(userId)
        .then(() => {
            res.send('User removed successfully')
        })
        .catch((err) => {
            loggerService.error('Cannot remove user', err)
            res.status(400).send('Cannot remove user')
        })
})

app.get('/api/admin/user-list', (req, res) => {

    userService.getUsers()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot get users')
        })
})

app.get('/api/user/bug', (req, res) => {

    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })

})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.add(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout..')
})

const port = 5500
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

