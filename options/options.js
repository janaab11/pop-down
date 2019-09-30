function restoreOptions(){
    chrome.storage.local.get(['userList','closeTab','removeHistory'],
    function(result){
        document.getElementById('close-tab').checked        =result.closeTab;
        document.getElementById('clear-history').checked    =result.removeHistory;
        document.getElementById('user-list').value          =result.userList.join(',');
    });
}

restoreOptions();

$('#save').click(function(){
    chrome.storage.local.set({
        'userList'      :document.getElementById('user-list').value.split(','),
        'closeTab'      :document.getElementById('close-tab').checked,
        'clearHistory'  :document.getElementById('clear-history').checked
    },
    function(){
        let saveElement = document.getElementById('save');
        saveElement.textContent='Saved!';
        saveElement.style='font-weight:bold';
        setTimeout(function(){
            saveElement.textContent='Save';
            saveElement.style='font-weight:normal';
        },2000);
    });
});