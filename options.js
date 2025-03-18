document.addEventListener('DOMContentLoaded', () => {
    const addTextCheckbox = document.getElementById('addText');
    const addGuidesCheckbox = document.getElementById('addGuides');
    const dpiInput = document.getElementById('dpi');
    const addCenterHoleCheckbox = document.getElementById('addCenterHole');
    const centerHoleInput = document.getElementById('centerHole');
    const saveConfirmation = document.getElementById('save-confirmation');

    // Load saved options
    chrome.storage.sync.get(['addText', 'addGuides', 'dpi', 'addCenterHole', 'centerHole'], (result) => {
        addTextCheckbox.checked = result.addText || false;
        addGuidesCheckbox.checked = result.addGuides || false;
        dpiInput.value = result.dpiInput || '72';
        addCenterHoleCheckbox.checked = result.addCenterHole || false;
        centerHoleInput.value = result.centerHole || '';
    });

    // Save options when the form is submitted
    document.getElementById('options-form').addEventListener('submit', (event) => {
        event.preventDefault();
        chrome.storage.sync.set({
            addText: addTextCheckbox.checked,
            addGuides: addGuidesCheckbox.checked,
            dpi: dpiInput.value,
            addCenterHole: addCenterHoleCheckbox.checked,
            centerHole: centerHoleInput.value
        }, () => {
            // Show save confirmation
            saveConfirmation.classList.remove('hidden');
            setTimeout(() => {
                saveConfirmation.classList.add('hidden');
            }, 2000); // Fade out after 2 seconds
        });
    });

});
