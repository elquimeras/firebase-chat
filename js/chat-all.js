// ** Chat Real-Time con Firebase
var chatAll = function() {}
var fbase;
chatAll.prototype = {
    activeChat:null,
    read:null,
    init:function(){
        var that = this;
        //  Establecer la funcionalidad del formulario
        $('#chat-window #chat-window-form').submit(function(e){
            e.preventDefault();
            that.sendMsg();
        });
        //  Cargar lista de participantes y coachs
        $.ajax({
            type: "POST",
            url: "usuarios/coach_participantes/",
            async: true, cache : false, dataType: 'json',
            success: function(datos){
                participantes = datos.participantes;
                $('#chats-participantes').empty();
                for(var i in participantes){
                    var _target = participantes[i].idCoach == userData.id ? '#chats-mis-participantes' : '#chats-participantes';
                    $(_target).append(''+
                        '<div data-tipo="P" data-id="'+participantes[i].part_id+'" class="favorite-associate-list chat-out-list row create-chat" style="cursor:pointer;">'+
                        '    <div class="col s4"><img src="public/images/avatar/default.jpg" alt="" class="circle responsive-img offline-user valign profile-image">'+
                        '    </div>'+
                        '    <div class="col s8">'+
                        '        <p>'+participantes[i].nombrePart+'</p>'+
                        '        <p class="place">Participante</p>'+
                        '        <p class="place">Coach: '+participantes[i].nombreCoach+'</p>'+
                        '    </div>'+
                        '</div>');
                }

                usuarios = datos.usuarios;
                $('#chats-usuarios').empty();
                for(var i in usuarios){
                    if(userData.id != usuarios[i].user_id){ // para que no habla consigo mismo
                      $('#chats-usuarios').append(''+
                        '<div data-tipo="C" data-id="'+usuarios[i].user_id+'" class="favorite-associate-list chat-out-list row create-chat" style="cursor:pointer;">'+
                        '    <div class="col s4"><img src="public/images/avatar/'+usuarios[i].avatar+'" alt="" class="circle responsive-img offline-user valign profile-image">'+
                        '    </div>'+
                        '    <div class="col s8">'+
                        '        <p>'+usuarios[i].nombre + " " + usuarios[i].apellido+'</p>'+
                        '        <p class="place">'+usuarios[i].rol_lbl+'</p>'+
                        '    </div>'+
                        '</div>');
                }
              }

              $('.create-chat').click(function(){
                that.crearChat($(this).data('tipo'), $(this).data('id'));
              })
            },
            error: function (status, error, datos) { alert("Error: " + error + " " + datos + " " + status.responseText); }
        });
        //  Iniciar el servicio de firebase
        this.initFirebase();
    },
    // Iniciar el servicio de firebase
    initFirebase: function () {
        if(!fbase){
            var that = this;
            var config = {
                apiKey: "AIzaSyDca9Xr0twfUJxCfixDVVa_JLgH6BF14Vw",
                authDomain: "fupsion-ec36c.firebaseapp.com",
                databaseURL: "https://fupsion-ec36c.firebaseio.com"
            };    
            window.firebase.initializeApp(config);
            fbase = window.firebase.database(); 
            that.readData();
        }
    },
    // Lectura inicial de los datos alojados en Firebase
    readData: function () {
        var that = this;
        // Listar los chats en curso
        fbase.ref('chat').on("child_added", function(snapshot) {
            if(userData.rol == 1){ // si es admin
            }
            var _chat = snapshot.val();
            var chatId = _chat._id; // snapshot.key
            var userId = 'C'+userData.id;
            var usuarioChat = userId == chatId ? _chat.users._de : _chat.users._para === 'null' ? _chat.users._de : _chat.users._para;
            usuarioChat.data = usuarioChat.tipo == 'C' ? usuarios.filter(function (_usr) { return _usr.user_id == usuarioChat.id })[0] : participantes.filter(function (_usr) { return _usr.part_id == usuarioChat.id })[0];            
            
            if(usuarioChat.data.idCoach == userData.id || userData.rol == 1){
                var avatar = usuarioChat.tipo == 'C' ?  usuarioChat.data.avatar : 'default.jpg';
                var rol_lbl = usuarioChat.tipo == 'C' ?  usuarioChat.data.rol_lbl : 'Participante';
                var html_coach = usuarioChat.tipo != 'C' ? '<p class="place userCoach">Coach: '+usuarioChat.data.nombreCoach+'</p>' : '';
                $('#chats-recientes').append(   '<div id="chat-'+chatId+'" data-id="'+chatId+'" class="favorite-associate-list chat-out-list row" style="cursor:pointer;">'+
                                                '    <div class="col s4"><img src="public/images/avatar/'+avatar+'" alt="" class="circle responsive-img online-user valign profile-image">'+
                                                '    </div>'+
                                                '    <div class="col s8">'+
                                                '        <p class="userName">'+usuarioChat.nombre+'</p>'+
                                                '        <p class="place">'+rol_lbl+'</p>'+
                                                            html_coach+
                                                '        <p class="place red-text nuevo-mensaje" style="display:none;">Nuevo Mensaje</p>'+
                                                '    </div>'+
                                                '</div>');
                if(_chat.usrMsg){ // notificacion de nuevo mensaje
                    $('#chat-'+chatId).find('.nuevo-mensaje').show();
                    $('.chat-badge').text(1).show();
                }
                
                $('#chat-'+chatId).click(function(){ // Función para mostrar el chat al pulsar el nombres
                    $('#usuario-chat').text($(this).find('.userName').text());
                    $('#chat-global').sideNav('hide');
                    $('.chat-window-collapse').click();
                    that.showMsgs($(this).data('id'));
                });
                
                fbase.ref('chat/'+chatId).on("child_changed", function(snapshot) { // Trigguer para mostrar nuevo mensaje
                    $('#chat-'+chatId).find('.nuevo-mensaje').show();
                    var no_msgs = $('.chat-badge').text() || 0;
                    $('.chat-badge').text(++no_msgs).show();
                });
            }
        });
             
    },
    // Crear un nuevo chat
    crearChat: function (tipo, id) {
        var that = this;
        if(tipo == "C"){
            var nuevoUsuario = usuarios.filter(function (_usr) { return _usr.user_id == id });
            u_nombre = nuevoUsuario[0].nombre + " " + nuevoUsuario[0].apellido;
            u_tipo = 'C';
            u_id = nuevoUsuario[0].user_id;
        }else{
            var nuevoUsuario = participantes.filter(function (_usr) { return _usr.part_id == id });
            u_nombre = nuevoUsuario[0].nombre + " " + nuevoUsuario[0].apellido
            u_tipo = 'P';
            u_id = nuevoUsuario[0].part_id;
        }


        fbase.ref('chat/'+(tipo+id)).on("value", function(snapshot) {
            if(!snapshot.val()){ // si no existe lo crea
                fbase.ref('chat/'+(tipo+id)).set(
                    { 
                        _id:(tipo+id),
                        users : {   
                                    _admin : userData.nombre + " " + userData.apellido,
                                    _user: nuevoUsuario[0].nombre + " " + nuevoUsuario[0].apellido,
                                    _de:{ tipo: "C", id:userData.id, nombre: userData.nombre + " " + userData.apellido },
                                    _para:{ tipo: u_tipo, id:u_id, nombre: u_nombre },
                                }, 
                        messages: {},
                        usrMsg:false,
                        coachMsg:false,
                    },
                    function(error) {
                      if(error){
                        alert('Message written, error: ' + error)
                      }else{
                        $('#usuario-chat').text(nuevoUsuario[0].nombre + " " + nuevoUsuario[0].apellido);
                        $('#chat-global').sideNav('hide');
                        $('.chat-window-collapse').click();
                        that.showMsgs(tipo+id);
                      }
                    }
                );
            }else{ // si no lo muestra de one
                $('#usuario-chat').text(nuevoUsuario[0].nombre + " " + nuevoUsuario[0].apellido);
                $('#chat-global').sideNav('hide');
                $('.chat-window-collapse').click();
                that.showMsgs(tipo+id);
            } 
        }, function (errorObject) {
            alert("Error en plataforma " + errorObject)
        });
    },
    // Mostar los mensajes de un chat en especifico
    showMsgs: function (chatId) {
        var that = this;
        this.activeChat = chatId;
        $('#chat-'+this.activeChat).find('.nuevo-mensaje').hide();
        var userId = 'C'+userData.id;
        $('#chat-window #chat-window-msgs').empty();
        if(this.read) this.read.off();
        
        this.read = fbase.ref('chat/'+chatId).child("messages").orderByChild('time');
        this.read.on("child_added", function(snapshot) {
            $('#chat-'+chatId).find('.badge').hide();

            var key = snapshot.key;
            var msg = snapshot.val(); var fechaMsg = new Date(msg.time);
            var fechaMsg = fechaMsg.getDate()+"-"+(fechaMsg.getMonth()+1)+"-"+fechaMsg.getFullYear() + " " + (fechaMsg.getHours()<10?'0':'') + fechaMsg.getHours() + ":" + (fechaMsg.getMinutes()<10?'0':'') + fechaMsg.getMinutes();

            if(msg){
                if(userId == msg._userID){
                  data_coach = false;
                  if(msg._userID.indexOf('C') == 0) data_coach = usuarios.filter(function (_usr) { return _usr.user_id == msg._userID.substr(1) });
                    $('#chat-window #chat-window-msgs').append(''+
                        '<div id="'+key+'" class="chat-msg favorite-associate-list chat-out-list row">'+
                        '    <div class="col s9">'+
                        '        <p>'+msg.msg+'</p>'+
                        '        <p class="place">'+msg._user+'</p>'+
                        '        <p class="place">'+fechaMsg+'</p>'+
                        '    </div>'+
                        '    <div class="col s3"><img src="public/images/avatar/'+data_coach[0].avatar+'" alt="" class="circle responsive-img offline-user valign profile-image">'+
                        '    </div>'+
                        '</div>');
                }else{
                    avatar = 'default.jpg';
                    if(msg._userID.indexOf('C') == 0){
                        data_coach = usuarios.filter(function (_usr) { return _usr.user_id == msg._userID.substr(1) });  
                        avatar = data_coach[0].avatar;
                    }
                    $('#chat-window #chat-window-msgs').append(''+
                        '<div id="'+key+'" class="chat-msg favorite-associate-list chat-out-list row">'+
                        '    <div class="col s3"><img src="public/images/avatar/'+avatar+'" alt="" class="circle responsive-img offline-user valign profile-image">'+
                        '    </div>'+
                        '    <div class="col s9">'+
                        '        <p>'+msg.msg+'</p>'+
                        '        <p class="place right-align">'+msg._user+'</p>'+
                        '        <p class="place right-align">'+fechaMsg+'</p>'+
                        '    </div>'+
                        '</div>');
                }
            }
            if(userData.rol == 1){ // Permitir a los admins eliminar un mensaje
                $('#'+key).dblclick(function(){
                    var idMsg = this.id;
                    swal({
                      title: 'Eliminar Mensaje',
                      text: "¿Desea borrar este mensaje?",
                      type: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Si, borralo!',
                      cancelButtonText: 'No, dejalo!'
                    }).then(function () {
                        that.delMsg(chatId, idMsg);
                    }).catch(swal.noop);
                })
            }
            $('#chat-window #chat-window-msgs').scrollTo(9999, 1);
            fbase.ref('chat/'+chatId).update({'usrMsg':false}); // indica que leyo los mensajes
        });
        $('.chat-badge').text(0).hide();  
    },
    delMsg: function (chatId, idMsg) {
        fbase.ref('chat/'+chatId+'/messages/').child(idMsg).remove();
        $('#'+idMsg).remove();
    },
    sendMsg: function () {
        var that = this;
        if(!this.activeChat){
          alert("Debe seleccionar un contacto");
          return false;
        }
        if($('#chat-window-msg').val() == ""){ 
          $('#chat-window-msg').css("background", "rgb(247, 255, 201)");
          return false; 
        }

        //fbase.ref('chat/'+this.activeChat).update({'coachMsg':true});
        fbase.ref('chat/'+this.activeChat+'/messages').push(
            { 
                time : new Date().getTime(),
                msg: $('#chat-window-msg').val(),
                _user:userData.nombre + " " + userData.apellido,
                _userID:'C'+userData.id
            },
            function() { // CallBack
                $('#chat-window-msg').val("")
                $('#chat-window-msg').css("background", "none");
            }
        );
    },
}

$(function() {
    var globalChat = new chatAll();
    globalChat.init();
})
