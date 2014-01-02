var notes = {
    elem: {
        listNotes: $("#list-notes")
    },

    init: function(){
        $("#save-note").on("click", notes.saveNote);
        this.showNotes();
    },

    showNotes: function(){
        var storage = window.localStorage.getItem("notes");
        if(storage != null){    
            storage = JSON.parse(storage)

            for ( index in storage ){
                var id = storage[index].id,
                    text = storage[index].text,
                    created = storage[index].created
                ;

                notes.elem.listNotes
                    .append(noteLiTmpl(id, text , created)).listview('refresh'); 
            }  
        }else{
            window.localStorage.setItem("id", 1);
        }
    },

    getDate: function(){
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        return day + "/" + month + "/" + year;
    }, 

    saveNote: function(){
        var textarea = $("#text-note"),
            text =  $.trim(textarea.val()),
            storage  = null,
            created  = notes.getDate()
        ;

        if(text){
            var local = window.localStorage.getItem("notes"),
                currentId = parseInt(window.localStorage.getItem('id'))
            ;
                    
            if(local != null){
                storage = JSON.parse(local);
                storage.push({
                    id: currentId,
                    text: text,
                    created: created
                });
            }else{    
                storage = [
                    {
                        id: currentId,
                        text: text,
                        created: created,
                    }
                ]; 
            }


            window.localStorage.setItem("notes", JSON.stringify(storage));
            window.localStorage.setItem("id", currentId + 1);

            notes.elem.listNotes
                .prepend(noteLiTmpl(currentId, text , created))
                .listview("refresh");

            // CLEAN TEXTAREA ADD NOTE
            textarea.val('');
            
        } 
    }
}


document.addEventListener('deviceready', onDeviceReady, false);


function noteLiTmpl(id, text , created){
    var li = "<li data-icon='false'>"+
                "<a href='#single?id="+ id +"'>" + text + "</a>" + 
                "<span class='ui-li-count'>" + created + "</span>" +
             "</li>";
    return li;
}

function onDeviceReady(){
    notes.init();
}



$(document).bind("pagebeforechange", function(e, data){
    var u = $.mobile.path.parseUrl( data.toPage )
    var idNote = u.hash;
    if(u.hash){
        idNote = u.hash.split("=")[1];
        if(idNote){
            console.log("show single page")

            var storage = window.localStorage.getItem("notes");
            storage = JSON.parse(storage)
            var singleText;

            for( obj in storage ){
                if(idNote == storage[obj].id){
                    singleText = storage[obj].text;
                }
            }

            $("#single-note").html(singleText)

        }
    }
    
});

