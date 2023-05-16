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

  var allDirectoryMappings: string[] = await Promise.all(
    languages.map(async (language): Promise<string> => {
      const directoryMap = await getDirectories(`./${srcDir}`)

      await Promise.all(
        directoryMap.map(async (inputDir): Promise => {
          // Publish a translation for each directory found
          console.log('ABOUT TO PROCESS', inputDir)
          const outputFilePath = `${language}/${inputDir}`
          await publishTranslate(inputDir, outputFilePath, language)
        }),
      )

      return directoryMap
    }),
  )

  console.log('allDirectoryMappings', allDirectoryMappings)
}

main().catch((e) => postError(e))
