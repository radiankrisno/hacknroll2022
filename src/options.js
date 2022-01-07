import { getBlockedDomains, getDefaultStorage } from "./utils.js"

const blockedDomainsPlaceholder = document.getElementById('blockedDomainsPlaceholder')
const input = document.getElementById('input')

document.getElementById('domain-block').addEventListener("submit", handleFormSubmit)
document.getElementById('query-setting').addEventListener("submit", handleSaveDifficulty)
document.addEventListener('DOMContentLoaded', handleLoad)

async function handleLoad(event) {
  event.preventDefault();

  const blockedDomains = await getBlockedDomains();

  // Render list of blocked domains
  blockedDomainsPlaceholder.innerHTML = ''
  for (const blockedDomain of blockedDomains) {
    const node = document.createElement('li');    
    const text = document.createElement('text')
    text.style.fontSize = "large";

    const textnode = document.createTextNode(blockedDomain)
    text.appendChild(textnode)
    node.appendChild(text)

    const span = document.createElement('span')
    const  txt = document.createTextNode('\u00D7')
    span.className = 'close'
    span.style.fontSize = 'x-large'
    span.appendChild(txt)
    node.appendChild(span)

    blockedDomainsPlaceholder.appendChild(node)
  }

  const close = document.getElementsByClassName("close");
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = async function() {
      const sibling = this.previousElementSibling
      let blockedDomains = await getBlockedDomains();
      blockedDomains = blockedDomains.filter(blockedDomain => blockedDomain !== sibling.textContent)

      await chrome.storage.sync.set({blockedDomains})
      await handleLoad(event)
    }
  }

  const difficulty = await getDefaultStorage("difficulty", -1);

  // console.log([].filter.call(document.getElementsByName('difficultyLevel'), x => x.value === difficulty)[0]);
  [].filter.call(document.getElementsByName('difficultyLevel'), x => x.value === difficulty)[0].checked = true;
}

async function handleFormSubmit(event) {
  event.preventDefault()

  clearMessage()

  const blockedDomains = await getBlockedDomains()

  if (blockedDomains.includes(input.value)) {
    setMessage("Domain is already blocked!")
    return
  }

  blockedDomains.push(input.value)
  await chrome.storage.sync.set({blockedDomains})
  await handleLoad(event)
}

async function handleSaveDifficulty(event) {
  event.preventDefault();
  const difficulty = [].filter.call(document.getElementsByName('difficultyLevel'), x => x.checked)[0].value;

  chrome.storage.sync.set({
    "difficulty":  difficulty
  }, () => console.log(difficulty));
}

function setMessage(str) {
  message.textContent = str;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
  message.textContent = "";
}
