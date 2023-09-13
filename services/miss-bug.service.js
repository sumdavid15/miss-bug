import fs from 'fs'
import { utilService } from "./utils.service.js";

export const missBugService = {
    query,
    getById,
    remove,
    save
}

// const PAGE_SIZE = 5
const bugs = utilService.readJsonFile('data/miss-bug.json')

function _sortBy(type) {
    console.log('_sortBy type:', type)

    const sortType = {
        title: function (bugs, dir) {
            if (dir === 'true') {
                bugs.sort((a, b) => a.title.localeCompare(b.title))
            } else {
                bugs.sort((a, b) => b.title.localeCompare(a.title))
            }
        },
        severity: function (bugs, dir) {
            if (dir === 'true') {
                console.log('dir true severity');
                bugs.sort((a, b) => b.severity - a.severity)
            } else {
                console.log('dir false severity');
                bugs.sort((a, b) => a.severity - b.severity)
            }
        },
        created: function (bugs, dir) {
            if (dir === 'true') {
                console.log('dir true created');
                bugs.sort((a, b) => b.cratedAt - a.cratedAt)
            } else {
                console.log('dir false created');
                bugs.sort((a, b) => a.cratedAt - b.cratedAt)
            }
        },
    }
    return sortType[type]
}

function query(filterBy) {
    const { title, severity, pageIdx, label, sort, dir } = filterBy

    let filteredBugs = [...bugs]

    if (title) {
        const regExp = new RegExp(title, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }
    if (severity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= severity)
    }
    if (pageIdx !== undefined) {
        const startIdx = pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }
    if (label) {
        filteredBugs = filteredBugs = filteredBugs.filter(bug => bug.label.includes(label))
    }
    if (sort) _sortBy(sort)(filteredBugs, dir)

    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currbug => currbug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/miss-bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}