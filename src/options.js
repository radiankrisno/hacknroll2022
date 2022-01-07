const blockedDomainsPlaceholder = document.getElementById('blockedDomainsPlaceholder')
const add = document.getElementById('add')
const form = document.getElementById('control-row')
const input = document.getElementById('input')

form.addEventListener("submit", handleFormSubmit)
document.addEventListener('DOMContentLoaded', handleLoad)

async function handleLoad(event) {
  event.preventDefault();

  const blockedDomains = await getBlockedDomains()

  blockedDomainsPlaceholder.innerHTML = ''

  for (const blockedDomain of blockedDomains) {
    const node = document.createElement('li')
    const text = document.createElement('text')
    const textnode = document.createTextNode(blockedDomain)
    text.appendChild(textnode)
    node.appendChild(text)

    const span = document.createElement('span')
    const  txt = document.createTextNode('\u00D7')
    span.className = 'close'
    span.appendChild(txt)
    node.appendChild(span)

    blockedDomainsPlaceholder.appendChild(node)
  }

  const close = document.getElementsByClassName("close");
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = async function() {
      const sibling = this.previousElementSibling
      let blockedDomains = await getBlockedDomains()
      blockedDomains = blockedDomains.filter(blockedDomain => blockedDomain !== sibling.textContent)

      await chrome.storage.sync.set({blockedDomains})
      await handleLoad(event)
    }
  }

}

async function getBlockedDomains() {
  const result = await chrome.storage.sync.get(['blockedDomains'])
  if (!('blockedDomains' in result)) {
    await chrome.storage.sync.set({'blockedDomains': []})
    return []
  }

  return result.blockedDomains
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

function setMessage(str) {
  message.textContent = str;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
  message.textContent = "";
}
