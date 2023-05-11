import { getCommandParams, postError } from './utils'
import { publishTranslate } from './translate'
import { authorizeUser } from './git'
import { getInput } from '@actions/core'

async function main() {
  const isAuthorized = await authorizeUser()
  if (!isAuthorized) {
    await postError('You have no permission to use this bot.')
  }

  // Array of languages set in action workflow
  const languages = getInput('languages')
    .split(',')
    .map((item) => item.trim())

  // Log languages
  console.log('LANGUAGES FROM CONFIG', languages)

  languages.map(async (language) => {
    console.log('CURRENT LANGUAGE', language)
    const inputFilePath = 'README.md'
    const outputFilePath = `${languages}/README-${languages}.md`
    await publishTranslate(inputFilePath, outputFilePath, language)
  })
}

main().catch((e) => postError(e))
