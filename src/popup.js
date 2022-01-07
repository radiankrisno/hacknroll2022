import { fetchLC, generateNewQuestion } from "./utils.js"

const skip = document.getElementById('skip')
const skipText = document.getElementById('skipText')
const skipLoader = document.getElementById('skipLoader')
const generate = document.getElementById('generate')
const generateText = document.getElementById('generateText')
const generateLoader = document.getElementById('generateLoader')
const option = document.getElementById('option')

skip.addEventListener('click', handleClickSkip)
generate.addEventListener('click', handleClickGenerate)
option.addEventListener('click', handleClickOption)

async function handleClickSkip(event) {
  event.preventDefault();

  skipText.hidden = true
  skipLoader.hidden = false

  await chrome.storage.sync.set({'question_status': 'skipped', 'last_updated': (new Date()).toJSON()})

  skipText.hidden = false
  skipLoader.hidden = true
}

async function handleClickGenerate(event) {
  event.preventDefault();

  generateText.hidden = true
  generateLoader.hidden = false

  const lcData = await fetchLC();
  await generateNewQuestion(lcData);

  generateText.hidden = false
  generateLoader.hidden = true
}

function handleClickOption(event) {
  event.preventDefault();

  const extensionId = chrome.runtime.id
  const url = (navigator.userAgent.includes("edg") ? `` : `chrome-`) + `extension://${extensionId}/options.html`
  chrome.tabs.create({url});
}