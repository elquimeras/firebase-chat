    <?php $usuario = $SESSION->get('usuario'); ?>
    <!-- START RIGHT CHAT-->
    <style type="text/css"> .chat-data{ font-size: 0.7em; } </style>
    <aside id="right-sidebar-nav">
        <ul id="chat-global" class="chat-out side-nav rightside-navigation">
            <li class="li-hover">
                <a href="javascript:void(0)" data-activates="chat-global" class="chat-close-collapse right"><i class="mdi-navigation-close"></i></a>
            </li>
            <li class="li-hover">
                <ul class="chat-collapsible" data-collapsible="expandable">
                    <li>
                        <div class="collapsible-header red white-text active"><i class="mdi-social-whatshot"></i>Chats Recientes</div>
                        <div id="chats-recientes" class="collapsible-body favorite-associates">
                            <!-- Contenido Dinamico -->
                        </div>
                    </li>
                    <li>
                        <div class="collapsible-header teal white-text"><i class="mdi-action-account-child"></i>Mis Participantes</div>
                        <div id="chats-mis-participantes" class="collapsible-body favorite-associates">
                            <!-- Contenido Dinamico -->
                        </div>
                    </li>
                    <?php if($usuario['rol'] == 1){ ?>
                    <li>
                        <div class="collapsible-header blue white-text"><i class="mdi-action-perm-identity"></i>Coachs</div>
                        <div id="chats-usuarios" class="collapsible-body favorite-associates">
                            <!-- Contenido Dinamico -->
                        </div>
                    </li>
                    <?php } ?>
                    <?php if($usuario['rol'] == 1){ ?>
                    <li>
                        <div class="collapsible-header cyan white-text"><i class="mdi-action-account-child"></i>Participantes</div>
                        <div id="chats-participantes" class="collapsible-body favorite-associates">
                            <!-- Contenido Dinamico -->
                        </div>
                    </li>
                    <?php } ?>
                </ul>
            </li>
        </ul>

        <ul id="chat-window" class="chat-out side-nav rightside-navigation">
            <li class="li-hover">
            <a href="javascript:void(0)" data-activates="chat-window" class="chat-close-collapse right"><i class="mdi-navigation-close"></i></a>
            </li>
            <li class="li-hover">
                <ul class="chat-collapsible" data-collapsible="expandable">
                    <li>
                        <div class="collapsible-header blue white-text active">
                            <i class="mdi-action-perm-identity"></i>
                            <span id="usuario-chat"><!-- Contenido Dinamico --></span>
                        </div>
                        <div id="chat-window-msgs" class="collapsible-body favorite-associates" style="max-height: 60vh; overflow-y: scroll;">
                            <!-- Contenido Dimamico -->
                        </div>
                    </li>
                </ul>
            </li>
            <li class="li-hover">
                <form id="chat-window-form">
                    <input type="text" id="chat-window-msg" placeholder="Escribir mensaje" style="padding: 10px;">
                    <button class="btn waves-effect waves-light teal" type="submit" style="top:-15px; width: 100%">
                        <span style="position: relative; top:-3px;">Enviar</span> <i class="mdi-content-send"></i>
                    </button>
                </form>
            </li>
        </ul>
      </aside>
      <!-- END RIGHT CHAT-->


    <!-- START FOOTER -->
    <footer class="page-footer">
        <!--div class="footer-copyright">
            <div class="container">
                Copyright © 2016 <a class="grey-text text-lighten-4" href="http://apos.online" target="_blank">Wizard technology.</a> All rights reserved.
                <span class="right"> Design and Developed by <a class="grey-text text-lighten-4" href="https://www.LoDevelopers.com/">LoDevelopers</a></span>
            </div>
        </div-->
    </footer>
    <!-- END FOOTER -->
    
    <!--plugins.js - Some Specific JS codes for Plugin Settings-->
    <script type="text/javascript" src="<?php echo $configuration->get('libsFolder', 'system')?>plugins.js"></script>
    <script type="text/javascript">
      userData = {
        nombre:"<?php echo $usuario['nombre'] ?>",
        apellido:"<?php echo $usuario['apellido'] ?>",
        id:"<?php echo $usuario['user_id'] ?>",
        rol:"<?php echo $usuario['rol'] ?>"
      }
    </script>
    <script src="libs/scroll-to/jquery.scrollTo.min.js"></script>
    <script src="libs/firebase/firebase.js"></script>
    <script type="text/javascript" src="<?php echo $configuration->get('jsFolder', 'system')?>chat-all.js"></script>
</body>

</html>