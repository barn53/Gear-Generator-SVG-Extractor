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
            let filename = `${date.toLocaleString().replace(/[: .]/g, "_")}_gear_${idx}.svg`
            chrome.downloads.download({
                url: dataUrl,
                filename
            })
        }
    }
})
