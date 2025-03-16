chrome.action.onClicked.addListener(async (tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            let svgElement = document.querySelector("svg");
            if (svgElement) {
                let svgString = new XMLSerializer().serializeToString(svgElement);
                chrome.runtime.sendMessage({ svgData: svgString });
            } else {
                alert("No SVG found on this page!");
            }
        }
    });
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.svgData) {
        let encodedSvg = encodeURIComponent(message.svgData);
        let dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;

        chrome.downloads.download({
            url: dataUrl,
            filename: "extracted.svg"
        });
    }
});
