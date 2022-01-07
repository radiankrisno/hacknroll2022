function resetPage() {
  test();
  document.documentElement.innerHTML = 'Domain is blocked';
  document.documentElement.scrollTop = 0;
}

function blockPartial(text){
  const current = window.location.href;
  if(current === text){
    resetPage();
  }
}

function blockEntire(text){
  const current = window.location.href;
  if(current.startsWith(text)){
    resetPage();
  }
}

async function getQuestionStatus() {
  const result = await chrome.storage.sync.get(['question_status'])

  return result.question_status
}

export async function main() {
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