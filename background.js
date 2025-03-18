chrome.runtime.onInstalled.addListener(() => {
    if (chrome.contextMenus) {
        chrome.contextMenus.create({
            id: "openOptions",
            title: "Options",
            contexts: ["action"]
        });

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            if (info.menuItemId === "openOptions") {
                chrome.runtime.openOptionsPage();
            }
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "extractSVG" })
})

chrome.runtime.onMessage.addListener((message) => {
    if (message.svgGears) {
        let date = new Date()
        for (let idx = 0; idx < message.svgGears.length; idx++) {
            let svgGear = message.svgGears[idx]
            let svgEncodedData = encodeURIComponent(svgGear)
            let dataUrl = `data:image/svg+xml;charset=utf-8,${svgEncodedData}`
            let d = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            let t = `${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}`
            let filename = `${d} ${t} gear [${idx}].svg`
            chrome.downloads.download({
                url: dataUrl,
                filename
            })
        }
    }
})
