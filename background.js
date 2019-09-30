chrome.runtime.onInstalled.addListener(function(){
    chrome.contextMenus.create({id:'popdown', title:'Pop Down',
        contexts:['page','link','image','video','audio','frame','selection']});
    chrome.storage.local.set({
        'userList'      :['5movies.cloud'],
        'closeTab'      :true,
        'clearHistory'  :false
    });
});

chrome.contextMenus.onClicked.addListener(function(info,tab){
    chrome.storage.local.get(['userList'],function(result){
        let userList=result.userList;
        userList.push(tab.url.split('.com')[0]);
        chrome.storage.local.set({'userList':userList});
    });
});

function Pop_Down(tab){
    return new Promise(function(resolve,reject) {
        chrome.storage.local.get(['closeTab','clearHistory'],function(result){
            if (result.closeTab) chrome.tabs.remove(tab.id, function(){});
            if (result.clearHistory) chrome.history.deleteUrl({url:tab.url});
            chrome.windows.getAll(function(all_windows){
                let first_incognito=all_windows.find(window=>window.incognito);
                if (first_incognito)
                    chrome.tabs.create({url:tab.url, windowId:first_incognito.id},
                        function(tab){
                        resolve('hi new tab in old window!');
                    });
                else
                    chrome.windows.create({url:tab.url, incognito:true},
                        function(window){
                        resolve('hi new window!');
                    });
            });
        });
    });
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
            match=userList.find(item=>
                url.match(new RegExp(item,'i')));
            if (match)
                resolve(true);
            else
                resolve(false);
        });
    })
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(changeInfo.url){
        const before = window.performance.now();
        let newUrl=changeInfo.url;
        matchUserList(newUrl)
        .then(match=>{
            if (match){
                Pop_Down(tab)
                .then(test=>{
                    console.log(test, window.performance.now()-before)
                });
            }
            
        });
    }
});
