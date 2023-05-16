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
  const allSrcFiles = await getDirectories(`./${srcDir}`)

  // Log languages
  console.log('Currently Processing', languages, `./${srcDir}`)

  await Promise.all(
    languages.map(async (language) => {
      await Promise.all(
        allSrcFiles.map(async (file) => {
          const outputFilePath = `${language}/${file}`
          const translation = await publishTranslate(
            file,
            outputFilePath,
            language,
          )
          console.log('Translation', translation)
        }),
      )
    }),
  )
}

main().catch((e) => postError(e))
