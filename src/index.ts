// @ts-nocheck
import { getCommandParams, postError } from './utils'
import { publishTranslate } from './translate'
import { authorizeUser } from './git'
import { getInput } from '@actions/core'
import { readdir } from 'fs/promises'
import { getDirectories } from './utils'

async function main() {
  const isAuthorized = await authorizeUser()
  if (!isAuthorized) {
    await postError('You have no permission to use this bot.')
  }

  // Array of languages set in action workflow
  const languages = getInput('languages')
    .split(',')
    .map((item) => item.trim())

  const srcDir = getInput('srcDir')

  // Log languages
  console.log('Currently Processing', languages, `./${srcDir}`)

  languages.map(async (language) => {
    console.log('CURRENT LANGUAGE', language)

    // const outputFilePath = `${languages}/README-${languages}.md`

    getDirectories(`./${srcDir}`, function (err, res) {
      if (err) {
        console.log('Error', err)
      } else {
        console.log(res)
      }
    })

    // await publishTranslate(inputFilePath, outputFilePath, language)
  })
}

main().catch((e) => postError(e))
