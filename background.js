function Incogni_go(tab){
    chrome.tabs.remove(tab.id);
    chrome.windows.getAll(function(all_windows){
        let first_incognito=all_windows.find(window=>window.incognito);
        if (first_incognito)
            chrome.tabs.create({url:tab.url, windowId:first_incognito.id})
        else
            chrome.windows.create({url:tab.url, incognito:true});
    });
    return Promise.resolve('hi this works!'); 
}

function readUserList(){
    return new Promise(function(resolve,reject){
        chrome.storage.local.get(['userList'],function(result){
            let userList=result['userList'];
            resolve(userList);
        })
    });
}

function matchUserList(url){
    return new Promise(function(resolve,reject){
        readUserList()
        .then(userList=>{
            first_match=userList.find(item=>
                url.match(new RegExp(item,'i')));
            if (first_match)
                resolve(true);
            else
                resolve(false);
        });
    })
}

chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({id:'incognigo', title:'Go Incognito', contexts:['all']});
    chrome.storage.local.set({'userList':['medium.com','economist.com']})
});

chrome.contextMenus.onClicked.addListener(function(info,tab){
    Incogni_go(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if((changeInfo.url)&&(!tab.incognito)){
        const before = window.performance.now();
        let newUrl=changeInfo.url;
        matchUserList(newUrl)
        .then(match=>{
            if (match){
                Incogni_go(tab)
                .then((check)=>{
                    // alert(check);
                    // alert(window.performance.now()-before);
                });
            }
            
        });
    }
});
