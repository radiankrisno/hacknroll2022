(async () => {
    const src = chrome.runtime.getURL('src/content.js');
    const contentScript = await import(src);
    contentScript.main(/* chrome: no need to pass it */);
  })();