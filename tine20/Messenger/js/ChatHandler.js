Ext.ns('Tine.Messenger');

Tine.Messenger.ChatHandler = {
    jidToId: function (jid) {
        return jid.replace(/@/g, "_").replace(/\./g, "-");
    },
    
    idToJid: function (id) {
        return id.replace(/_/g, "@").replace(/\-/g, ".");
    },
    
    showChatWindow: function (id, name) {
        // Shows the chat window OR
        if (Ext.getCmp(id)) {
            Ext.getCmp(id).show();
        // Creates it if doesn't exist and show
        } else {
            var chat = new Tine.Messenger.Chat({
                title: name,
                id: id
            });
            chat.show();
        }
    },
    
    onIncomingMessage: function (message) {
        var raw_jid = $(message).attr("from");
        var jid = Strophe.getBareJidFromJid(raw_jid);
        var id = Tine.Messenger.ChatHandler.jidToId(jid);
        var name = $(message).attr("name") || raw_jid;
        var chat_id = "#messenger-chat-"+id;
        var chat_area = chat_id+" .chat";
        var chat_sender = chat_id+" .text-sender";
        
        // Shows the chat specifc chat window
        Tine.Messenger.ChatHandler.showChatWindow(chat_id, name);
        
        // Puts focus on chat's input text (sender box)
        // TODO: NOT WORKING! Focus the textfield!
        $(chat_sender).focus();
        
        // Capture the message body element, 
        // extract text and append to chat area
        var body = $(message).find("html > body");
        if (body.length === 0) {
            body = $(message).find("body");
        }
        var msg = body.text(),
            txt = "<span class=\"recv\">&lt;"+name+"&gt;"+msg+"</span><br/>";
        //$(chat_area).append(txt);
        Tine.Messenger.Log.debug(txt);

        return true;
    },
    
    onOutgoingMessage: function (message) {
        return true;
    }
}