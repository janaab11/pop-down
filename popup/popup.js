function getCurrentURL(){
    return new Promise(function(resolve,reject){
        chrome.tabs.query({active:true,currentWindow:true},
            function(tabs){
                let currentURL=tabs[0].url;
                document.getElementById('current-website').value=currentURL;
                resolve();
            }
        );
    });
}

function updateUserList(){
    chrome.storage.local.get(['userList'],
        function(result){
            let list=document.getElementById('user-list')
            $(list).empty();
            result.userList.forEach((item) => {
                $('<li>'+item+'</li>').appendTo(list);
            });
        }
    );
}

getCurrentURL()
.then(()=>{
    updateUserList();
});

$('#add-current').click(function(){
    chrome.storage.local.get(['userList'],
        function(result){
            let new_entry=document.getElementById('current-website').value;
            let userList=result.userList;
            userList.push(new_entry);
            chrome.storage.local.set({'userList':userList},updateUserList);
        }
    );
});