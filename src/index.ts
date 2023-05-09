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
  const inputFilePath = 'README.md'
  const outputFilePath = `${languages}/README-${languages}.md`

  console.log('LANGUAGES FROM CONFIG', languages)
  // const { inputFilePath, outputFilePath, targetLang } = await getCommandParams()
  // await publishTranslate(inputFilePath, outputFilePath, targetLang)

  await publishTranslate(inputFilePath, outputFilePath, languages)
}

main().catch((e) => postError(e))
