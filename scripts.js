var tempLocal = (localStorage.getItem('registros')) ? JSON.parse(localStorage.getItem('registros')):{
    transaccion : [], cantidad :[], concepto : [], tipo : [], recibo : [], fecha : []
};

var datosDeUsuario = (localStorage.getItem('usuario')) ? JSON.parse(localStorage.getItem('usuario')):{
    user:"" , mensajes:0
};

startup();

function startup(){ 
    if(datosDeUsuario.user!=""){  
        localStorage.setItem('usuario', JSON.stringify(datosDeUsuario));
        document.getElementById("startup").style.display="none";
        document.getElementById("valorDelUsuario").innerHTML=datosDeUsuario.user;
    }else{
        document.getElementById("menu").style.display ="none";
    }
    
    saldo();
}

var paginas; var paginaActual; var PseudoPaginaActual;var vacio=0;
const variables = ["concepto","tipo","cantidad","ingreso","recibo"];

function validaciones(seleccion){
    var campos=[0,0,0];
    var flag=0; 
    
    if(seleccion=="a"){
        if(concepto.value==""){		campos[0]=1;	 }

        if(tipo.value=="Opciones" || tipo.value=="ERROR"){		campos[1]=1;	 }

        if(isNaN(cantidad.value) || cantidad.value<=0 || cantidad.value==""){	campos[2]=1;	}

        for(i=0;i<3;i++){
            if(campos[i]){
                flag=1;  
                ErroresVisuales(variables[i],1);
            }else{ 
                ErroresVisuales(variables[i],0);  
            }
        } 

        if(!(flag)){ insertar("recibo");limpiarTodo();  } 

    }else if(seleccion=="b"){
        if(!(isNaN(ingreso.value) || ingreso.value=="" || ingreso.value<=0)){
            insertar("saldo");
        }else{
            ErroresVisuales(variables[3],1); 
        }
    }
    obtenerFecha();
}

function ErroresVisuales(idTemp,flag){
    //1 MOSTRAR ERRORES 0 LIMPIAR
    var elementoBailador = document.getElementById(idTemp);
    
    if(flag){
        elementoBailador.style.border="1px solid #E24040";

        elementoBailador.style.marginLeft="10px";
        setTimeout(()=>{
            elementoBailador.style.marginLeft="-10px";
            setTimeout(()=>{
                elementoBailador.style.marginLeft="0px";
            },80);
        },80);
        //Añadir clase
        $("#" + idTemp +"MomAlrt").addClass("equisde");
    }else{
        //Remover clase
        $("#"+idTemp+"MomAlrt").removeClass("equisde");
        elementoBailador.style.border="1px solid gray";
    }
    var cursorValue = (flag)?"help":"default"; 

    document.getElementById(idTemp+"Alrt").style.cursor = cursorValue ;
    document.getElementById(idTemp+"Alrt").style.opacity = flag ;
}

function insertar(accion){
    var dated = obtenerFecha(); 

    if(accion=="recibo"){ 

        tempLocal.transaccion.push("Salida");
        tempLocal.cantidad.push(cantidad.value);
        tempLocal.concepto.push(concepto.value);
        tempLocal.tipo.push(tipo.value);
        tempLocal.recibo.push(recibo.checked);

    }else if(accion=="saldo"){
        tempLocal.transaccion.push("Entrada");
        tempLocal.cantidad.push(ingreso.value);
        tempLocal.concepto.push(null);
        tempLocal.tipo.push(null);
        tempLocal.recibo.push(null);
    }

    tempLocal.fecha.push(dated);

    localStorage.setItem('registros', JSON.stringify(tempLocal));
    saldo();
    limpiarTodo();
}

function obtenerFecha(){
    Horarios = new Date(); 

    const ArrDia = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

    Dia = Horarios.getDate();  Mes = Horarios.getMonth(); Year= Horarios.getFullYear();

    Mes++;
    
    Dia = sumaCeros(Dia); Mes = sumaCeros(Mes);
    
    Fecha=", "+Dia+"/"+Mes+"/"+Year;  

    var MensajeFinal = "Fecha: "+ArrDia[Horarios.getDay()] + Fecha; 

    return MensajeFinal;
}

function sumaCeros(temp){
    temp = (temp<10)? "0" + temp : temp ;
    return temp;
}

var FlagGlobal=1;
function cambioDeFormulario() {
    
    var MostrarForm = (FlagGlobal)? "tablaDeRegistros" : "formulario"  ;
    var MostrarContent = (FlagGlobal)? "contenidoFormB" : "contenidoFormA"  ;

    var BorradoForm = (FlagGlobal)? "formulario" : "tablaDeRegistros"  ;
    var BorradoContent = (FlagGlobal)? "contenidoFormA" : "contenidoFormB"  ;

    var AlturaDeVuelta = (FlagGlobal==0)? (flagA==1)? '540px' : '275px' : '540px';
    var AnchuraDeVuelta = (FlagGlobal)? '80%' : "450px" ;

    var menuEstado = (FlagGlobal)? "none" : "inline-block"  ;

    document.getElementById("menu").style.display =menuEstado;

    var mensaje = (flagA)?"Haga clic para regresar al formulario de registro de gasto monetario.":"Haga clic para regresar al formulario de ingreso monetario.";

    document.getElementById("mensajeB").innerHTML=mensaje;
    
    document.getElementById(BorradoContent).style.display = "none";
    document.getElementById(BorradoContent).style.opacity = 0;
    document.getElementById(BorradoForm).style.height ='1px';
    document.getElementById("cuerpo").style.cursor="wait";

    setTimeout(()=>{
        document.getElementById(BorradoForm).style.width ='1px';
        setTimeout(()=>{
            document.getElementById(BorradoForm).style.display ='none';
            document.getElementById(MostrarForm).style.display ='inline-block';
            setTimeout(()=>{
                document.getElementById(MostrarForm).style.width =AnchuraDeVuelta;
                setTimeout(()=>{
                    document.getElementById(MostrarForm).style.height = AlturaDeVuelta;
                    document.getElementById(MostrarContent).style.display ='inline-block';
                    setTimeout(()=>{
                        document.getElementById(MostrarContent).style.opacity = 1;
                        
                        paginas = Math.ceil(tempLocal.transaccion.length/8); 
                        paginaActual = Math.ceil(tempLocal.transaccion.length/8); 
                        console.log(Math.ceil(tempLocal.transaccion.length/8) );
                        PseudoPaginaActual=1;

                        ActivaDesactiva("back",1);
                        ActivaDesactiva("next",0);

                        //Llega tan rapido que hay que moverlo
                        vacio = (!paginas)?1:0;
                        if(!FlagGlobal){
                            mostrarRegistros(); 
                        } 
                        
                        document.getElementById("cuerpo").style.cursor="initial";
                    },400);
                },400);
            },400);
        },400);
    },400);

    limpiarTodo();
    
    FlagGlobal = (FlagGlobal)? 0 : 1  ; 
}

function saldo(){
    var sumatoria=0;
    
    for(i=0;i<tempLocal.transaccion.length;i++){
        if(tempLocal.transaccion[i]=="Entrada"){
            sumatoria += parseFloat(tempLocal.cantidad[i]);
        }else{
            sumatoria -= parseFloat(tempLocal.cantidad[i]);
        }
    }
    document.getElementById('saldo').innerHTML="Saldo: "+sumatoria+" $";
}

var flagA=1;
function cambioDeDisplay(){
    var A = (flagA)? 1 : 0;
    var B = (flagA)? 0 : 1;

    var texto = (flagA)?"Haga clic para registrar un gasto monetario.":"Haga clic para registrar un ingreso monetario.";

    document.getElementById("mensajeA").innerHTML=texto;

    var altura = (flagA)? '275px' : '540px';
    
    document.getElementById('formulario').style.height=altura;

    OcultarMostrar("A",A);OcultarMostrar("B",B);

    flagA = flagA ? 0 : 1;

    saldo(); limpiarTodo();
}

function OcultarMostrar(temp,flag){
    if(flag){
        document.getElementById(temp).style.display = "none";
        document.getElementById(temp).style.opacity = 0;
    }else{
        document.getElementById(temp).style.display = "inline-block";
        setTimeout(()=>{
            document.getElementById(temp).style.opacity=1;
        },300);
    }
}

function limpiarTodo(){
    for(i=0;i<4;i++){
        if(i==1){
            document.getElementById(variables[i]).value="Opciones";
        }else{
            document.getElementById(variables[i]).value="";
        } 
        ErroresVisuales(variables[i],0); 
    }

    if(i==4){
        document.getElementById(variables[i]).checked=false;
    }
}

function mostrarRegistros(){
    var lista = document.getElementById("registros");
    $(lista).empty();
    if(vacio){
        var tempItemp=document.createElement('li');
        tempItemp.innerText = "Aquí se almacenarán todos tus registros, prueba creando uno.";
        lista.prepend(tempItemp); 
    }else{
        
        for(i=0+(8*(paginaActual-1));i<(8*paginaActual);i++){
            var item = document.createElement('li');
            if(tempLocal.transaccion[i]=="Salida"){
                var HayRecibo = (tempLocal.recibo[i])? "Sí" : "No" ;
                item.innerText= "Salida: "+tempLocal.cantidad[i]+"$ - Concepto: "+tempLocal.concepto[i]+" - Tipo: "+tempLocal.tipo[i]+" - ¿Hay Recibo? "+HayRecibo+" - "+tempLocal.fecha[i];
            }else{
                item.innerText = "Ingreso: "+tempLocal.cantidad[i]+" $ - "+tempLocal.fecha[i]+" "+" "+" "; 
            } 

            var botonBorrar = document.createElement('button');
            botonBorrar.classList.add('botonBorrar');
            botonBorrar.innerHTML =  "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#000000'><path d='M0 0h24v24H0z' fill='none'/><path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'/></svg>";

            botonBorrar.addEventListener('click', borrarItem);

            item.appendChild(botonBorrar);
            
            item.id=i;

            if(!(tempLocal.cantidad[i]==undefined)){
                lista.prepend(item);
            }
        }
            document.getElementById("paginas").innerHTML= PseudoPaginaActual+"/"+paginas;
    }
    
    if(paginas<=1){ActivaDesactiva("next",1);}
}

function borrarItem(){
    var item = this.parentNode;
    var parent = item.parentNode;
    var id = item.id 

    tempLocal.transaccion.splice(id,1);
    tempLocal.cantidad.splice(id,1);
    tempLocal.concepto.splice(id,1);
    tempLocal.tipo.splice(id,1);
    tempLocal.recibo.splice(id,1);
    tempLocal.fecha.splice(id,1);

    localStorage.setItem('registros', JSON.stringify(tempLocal));
    
    parent.removeChild(item);
}

function SumarRestarPagina(flag){
    
    (flag)?paginaActual-- : paginaActual++ ;
    (flag)?PseudoPaginaActual++ : PseudoPaginaActual-- ; 
    console.log(paginaActual);

    (PseudoPaginaActual==1)? ActivaDesactiva("back",1): ActivaDesactiva("back",0); 

    (PseudoPaginaActual==paginas)? ActivaDesactiva("next",1) :ActivaDesactiva("next",0) ;

    mostrarRegistros();
}

function ActivaDesactiva(id,flag){
    var elemento = document.getElementById(id);
    if(flag){ 
        elemento.style.opacity = 0;
        elemento.disabled  = true;
        elemento.style.cursor="context-menu";
    }else{ 
        elemento.style.opacity = 1;
        elemento.disabled  = false;
        elemento.style.cursor="pointer";
    }
}

var flagX = datosDeUsuario.mensajes; 
var startUpFlag = 0 ;
HabilitaDes();

function HabilitaDes(){
if(startUpFlag!=0){  flagX = (flagX)?0:1;  }
startUpFlag=1;

var mensaje = (flagX)?"&nbsp&nbspHabilitar mensajes de ayuda":"Desabilitar mensajes de ayuda";

var iconito = (flagX)?"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24px' fill='#000000'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg>":"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24px' fill='#000000'><path d='M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z' fill='none'/><path d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'/></svg>";

document.getElementById("cajaDeAyudas").innerHTML=iconito+mensaje;

var display = (flagX)?"none":"inline-block";

const mensajesLetras = ['A','B','C','D'];

for(i=0;i<4;i++){
    document.getElementById("mensaje"+mensajesLetras[i]).style.display=display;
}

if(flagX){
    $("#cajaDeAyudas").addClass("ayudAct");
}else{
    $("#cajaDeAyudas").removeClass("ayudAct");
}  

datosDeUsuario.mensajes=flagX;
localStorage.setItem('usuario', JSON.stringify(datosDeUsuario));
}

function usuarioArranque(nombreUsuario){
    if(!(nombreUsuario=="" || nombreUsuario=="ERROR")){
        
        datosDeUsuario.user = nombreUsuario;
        localStorage.setItem('usuario', JSON.stringify(datosDeUsuario));
        document.getElementById("startup").style.display ="none";
        document.getElementById("menu").style.display ="inline-block";
        document.getElementById("valorDelUsuario").innerHTML = nombreUsuario;
    } 

    userId.value="ERROR";
    ErroresVisuales("userId",1);
}

function cambioMenu(permanece){

    for(i=1;i<=4;i++){
        var generado = "opcionMenu"+i; 
        var formulario = "form"+i;

        if(generado==permanece){ 
            document.getElementById(formulario).style.display="inline-block";
            $("#"+generado).addClass("seleccion");
        }else{ 
            document.getElementById(formulario).style.display="none";
            $("#"+generado).removeClass("seleccion");
        }
    }
}

function cerrarCuenta(){
    datosDeUsuario.user="";
    localStorage.setItem('usuario', JSON.stringify(datosDeUsuario));
    location.reload(true);
}