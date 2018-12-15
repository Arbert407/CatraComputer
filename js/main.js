var tiempoEspera;
var dire;
var leyendo = false;
var ejecutando = false;
var compilado = false;
var contador = 0;
var ir = 0;
var desplazamiento = 0;
var programa = '';
var inputSelecionado = 0;
var anteriorPC = '000';
var finalizado = false;
var ocurrioError = false;
var ejecutarTodo = false;
var numeros="1234567890";



$(document).ready(function(){
    mostrarMemoria();
    escribirEnConsola('Creado por Alejandro Claros v1.1');
    setTimeout(() => escribirEnConsola('?borr'), 3000); 
});



function ejecutarComando(par){
    if(par != null){
        var tex = par+'\n'+$('#areaTexto').val();
    }else{
        var tex = $('#areaTexto').val();
    }
    if(leyendo && par != '?modp'){
        if(par=='?vaci' && !verificarDato(1)){
            return false;
        }
        if($('#modalDeLectura').css('display') == 'none'){
            escribirEnConsola('Ha salido de la lectura de datos, por favor reinicie el programa.');
            return false;
        }
        noValidar();
        clearTimeout(tiempoEspera);
        guardarDatoLeido(dire,2,inputSelecionado);
        leyendo = false;
        $('#modalDeLectura').modal('hide');
        tiempoEspera = setTimeout(function(){
            if(ejecutarTodo){ejecutarComando('?vaci');}
        }, 500);
    }else if(ejecutando && par != '?rein' && par != '?comp' && par != '?modp' && !ocurrioError  ){
        contador = parseInt($('#col-valor-contador').html());
        $('#col-valor-contador').html(darSigno(1,contador+1,0));
        ejecutarPrograma(contador);
    }else if(compilado && par != '?rein' && par != '?comp' && !finalizado && par != '?modp' && !ocurrioError){
        escribirEnConsola('?ejpr\n'+programa);
    }else{
        escribirEnConsola(tex);
    }
}



function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}



function escribirEnConsola(texto){
    $('.salidaP').scrollTop(1000000);
    if (texto == "?borr\n" || texto == "?cls" || texto == "?cls\n" || texto == "?borr"){
        $('#con-salida').html('');
        return false;
    }else if(texto.substring(0,5) == "?comp" || texto.substring(0,5) == "?comp\n" || texto.substring(0,5) == "?comp\n" || texto.substring(0,5) == "?comp"){
        $('#con-salida').append('<br>Inicia depuración del programa...<br>');
        compilarPrograma(texto.substring(6));
        return false;
    }else if(texto == '?esp'){
        $('#con-salida').append('.');
        return false;
    }else if(texto.substring(0,5) == '?ejpr'){
        desplazamiento = 0;
        escribirEnConsola('<br>Inicio del programa');
        $('#col-valor-contador').html(darSigno(1,1,0));
        ejecutarPrograma(contador);
    }else if(texto.substring(0,5) == '?modp'){
        if(verificarDato(2) && verificarDato(3)){
            var a = $('#input-lectura-2').val();
            var b = $('#input-lectura-3').val();
            $('#col-valor-'+pad(a,3)).html(darSigno(1,b,0));
            $('#modalModificacionMemoria').modal('hide');
            escribirEnConsola('<br>Se modificó la memoria '+pad(a,3)+'.');
            $('#input-lectura-2').val('');
            $('#input-lectura-3').val('');
            noValidar();
        }
    }else if(texto.substring(0,5) == '?rein'){
        if(compilado){
            finalizado = false;
            ejecutando = false;
            resaltarInstruccion(contador,2);
            $('#col-valor-acumulador').html('+'+pad(0,5));
            $('#col-valor-contador').html('+'+pad(0,5));
            $('#col-valor-ir').html('+'+pad(0,5));
            $('#mensaje-pantalla').html(': )');
            contador = 0;
            desplazamiento = 0;
            noValidar();
            escribirEnConsola('<br>Programa reiniciado correctamente.');
        }
    }else if(texto.substring(0,5) == '?vaci'){
        return false;
    }else{
        $('#con-salida').append(texto + '<br>');
        $('.salidaP').scrollTop(1000000);   
    }
}



function mostrarMemoria(){
    $('#div-memoria').html('');
    for(var i=0; i<1000; i++){
        $('#div-memoria').append('<div class="row" style="border-style:none;border-color:none;" id="row-posicion-memoria-'+i+'">'+
        '    <div id="col-posicion-'+pad(i,3)+'" class="col dato">'+pad(i,3)+
        '    </div>'+
        '    <div id="col-valor-'+pad(i,3)+'" class="col dato">'+
        '        +00000'+
        '    </div>'+
        '</div>');
    }
}



function darSigno(op,a,b){
    if(a == null){
        a = 0;
    }else if(b == null){
        b = 0;
    }else if(op == 1){
        a = parseInt(a);
        b = parseInt(b);
        if(a+b < 0){
            return '-'+pad((a+b)*(-1),5);
        }else{
            return '+'+pad((a+b),5);
        }
    }else if(op == 2){
        if(a-b < 0){
            return '-'+pad((a-b)*(-1),5);
        }else{
            return '+'+pad((a-b),5);
        }
    }else if(op == 3){
        if(a*b < 0){
            return '-'+pad(parseInt(a*b)*(-1),5);
        }else{
            return '+'+pad(parseInt(a*b),5);
        }
    }else if(op == 4){
        if(a/b < 0){
            return '-'+pad(parseInt(a/b)*(-1),5);
        }else{
            return '+'+pad(parseInt(a/b),5);
        }
    }else{
        return 0;
    }
}



function guardarDatoLeido(dir, op, tipo){
    var t = $('#input-lectura-'+tipo).val();
    var signoLeido = 1;
    if(t == ''){
        t = 00000;
    }
    if(t.substring(0,1) == '-'){
        t = t.substring(1);
        signoLeido = -1;
    }else if(t.substring(0,1) == '+'){
        t = t.substring(1);
        signoLeido = 1;
    }
    noValidar();
    if(!tieneNumeros(t)){
        resaltarInstruccion(contador, 3);
        escribirEnConsola('El dato ingresado es incorrecto.<br>Se guardará el valor +00000.');
        if(t == ''){
            escribirEnConsola('El dato ingresado (ninguno) es incorrecto.');
            ocurrioError = true;
            var numeros="1234567890";
            return false;
        }
        return false;
    }else{
        if(t > 99999){
            escribirEnConsola('Dato fuera de rango.');
            resaltarInstruccion(contador, 3);
            noValidar();
            ejecutando = false;
            ocurrioError = true;
            return false;
        }
        $('#col-valor-'+pad(parseInt(dir),3)).html(darSigno(1,(t*signoLeido),0));
        $('#input-lectura').val('');
        if(op==1){
            $('#modalDeLectura').modal('hide');
            ejecutarComando('?vaci');
            escribirEnConsola('Se guardó el dato "'+t+'" en la memoria '+dir+'.');
            escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
            $('#input-lectura-'+tipo).val('');
        }else{
            escribirEnConsola('Se guardó el dato "'+t+'" en la memoria '+dir+'.');
            escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
            $('#input-lectura-'+tipo).val('');
        }
    }
}



function compilarPrograma(instrucciones){
    mostrarMemoria();
    var operacion;
    var contadorInterno = 0;
    contador = 0;
    ejecutando = false;
    var instruccion = instrucciones.split('\n');
    for(var i=0; i<instruccion.length; i++){
        if(instruccion[i].length != 5){
            escribirEnConsola('Error: La instrucción "'+instruccion[i]+ '" debe ser de 5 digitos.');
            mostrarMemoria();
            //ocurrioError = true;
            return false;
        }else{
            operacion = instruccion[i].substring(0,2);
            if(operacion == 43){
                contadorInterno = contadorInterno + 1;
            }
            direccion = instruccion[i].substring(2);
            if(operacion ==10 || operacion ==11 || operacion == 20 || operacion == 21 || operacion >= 30 && operacion <=33 || operacion >= 40 && operacion <= 43 ){
                if(contadorInterno < 1 && i+1==instruccion.length){
                    escribirEnConsola('Error: no se encuentra instrucción ALTO.');
                    mostrarMemoria();
                    ocurrioError = true;
                    return false;
                }else{
                    if(contadorInterno>1 && i+1==instruccion.length){
                        escribirEnConsola('Error: Hay mas de una instrucción de ALTO.');
                        mostrarMemoria();
                        ocurrioError = true;
                        return false;
                    }else{
                        $('#col-valor-'+pad(i,3)).html('+'+instruccion[i]);
                    }
                }
            }else{
                escribirEnConsola('Error: Instrucción '+instruccion[i]+' no válida.');
                mostrarMemoria();
                ocurrioError = true;
                return false;
            }
        }
    }
    ocurrioError = false;
    compilado = true;
    programa = instrucciones;
    finalizado = false;
    ejecutarTodo = false;
    noValidar();
    $('#col-valor-acumulador').html('+'+pad(0,5));
    $('#col-valor-contador').html('+'+pad(0,5));
    $('#col-valor-ir').html('+'+pad(0,5));
    $('#mensaje-pantalla').html(': )');
    escribirEnConsola('Depuración exitosa.');
}



function resaltarInstruccion(inst, op){
    if (op==1){
        $('#row-posicion-memoria-'+inst).css('border-style','ridge');
        $('#row-posicion-memoria-'+inst).css('border-color','rgb(145, 220, 90)');
        resaltarInstruccion(anteriorPC,2);
        anteriorPC = inst;
    }else if(op==3){
        $('#row-posicion-memoria-'+inst).css('border-style','ridge');
        $('#row-posicion-memoria-'+inst).css('border-color','red');
    }else{
        $('#row-posicion-memoria-'+inst).css('border-style','none');
        $('#row-posicion-memoria-'+inst).css('border-color','none');
    }
}



function verificarAcumulador(){
    var valor = $('#col-valor-acumulador').html();
    valor = parseInt(valor.substring(1));
    if(valor>99999 || valor<-99999){
        resaltarInstruccion(contador,3);
        escribirEnConsola('<br>El resultado de la operación esta fuera de rango.<br>Deteniendo ejecución...<br>Presione el boton de reiniciar.');
        ejecutando = false;
        $('#col-valor-acumulador').html('DESBOR');
        $('#col-valor-contador').html('+'+pad(0,5));
        $('#col-valor-ir').html('+'+pad(0,5));
        contador = 0;
        desplazamiento = 0;
        ocurrioError = true;
        $('#mensaje-pantalla').html(': (');
        return false;
    }
    return true;
}



function ejecutarPrograma(inst){
    ejecutando = true;
    //anteriorIR = $('#col-valor-ir').html();
    //resaltarInstruccion(ints-1,2);
    resaltarInstruccion(inst,1);
    var instruccion = $('#col-valor-'+pad(inst,3)).html();
    $('#col-valor-ir').html(instruccion);
    var operacion = instruccion.substring(1,3);
    var direccion = instruccion.substring(3);
    var dato = 0;
    var acumulador = 0;
    if(operacion == '10'){
        dire = direccion;
        leyendo = true;
        inputSelecionado = 1;
        escribirEnConsola('Se inició la memoria '+direccion+'.');
        escribirEnConsola('Por favor ingrese un valor en el area de texto.');
        $('#modalDeLectura').modal('show');
        tiempoEspera = setTimeout(() =>guardarDatoLeido(direccion, 1, 1), 100000);
    }else if(operacion == '11'){
        escribirEnConsola('Se muestra la palabra contenida en la dirección '+direccion+': '+$('#col-valor-'+direccion).html()+'.');
        escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
        $('#mensaje-pantalla').html($('#col-valor-'+direccion).html());
    }else if(operacion == '20'){
        //escribirEnConsola('Se cargo la palabra "'+$('#col-valor-'+direccion).html()+'" en el acumulador.');
        escribirEnConsola('Se cargó la palabra de la dirección '+pad(direccion,3)+' en el acumulador.');
        $('#col-valor-acumulador').html($('#col-valor-'+direccion).html());
        escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
    }else if(operacion == '21'){
        escribirEnConsola('Se almacena el acumulador en la memoria '+direccion+'.');
        $('#col-valor-'+direccion).html($('#col-valor-acumulador').html());
        escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
    }else if(operacion == '30'){
        dato = parseInt($('#col-valor-'+direccion).html());
        acumulador = parseInt($('#col-valor-acumulador').html()); 
        escribirEnConsola('Se suma la palabra de la dirección '+direccion+' al acumulador.');
        //$('#col-valor-acumulador').html(pad(dato+acumulador,5));
        $('#col-valor-acumulador').html(darSigno(1,dato,acumulador));
        if(verificarAcumulador()){
            escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
        }
    }else if(operacion == '31'){
        dato = parseInt($('#col-valor-'+direccion).html());
        acumulador = parseInt($('#col-valor-acumulador').html()); 
        escribirEnConsola('Se resta la palabra de la dirección '+direccion+' al acumulador.');
        //$('#col-valor-acumulador').html(pad(acumulador-dato,5));
        $('#col-valor-acumulador').html(darSigno(2,acumulador,dato));
        if(verificarAcumulador()){
            escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
        }
    }else if(operacion == '32'){
        dato = parseInt($('#col-valor-'+direccion).html());
        acumulador = parseInt($('#col-valor-acumulador').html()); 
        escribirEnConsola('Se divide el acumulador entre la palabra de la dirección '+direccion);
        //$('#col-valor-acumulador').html(pad(parseInt(acumulador/dato),5));
        $('#col-valor-acumulador').html(darSigno(4,acumulador,dato));
        if(verificarAcumulador()){
            escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
        }
    }else if(operacion == '33'){
        dato = parseInt($('#col-valor-'+direccion).html());
        acumulador = parseInt($('#col-valor-acumulador').html()); 
        escribirEnConsola('Se multiplica el acumulador con la palabra de la dirección '+direccion);
        //$('#col-valor-acumulador').html(pad(parseInt(acumulador*dato),5));
        $('#col-valor-acumulador').html(darSigno(3,acumulador,dato));
        if(verificarAcumulador()){
            escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
        }
    }else if(operacion == '40'){
        escribirEnConsola('Bifurca hacia la dirección '+direccion);
        //$('#col-valor-contador').html(pad(direccion,5));
        //anteriorPC = $('#col-valor-contador').html().substring(2)-1;
        //console.log(anteriorPC-1);
        $('#col-valor-contador').html(darSigno(1,direccion,0));
        escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
    }else if(operacion == '41'){
        escribirEnConsola('Bifurca hacia la dirección '+direccion+' si el acumulador es negativo.');
        acumulador = parseInt($('#col-valor-acumulador').html());  
        if(acumulador<0){
            escribirEnConsola('El acumulador es negativo.')
            //$('#col-valor-contador').html(pad(direccion,5));
            $('#col-valor-contador').html(darSigno(1,direccion,0));
        }else{
            escribirEnConsola('El acumulador es positivo.');
        }
        escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
    }else if(operacion == '42'){
        escribirEnConsola('Bifurca hacia la dirección '+direccion+' si el acumulador es igual a cero.');
        acumulador = parseInt($('#col-valor-acumulador').html());  
        if(acumulador==0){
            escribirEnConsola('El acumulador es igual a cero.')
            //$('#col-valor-contador').html(pad(direccion,5));
            $('#col-valor-contador').html(darSigno(1,direccion,0));
        }else{
            escribirEnConsola('El acumulador no es igual a cero.');
        }
        escribirEnConsola('Presione el boton para pasar a la siguiente instrucción.');
    }else if(operacion == '43'){
        escribirEnConsola('Fin del programa.');
        finalizado = true;
        ejecutando = false;
        ocurrioError = false;
        //resaltarInstruccion(inst,2);
        //$('#col-valor-acumulador').html('+'+pad(0,5));
        //$('#col-valor-contador').html('+'+pad(0,5));
        //$('#col-valor-ir').html('+'+pad(0,5));
        contador = 0;
        desplazamiento = 0;
        ejecutarTodo = false;
        return false;
    }else{
        escribirEnConsola('Instrucción invalida.<br>Corrija los errores y compile de nuevo.');
        resaltarInstruccion(inst,3);
        ejecutando = false;
        $('#col-valor-acumulador').html('+'+pad(0,5));
        $('#col-valor-contador').html('+'+pad(0,5));
        $('#col-valor-ir').html('+'+pad(0,5));
        contador = 0;
        compilado = false;
        ocurrioError = true;
        desplazamiento = 0;
        ejecutarTodo = false;
        return false;
    }
    if(ejecutarTodo){
        ejecutarComando('?vaci');
    }
}



function tieneNumeros(texto){
    var cont = 0;
    texto = texto.toString();
    for(i=0; i<texto.length; i++){
        if (numeros.indexOf(texto.charAt(i),0)!=-1){
            cont = cont +1;
        }
    }
    if(cont == texto.length){
        return true;
    }
    return false;
}



function verificarDato(numero){
    var t = $('#input-lectura-'+numero).val();
    if(t==''){return false;}
    if(t.substring(0,1) == '-' || t.substring(0,1) == '+'){
        t = t.substring(1);
        if(t==''){
            $('#input-lectura-'+numero).addClass("is-invalid");
            $('#input-lectura-'+numero).removeClass("is-valid");
            $('#mensaje-input-'+numero).addClass('invalid-feedback');
            $('#mensaje-input-'+numero).removeClass('valid-feedback');
            $('#mensaje-input-'+numero).html('El dato esta fuera del rango');
            $('#mensaje-input-'+numero).html("Parametro invalido.");
            return false;
        }
    }
    if (!tieneNumeros(t)){
        $('#input-lectura-'+numero).addClass("is-invalid");
        $('#input-lectura-'+numero).removeClass("is-valid");
        $('#mensaje-input-'+numero).addClass('invalid-feedback');
        $('#mensaje-input-'+numero).removeClass('valid-feedback');
        //$('#mensaje-input-'+numero).html('El dato tiene letras');
        $('#mensaje-input-'+numero).html("Parametro invalido");
        //$('#btn-me-mod').attr('onclick','');
        return false;
    }else if(Math.abs(parseInt(t))>99999 && numero == 1 || numero == 2 && Math.abs(parseInt(t))>99999){
        $('#input-lectura-'+numero).addClass("is-invalid");
        $('#input-lectura-'+numero).removeClass("is-valid");
        $('#mensaje-input-'+numero).addClass('invalid-feedback');
        $('#mensaje-input-'+numero).removeClass('valid-feedback');
        $('#mensaje-input-'+numero).html('El dato esta fuera del rango');
        $('#mensaje-input-'+numero).html("Parametro invalido.");
        return false;
    }else if(Math.abs(parseInt(t))>99999 && numero == 3){
        $('#input-lectura-'+numero).addClass("is-invalid");
        $('#input-lectura-'+numero).removeClass("is-valid");
        $('#mensaje-input-'+numero).addClass('invalid-feedback');
        $('#mensaje-input-'+numero).removeClass('valid-feedback');
        $('#mensaje-input-'+numero).html('El dato esta fuera del rango');
        return false;
    }else{
        $('#mensaje-input-'+numero).html("Parametro valido");
        $('#mensaje-input-'+numero).addClass("valid-feedback");
        $('#mensaje-input-'+numero).removeClass("invalid-feedback");
        $('#input-lectura-'+numero).addClass("is-valid");
        $('#input-lectura-'+numero).removeClass("is-invalid");
        return true;
    }
}



function noValidar(){
    for(var i=0; i<4; i++){
        $('#mensaje-input-'+i).html("");
        $('#input-lectura-'+i).removeClass("is-valid");
        $('#input-lectura-'+i).removeClass("is-invalid");
        $('#input-lectura-'+i).html('');
    }
}



function reiniciar(){
    if(compilado){
        finalizado = false;
        ejecutando = false;
        leyendo = false;
        ocurrioError = false;
        resaltarInstruccion(contador,2);
        $('#col-valor-acumulador').html('+'+pad(0,5));
        $('#col-valor-contador').html('+'+pad(0,5));
        $('#col-valor-ir').html('+'+pad(0,5));
        $('#mensaje-pantalla').html(': )');
        contador = 0;
        desplazamiento = 0;
        noValidar();
        mostrarMemoria();
        var instruccion = programa.split('\n');
        for(var i=0; i<instruccion.length; i++){
            $('#col-valor-'+pad(i,3)).html('+'+instruccion[i]);
        }
        escribirEnConsola('<br>Programa reiniciado correctamente.');
        //escribirEnConsola('?ejpr\n'+programa);
    }
}



function ejecutarTodos(){
    ejecutarTodo = true;
    ejecutarComando('?vaci');
}





$(document).ready(function(){
    for(var i=0; i<999; i++){
        console.log('No volver a dudar de tus habilidades.');
    }
});





