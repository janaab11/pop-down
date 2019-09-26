function Incognigo(tab){
    chrome.tabs.remove(tab.id);
    chrome.windows.getAll(function(all_windows){
        let first_incognito=all_windows.find(window=>window.incognito);
        if (first_incognito)
            chrome.tabs.create({url:tab.url, windowId:first_incognito.id})
        else
            chrome.windows.create({url:tab.url, incognito:true});
    }); 
}

function readUserList(){
    return ['medium.com','economist.com'];
}

function matchUserList(url){
    let userList=readUserList();
    for (let item of userList){
        if (url.match(new RegExp(item,'i')))
            return true;
    }
    return false;
}

chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({id:'incognigo', title:'Go Incognito', contexts:['all']});
});

chrome.contextMenus.onClicked.addListener(function(info,tab){
    Incognigo(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if((changeInfo.url)&&(!tab.incognito)){
        let newUrl=changeInfo.url;

        if (matchUserList(newUrl))
            Incognigo(tab);
    }
});
