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
  console.log(languages)

  const { inputFilePath, outputFilePath, targetLang } = await getCommandParams()
  await publishTranslate(inputFilePath, outputFilePath, targetLang)
}

main().catch((e) => postError(e))
