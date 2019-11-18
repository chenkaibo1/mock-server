import { pathToRegexp } from 'path-to-regexp'
const reg = pathToRegexp('/mock/:projectId(.{24})/:mockURL*')
console.log(reg)
