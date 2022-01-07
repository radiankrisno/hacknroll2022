function blockPartial(text){
  const current = window.location.href;
  if(current === text){
    document.documentElement.innerHTML = '';
    document.documentElement.innerHTML = 'Domain is blocked';
    document.documentElement.scrollTop = 0;
  }
}

function blockEntire(text){
  const current = window.location.href;
  if(current.startsWith(text)){
    document.documentElement.innerHTML = '';
    document.documentElement.innerHTML = 'Domain is blocked';
    document.documentElement.scrollTop = 0;
  }
}

async function getQuestionStatus() {
  const result = await chrome.storage.sync.get(['question_status'])

  return result.question_status
}

async function blockDomains() {
  const result = await chrome.storage.sync.get(['blockedDomains'])
  if (!('blockedDomains' in result)) {
    await chrome.storage.sync.set({'blockedDomains': []})
    return
  }

  const questionStatus = await getQuestionStatus()

  if (questionStatus === 'ac' || questionStatus === 'skipped') {
    return
  }

  for (const blockedDomain of result.blockedDomains) {
    blockEntire(blockedDomain)
  }
}

blockDomains()
