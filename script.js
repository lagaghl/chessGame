//constantes:
const torreBlanca = '&#9814;';
const caballoBlanco = '&#9816;';
const alfilBlanco = '&#9815;';
const reinaBlanca = '&#9813;';
const reyBlanco = '&#9812;';
const peonBlanco = '&#9817;';
const peonNegro= '&#9823;';
const torreNegra= '&#9820;';
const caballoNegro= '&#9822;';
const alfilNegro= '&#9821;';
const reinaNegra= '&#9819;';
const reyNegro= '&#9818;';
let itsBlackTurn = false;
//Hacer jaque mate con el enroque;
//---------------------------------------------------------------------------------//
//Eventos
function onClickAll(element){ 
    element.addEventListener("click",()=>{ //cuando se haga click en alguna casilla
        focusAll(); //Se le agrega la caracteristica de focusearse
        let color;
        if (element.classList.contains('posibleMovement')) { //si esta pintado
            let pTarget = document.getElementById('posFinal'); //Se obtiene un p oculto
            let tablero = document.getElementById('tablero');
            pTarget.innerHTML = element.id;
            move();
            focusAll();
            unDrawPosibleMovements();
            color = element.classList[0];
        }

        if (isInCheck(changeColor(color))[0]) {
            if (isCheckMate(changeColor(color))) {
                aparecerModalJaqueMate(color);
                return;
            }
        }else{
            if(isDrowned(changeColor(color))){
                aparecerModalDrowned();
                return;
            }
        }
    });
}
function onFocusAll(element){
    element.addEventListener('focus',()=>{//Todos los elementos adquieren un eventListener
        focusAll();
        unDrawPosibleMovements();
        let pInicial = document.getElementById('posInicial'); //recoge el p hidden
        pInicial.innerHTML = element.id; //el valor va a ser el id del elemento
        drawPosibleMovements(); //Dibuja los movimientos
        let color = element.classList[0];

        if (isInCheck(color)[0]) {
            if (isCheckMate(color)) {
                aparecerModalJaqueMate(changeColor(color));
                return;
            }
        }else{
            if(isDrowned(color)){
                aparecerModalDrowned();
                return;
            }
        }
    });
}
//---------------------------------------------------------------------------------//
function createChess(){ //Acción, crea el tablero
    let tablero = document.getElementById('tablero');
    let fragment = document.createDocumentFragment();
    for (let i = 8; i > -1; i--) {
    // Ponemos primero la fila para agregar columna a columna
        for (let j = 1; j < 10; j++) {
            let div = document.createElement('div');
            if (j==9) {
                if (i==0) {
                    div.classList.add('cuadradoDeLaEsquina');
                    fragment.appendChild(div)
                    continue
                }
                div.classList.add('container-coordenada');
                let p = document.createElement('p');
                p.classList.add('coordenada');
                p.innerHTML=i;
                div.appendChild(p);
                fragment.appendChild(div);
                continue   
            }
            if (i==0) {
                div.classList.add('container-coordenada');
                let p = document.createElement('p');
                let abc=['a','b','c','d','e','f','g','h'];
                p.classList.add('coordenada');
                p.innerHTML=abc[j-1];
                div.appendChild(p);
                fragment.appendChild(div);
                continue  
            }
            if (i==8) { //Fichas Negras
                div.classList.add('black');
                if (j==1 || j==8) { //Torre Negra
                    div.innerHTML = torreNegra;
                    div.classList.add('torre');
                }else if (j==2 || j==7) { // Caballo Negro
                    div.innerHTML = caballoNegro;
                    div.classList.add('caballo');
                }else if (j==3 || j==6) { //Alfil Negro
                    div.innerHTML = alfilNegro;
                    div.classList.add('alfil');
                }else if (j==4) {//Reina Negra
                    div.innerHTML = reinaNegra;
                    div.classList.add('reina');
                }else if (j==5) { //Rey Negro
                    div.innerHTML = reyNegro;
                    div.classList.add('rey');
                }
            } else if (i==7) { //Peon Negro
                div.innerHTML = peonNegro;
                div.classList.add('black');
                div.classList.add('peon')
            } else if (i==2) { //Peon Blanco
                div.innerHTML = peonBlanco;
                div.classList.add('white');
                div.classList.add('peon');
            } else if (i==1) {//Fichas Blancas
                div.classList.add('white');
                if (j==1 || j==8) { //Torre blanca
                    div.innerHTML = torreBlanca;
                    div.classList.add('torre');
                }else if (j==2 || j==7) { // Caballo blanco
                    div.innerHTML = caballoBlanco;
                    div.classList.add('caballo');
                }else if (j==3 || j==6) { //Alfil blanco
                    div.innerHTML = alfilBlanco;
                    div.classList.add('alfil');
                }else if (j==4) {//Reina blanca
                    div.innerHTML = reinaBlanca;
                    div.classList.add('reina');
                }else if (j==5) { //Rey blanco
                    div.innerHTML = reyBlanco;
                    div.classList.add('rey');
                }
            }
            if ((i+j)%2 ==0) { //Color de las casillas
                div.classList.add('dark-box')
            }
            div.setAttribute('id',`${i},${j}`);
            div.classList.add('casilla');
            fragment.appendChild(div);
        }
    }
    tablero.appendChild(fragment);
    focusAll();
}
function restartChess(){
    let tablero = document.getElementById('tablero');
    tablero.innerHTML='';
    createChess();
    itsBlackTurn = false;
    document.querySelectorAll('.casilla').forEach(element=>{ //eventos  
        onClickAll(element);
        onFocusAll(element);
    });
}
function isFocuseable(element){
    //Return true si la en la casilla indicada hay una ficha y es el turno de la misma
    if (element.innerHTML != "") { //hay una ficha
        if (itsBlackTurn) { //Es el turno de las negras
            if (element.classList.contains('black')) { //la ficha es negra
                return true
            } 
            //la ficha es blanca
            return false
        }else{ //Es el turno de las blancas
            if (element.classList.contains('white')) { //la ficha es blanca
                return true
            } 
            //la ficha es negra
            return false
        }
    }
    return false
}
function getFocusElement(){
    let value = document.getElementById('posInicial').innerHTML;
    return document.getElementById(value);
}
function getTargetElement(){
    let value = document.getElementById('posFinal').innerHTML;
    return document.getElementById(value);
}
function focusAll(){
    document.querySelectorAll('.casilla').forEach(element=>{
        if (isFocuseable(element)){
            element.tabIndex = 1;
        }else{
            element.removeAttribute('tabIndex');
        }
    });
}
function canCastle(element){
    let color = element.classList[0];
    let isMoved = element.classList.contains('moved');
    let estaEnJaque = isInCheck(color)[0];
    if (!isMoved && !estaEnJaque) {
        let fila = parseInt(element.id.split(',')[0]);
        let columna = parseInt(element.id.split(',')[1]);
        let torres = [];
        let torreDerecha = document.getElementById(`${fila},8`);
        let torreIzq = document.getElementById(`${fila},1`);
        if (!torreDerecha.classList.contains('moved') && beams(torreDerecha,element)[0] == 0 && beams(torreDerecha,element)[1].length == 2) {
            torres.push(torreDerecha);
        } else if(!torreIzq.classList.contains('moved') && beams(torreIzq,element)[0] == 0 && beams(torreIzq,element)[1].length == 3){
            torres.push(torreIzq);
        }

        for (const torre of torres) {
            let bRes = beams(torre,element);
            for (const i of bRes[1]) {
                if (!casillaProtegida(i,changeColor(color))) {
                    if (bRes[1].length == 3) {
                        return (`${fila},${columna-2}`)
                    } else {
                        return (`${fila},${columna+2}`)
                    }
                }
            }
        }
    }
    return
}
function drawPosibleMovements(){ 
    let element = getFocusElement();
    let casillasPosibles = movimientosValidos(element);
    if (element.classList[1] == 'rey' && canCastle(element)) {
        casillasPosibles.push(canCastle(element));
    }

    if (!casillasPosibles) { //Si no hay casilla posible:
        return;
    }
    casillasPosibles.forEach(casilla=>{
        let casillaPosible = document.getElementById(casilla);//selecionamos la casilla posible
        casillaPosible.classList.add('posibleMovement')
    })
}
function unDrawPosibleMovements(){
    let casillasPosibles = document.querySelectorAll('.posibleMovement');
    casillasPosibles.forEach(casillaPosible=>{
        casillaPosible.classList.remove('posibleMovement');
    })
}
function changeColor(color){//Retorna una cadena de texto que indica el color enemigo
    if (color=='white'){
        return 'black';
    }
    return 'white';
}
function getKing(color){
    return document.querySelector(`.rey.${color}`);
}
function isInCheck(color){ //retorna una matriz que contiene el objeto que hace jaque y el valor booleano que indica si el rey del color inidicado esta en jaque
    let enemigoColor = changeColor(color);
    let cheker = [];
    let casillasOcupadas = Array.from(document.querySelectorAll('.casilla')).filter(v => v.classList.contains(enemigoColor)); // si la casilla esta ocupada por un enemigo
    let rey = document.querySelector(`.rey.${color}`);
    for (let casilla of casillasOcupadas){
        let posiblesMovimientos = movimientos(casilla);
        if (posiblesMovimientos.includes(rey.id)) {
            cheker.push(casilla);
        }
    }
    return [cheker.length > 0, cheker];
}
function movimientosPeon(element){
    let fila = parseInt(element.id.split(',')[0]);
    let columna = parseInt(element.id.split(',')[1]);
    let isBlack = element.classList.contains('black');
    let movimientos = [];
    let comer = [];
    let espacioAdelante , segundoEspacioAdelante, espacioDiagonalDer, espacioDiagonalIzq,filaInicial;
    if (!isBlack) { //Definicion variables blancas
        espacioAdelante = document.getElementById(`${fila+1},${columna}`);
        if (fila == 2) {
            segundoEspacioAdelante = document.getElementById(`${fila+2},${columna}`);
        }
        if (columna!=8) {
            espacioDiagonalDer = document.getElementById(`${fila+1},${columna+1}`);
        }
        if (columna!=1) {
            espacioDiagonalIzq = document.getElementById(`${fila+1},${columna-1}`);
        }
        filaInicial = 2;
    } else{ //Definicion variables Negras
        espacioAdelante = document.getElementById(`${fila-1},${columna}`);
        if (fila == 7) {
            segundoEspacioAdelante = document.getElementById(`${fila-2},${columna}`);
        }   
        if (columna!=8) {
            espacioDiagonalDer = document.getElementById(`${fila-1},${columna+1}`);
        }
        if (columna!=1) {
            espacioDiagonalIzq = document.getElementById(`${fila-1},${columna-1}`);
        }
        filaInicial = 7;
    }
    if (espacioAdelante) {
        if (espacioAdelante.innerHTML == ''){
            //si la fila de adelante esta vacia:
            movimientos.push(espacioAdelante.id);
            if (segundoEspacioAdelante) {
                if (fila == filaInicial && segundoEspacioAdelante.innerHTML == '' ) {
                    //si la segunda fila esta vacia y el peon esta en la segunda fila:
                    movimientos.push(segundoEspacioAdelante.id);
                }
            }
        }
    }
    
    if (espacioDiagonalDer) {
        comer.push(espacioDiagonalDer.id);   
        if (espacioDiagonalDer.classList[0] == changeColor(element.classList[0])) {
        //si la diagonal derecha esta llena se puede ir a esa posición:
            movimientos.push(espacioDiagonalDer.id);
        }
    }
    if (espacioDiagonalIzq) {
        comer.push(espacioDiagonalIzq.id);   
        if (espacioDiagonalIzq.classList[0] == changeColor(element.classList[0])) {
        //si la diagonal izquierda esta llena se puede ir a esa posición:
            movimientos.push(espacioDiagonalIzq.id);
        }
    } 
    return [movimientos,comer];
}
function movimientosCaballo(element){
    let fila = parseInt(element.id.split(',')[0]);
    let columna = parseInt(element.id.split(',')[1]);
    let movimientos = [];
    let allMovimientos=[];
    let colorEnemigo = changeColor(element.classList[0]);
    //------------------------------------------------------//
    let a1 = fila+2;
    let a2 = fila+1;
    let a3 = fila-1;
    let a4 = fila-2;
    let b1 = columna+1;
    let b2 = columna-1;
    let b3 = columna+2;
    let b4 = columna-2;
    let array = [[a1,b1],[a1,b2],[a2,b3],[a2,b4],[a3,b3],[a3,b4],[a4,b1],[a4,b2]];
    array.forEach(element=>{
        let idDelObjeto = element.join(',')
        if(!isOut(element[0],element[1])){ //Ningun numero mayor que 8
            let casilla = document.getElementById(idDelObjeto);
            allMovimientos.push(idDelObjeto);
            if (casilla.classList.contains(colorEnemigo) || casilla.innerHTML=='') { 
                //No tenga el mismo color
                movimientos.push(idDelObjeto);
            }   
        }
    })
    return [movimientos,allMovimientos];
}
function movimientosAlfil(element){
    let fila = parseInt(element.id.split(',')[0]);
    let columna = parseInt(element.id.split(',')[1]);
    let colorEnemigo = changeColor(element.classList[0]);
    let movimientos = [];
    //---------------------------------------------------//
    let casilla;
    //Derecha arriba
    for (let i = 1; !isOut(fila+i,columna+i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila+i},${columna+i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }  
    //derecha abajo
    for (let i = 1; !isOut(fila-i,columna+i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila-i},${columna+i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    // izquierda arriba
    for (let i = 1; !isOut(fila+i,columna-i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila+i},${columna-i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //izquierda abajo
    for (let i = 1; !isOut(fila-i,columna-i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila-i},${columna-i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    return movimientos;
}
function movimientosTorre(element){
    let fila = parseInt(element.id.split(',')[0]);
    let columna = parseInt(element.id.split(',')[1]);
    let movimientos = [];
    let colorEnemigo = changeColor(element.classList[0]);
    //---------------------------------------------------//
    let casilla;
    //Arriba:
    for (let i = 1; !isOut(fila+i,columna); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila+i},${columna}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //Abajo:
    for (let i = 1; !isOut(fila-i,columna); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila-i},${columna}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //Derecha:
    for (let i = 1; !isOut(fila,columna+i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila},${columna+i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //Izquierda:
    for (let i = 1; !isOut(fila,columna-i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila},${columna-i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    return movimientos;
}
function movimientosReina(element){
    let fila = parseInt(element.id.split(',')[0]);
    let columna = parseInt(element.id.split(',')[1]);
    let movimientos = [];
    let colorEnemigo = changeColor(element.classList[0]);
    //---------------------------------------------------//
    let casilla;
    //Arriba:
    for (let i = 1; !isOut(fila+i,columna); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila+i},${columna}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //Abajo:
    for (let i = 1; !isOut(fila-i,columna); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila-i},${columna}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //Derecha:
    for (let i = 1; !isOut(fila,columna+i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila},${columna+i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //Izquierda:
    for (let i = 1; !isOut(fila,columna-i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila},${columna-i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //Derecha arriba
    for (let i = 1; !isOut(fila+i,columna+i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila+i},${columna+i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }  
    //derecha abajo
    for (let i = 1; !isOut(fila-i,columna+i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila-i},${columna+i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    // izquierda arriba
    for (let i = 1; !isOut(fila+i,columna-i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila+i},${columna-i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    //izquierda abajo
    for (let i = 1; !isOut(fila-i,columna-i); i++) {//siempre que la iteracion este dentro
        casilla = document.getElementById(`${fila-i},${columna-i}`);
        if (casilla.innerHTML!='') { 
            //Si la casilla esta llena
            if (casilla.classList.contains(colorEnemigo)) { //Si el color es diferente
                movimientos.push(casilla.id);
                break
            } else { //si es el mismo color
                break
            }
        }else{
            movimientos.push(casilla.id);
        }
    }
    return movimientos;
}
function movimientosRey(element){
    let fila = parseInt(element.id.split(',')[0]);
    let columna = parseInt(element.id.split(',')[1]);
    let movimientos = [];
    let colorEnemigo = changeColor(element.classList[0]);
    //---------------------------------------------------//
    let a1 = fila+1;
    let a2 = fila-1;
    let b1 = columna+1;
    let b2 = columna-1;
    let array = [[a1,b1],[a1,columna],[a1,b2],[fila,b1],[fila,b2],[a2,b1],[a2,columna],[a2,b2]]
    array.forEach(element=>{
        let idDelObjeto = element.join(',')
        if(!isOut(element[0],element[1])){ //Ningun numero mayor que 8
            let casilla = document.getElementById(idDelObjeto);
            if (casilla.classList.contains(colorEnemigo) || casilla.innerHTML=='') { 
                //No tenga el mismo color
                movimientos.push(idDelObjeto);
            }   
        }
    })
    return movimientos;
}
function movimientos(element){
    let tipo = element.classList[1];
    if (tipo=='peon') {
        return movimientosPeon(element)[0];
    }else if (tipo=='caballo') {
        return movimientosCaballo(element)[1];
    }else if(tipo=='alfil'){
        return movimientosAlfil(element);
    }else if (tipo == 'torre') {
        return movimientosTorre(element);
    }else if (tipo == 'reina') {
        return movimientosReina(element);
    }else if (tipo == 'rey') {
        return movimientosRey(element);
    }
}
function movimientosValidos(element){
    let tipo = element.classList[1];
    let color = element.classList[0];
    
    if (isInCheck(color)[0]) {
        return movimientosEnJaque(element);
    }
    if (makeChessSelf(element)[0]) {
        return makeChessSelf(element)[1];
    }
    if (tipo=='peon') {
        return movimientosPeon(element)[0];
    }
    if (tipo=='caballo') {
        return movimientosCaballo(element)[0];
    }
    if(tipo=='alfil'){
        return movimientosAlfil(element);
    }
    if (tipo == 'torre') {
        return movimientosTorre(element);
    }
    if (tipo == 'reina') {
        return movimientosReina(element);
    }
    if (tipo == 'rey') {
        return movimientosRey(element);
    }
}
function casillaProtegida(id,colorQueProtege){// Puede que ya funcione
    let element = document.getElementById(id);
    let color = colorQueProtege;
    let allCasillas = Array.from(document.querySelectorAll(`.${color}`));
    let casillaProtectora = allCasillas.filter(casilla => {
        if (casilla.classList[1]=='peon') {
            return movimientosPeon(casilla)[1].includes(element.id);
        }else if (casilla.classList[1]=='caballo') {
            return movimientosCaballo(casilla)[1].includes(element.id);
        }else if (casilla.classList[1]=='rey') {
            return movimientosRey(casilla).includes(element.id);
        }else{
            let a = beams(casilla,element)[0].length == 0
            let b = typeof(beams(casilla,element)[1]) != 'boolean';
            return a&&b;
        }
    });

    if (casillaProtectora.length != 0) {
        return true;
    }
    return false;
}
function makeChessSelf(element){
    let allCasillas = Array.from(document.querySelectorAll('.casilla'));
    let color = element.classList[0];
    let casillasAmenaza = allCasillas.filter(v => v.classList[0] == changeColor(color));
    let movimientosDelEnemigo=[];
    let movimientosFicha = movimientos(element);
    let respuesta =[false];

    for (const casilla of casillasAmenaza) {
        if (element.classList[1] != 'rey') {
            if (beams(casilla,getKing(color))[0].length == 1 && beams(casilla,getKing(color))[0][0]==(element.id)) { //casillas que protejen al rey no se pueden mover
                if (movimientos(element).includes(casilla.id)) {
                    return[true,[casilla.id]];
                }
                return [true,[]];
            }
        }
        for (const movimientoRey of movimientosFicha) {
            let bRes = beams(casilla,document.getElementById(movimientoRey));
            if (casillaProtegida(movimientoRey,changeColor(color))) {
                movimientosDelEnemigo.push(movimientoRey);
            }else if (bRes[0].length == 0 && bRes[1] !=false ) { // si no hay nadie que estorbe y si tiene recorrido
                movimientosDelEnemigo.push(movimientoRey);
            }else if (bRes[0].length == 1 && bRes[0][0] == element.id) {
                movimientosDelEnemigo.push(movimientoRey);
            }
        }
    }

    if (element.classList[1]=='rey') {
        let a = movimientosFicha.filter(v=>!movimientosDelEnemigo.includes(v));
        if (a!=movimientosFicha) {
            respuesta = [true,a];
        }
    }
    return respuesta;
}
function movimientosEnJaque(element){
    let color = element.classList[0];
    let casillaPosible = movimientos(element);
    let chekers = isInCheck(color)[1];
    let respuesta;
    //--------------------------------------------/
    if (makeChessSelf(element)[0]) {
        respuesta = makeChessSelf(element)[1];
    }else if (element.classList.contains('rey')) {
        let movimientosDelRey = movimientos(element);
        let movimientosDelEnemigo=[];
        let casillasLlenas = Array.from(document.querySelectorAll('.casilla')).filter(v=>v.classList.contains(changeColor(color))); //todas las casillas enemigas (y por lo tanto llenas)
        for (const casilla of casillasLlenas) { //cada ficha enemiga
            if (casilla.classList[1] == 'peon') {
                movimientosDelEnemigo.push(...movimientosPeon(casilla)[1]);
            }else{
                movimientosDelEnemigo.push(...movimientosValidos(casilla));
            }
        }
        respuesta = movimientosDelRey.filter(v=>!movimientosDelEnemigo.includes(v) && !casillaProtegida(v,changeColor(color)));

    }else if(chekers.filter(v => {v.classList[1] == 'peon' || v.classList[1] == 'caballo'}).length != 0){
        respuesta = [];
    }else if (chekers.length==1) {
        let cheker = chekers[0];
        if (typeof(beams(cheker,getKing(element.classList[0]))[1]) != 'boolean') {
            let movimientosCheker = beams(cheker,getKing(element.classList[0]))[1];
            movimientosCheker.push(cheker.id); // Comer la ficha que hace jaque
            respuesta = casillaPosible.filter(value => movimientosCheker.includes(value)); //La respuesta será en que casillas se intersectan los movimientos del peon y el del cheker
        }
    }
    return respuesta;
}
function castle(inicial,final,pos){
    //mover al rey a la pos final, mover a la torre a la derecha o izq del rey
    let claseFicha = inicial.classList[1];
    let color = inicial.classList[0];
    let ficha = inicial.innerHTML;
    let fila = parseInt(inicial.id.split(',')[0]);
    let torre;
    let torreFin;
    if (pos == 'der') {
        torre = document.getElementById(`${fila},8`);
        torreFin = document.getElementById(`${fila},6`);
    } else {
        torre = document.getElementById(`${fila},1`);
        torreFin = document.getElementById(`${fila},4`);
    }
    let ficha2 = torre.innerHTML;
    //-------------------------------------------------------------------------//
    // este es para rey
    let cL = Array.from(final.classList); //convierte el classList en array
    cL.unshift(claseFicha);
    cL.unshift(color);
    final.className = cL.join(' '); //modifica el className
    inicial.innerHTML = ''; //Borra la casilla anterior
    inicial.classList.remove(color,claseFicha,'moved'); // elimina las clases anteriores de la casilla inicial
    final.innerHTML = ficha; // escribe la ficha en la nueva casilla
    final.classList.add('moved'); // agrega la case moved
    //-------------------------------------------------------------------------//
    // este es para torre
    let cL2 = Array.from(torreFin.classList); //convierte el classList en array
    cL2.unshift('torre');
    cL2.unshift(color);
    torreFin.className = cL2.join(' '); //modifica el className
    torre.innerHTML = ''; //Borra la casilla anterior
    torre.classList.remove(color,'torre','moved'); // elimina las clases anteriores de la casilla inicial
    torreFin.innerHTML = ficha2; // escribe la ficha en la nueva casilla
    torreFin.classList.add('moved'); // agrega la case moved
    itsBlackTurn = !itsBlackTurn;
}
function move(){
    let elementoFinal = getTargetElement();
    let focusElement = getFocusElement();
    let ficha = focusElement.innerHTML; //el valor de unicode
    let color = focusElement.classList[0]; //el color de la ficha
    let claseFicha = focusElement.classList[1]; //la ficha pero clase
    let columnaElementoFinal = parseInt(elementoFinal.id.split(',')[1]);
    let columnaFocusElement = parseInt(focusElement.id.split(',')[1]);
    let filaElementoFinal = parseInt(elementoFinal.id.split(',')[0]);
    let filaFocusElement = parseInt(focusElement.id.split(',')[0]);

    let a = columnaElementoFinal == columnaFocusElement-2 && filaElementoFinal == filaFocusElement;
    let b = columnaElementoFinal == columnaFocusElement+2 && filaElementoFinal == filaFocusElement;

    if (claseFicha == 'rey' && a) {
        castle(focusElement,elementoFinal,'izq');
        return
    }else if (claseFicha == 'rey' && b) {
        castle(focusElement,elementoFinal,'der');
        return
    }

    if (!itsBlackTurn && focusElement.classList[1] == 'peon' && elementoFinal.id.split(',')[0]==8) {
        aparecerModalCoronar(elementoFinal,'white');

    }else if (itsBlackTurn && focusElement.classList[1] == 'peon' && elementoFinal.id.split(',')[0]==1) {
        aparecerModalCoronar(elementoFinal,'black');

    }

    if(elementoFinal.innerHTML!=''){ //existe una ficha
        let cL = Array.from(elementoFinal.classList);
        cL[0] = color;
        cL[1] = claseFicha;
        elementoFinal.className = cL.join(' ');
    }else{
        let cL = Array.from(elementoFinal.classList);
        cL.unshift(claseFicha);
        cL.unshift(color);
        elementoFinal.className = cL.join(' ');
    }

    focusElement.innerHTML = '';
    focusElement.classList.remove(color,claseFicha,'moved');
    elementoFinal.innerHTML = ficha;
    elementoFinal.classList.add('moved');
    itsBlackTurn = !itsBlackTurn;
    if (isCheckMate(changeColor(color))) {
        
    }
}
function isOut(element1,element2){
    if ( element1<9 && element1>0 && element2<9 && element2>0) {
        return false;
    }else{
        return true;
    }
}
function beams(element,target){ //Devuelve el id del objeto que al moverse produce jaque;
    let tipo = element.classList[1];
    let color = element.classList[0];
    let fila = parseInt(element.id.split(',')[0]);
    let columna = parseInt(element.id.split(',')[1]);
    let king = target; //document.querySelector(`.rey.${changeColor(color)}`);
    let kingFila = parseInt(king.id.split(',')[0]);
    let kingColumna = parseInt(king.id.split(',')[1]);
    let casilla;
    let recorrido = [];
    let casillasOcupadas=[];
    //---------------------------------------------------------------------------------//
    if (tipo == 'torre' || tipo == 'reina') {
        if (columna == kingColumna) { //La columna es igual
            if (kingFila>fila) {// El rey esta arriba
                recorrido=[];
                for (let i = 1; (fila+i)<kingFila; i++) {//Hasta llegar a la casilla del rey
                    casilla = document.getElementById(`${fila+i},${columna}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                }
            }else if (kingFila<fila) {
                //El rey esta abajo
                recorrido=[];
                for (let i = 1; (fila-i)>kingFila; i++) {//Hasta llegar a la casilla del rey
                    casilla = document.getElementById(`${fila-i},${columna}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                }
            }else{
                recorrido=false;
            }
        }else if (fila == kingFila) { //Si la fila es igual
            recorrido=[];
            if (kingColumna>columna) {// El rey esta a la derecha
                for (let i = 1; (columna+i)<kingColumna; i++) {//Hasta llegar a la casilla del rey
                    casilla = document.getElementById(`${fila},${columna+i}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                }
            }else if(kingColumna<columna){ // El rey esta a la izquierda
                for (let i = 1; (columna-i)>kingColumna; i++) {//Hasta llegar a la casilla del rey
                    casilla = document.getElementById(`${fila},${columna-i}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                }
            }else{
                recorrido=false;
            }
        }else{
            recorrido=false;
        }
    }

    if (tipo == 'alfil' || tipo == 'reina') {
        if (kingFila>fila) { //Arriba
            let k = kingFila-fila;
            if (kingColumna == columna+k) {//Arriba derecha
                recorrido=[];
                for (let i = 1; i < k; i++) {
                    casilla = document.getElementById(`${fila+i},${columna+i}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                }
            }else if (kingColumna == columna-k) { //Arriba Izquierda
                recorrido=[];
                for (let i = 1; i < k; i++) {
                    casilla = document.getElementById(`${fila+i},${columna-i}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                }
            }else if (tipo!='reina') {
                recorrido = false;
            }
        }else if (kingFila<fila){ //Abajo
            let k = fila-kingFila;
            if (kingColumna == columna+k) {//Abajo derecha
                recorrido=[];
                for (let i = 1; i < k; i++) {
                    casilla = document.getElementById(`${fila-i},${columna+i}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                    
                }
            }else if (kingColumna == columna-k) { //Abajo Izquierda
                recorrido=[];
                for (let i = 1; i < k; i++) {
                    casilla = document.getElementById(`${fila-i},${columna-i}`);
                    if (casilla.innerHTML!='') { //Si la casilla esta ocupada
                        if (casilla.classList.contains(color)) { //Si el color es igual
                            recorrido = false;
                            break
                        }
                        //Repeticion normal hasta llegar al rey
                        casillasOcupadas.push(casilla.id);   
                    }
                    recorrido.push(casilla.id);
                }
            }else if (tipo!='reina') {
                recorrido = false;
            }
        }else if (tipo!='reina') {
            recorrido = false;
        }
    }

    return [casillasOcupadas,recorrido];
}
function aparecerModalCoronar(element,color){
    let bModal = document.querySelector('.modal_background');
    let htmlCode;
    if (color == 'white') {
        htmlCode = `<div class="modal">
        <h3 class="modal__h3">Coronar el peon a:</h3>
        <ul>
            <li class="li li_reina">${reinaBlanca}</li>
            <li class="li li_torre">${torreBlanca}</li>
            <li class="li li_caballo">${caballoBlanco}</li>
            <li class="li li_alfil">${alfilBlanco}</li>
        </ul>
     </div>`;
    }else{
        htmlCode = `<div class="modal">
        <h3 class="modal__h3">Coronar el peon a:</h3>
        <ul>
            <li class="li li_reina">${reinaNegra}</li>
            <li class="li li_torre">${torreNegra}</li>
            <li class="li li_caballo">${caballoNegro}</li>
            <li class="li li_alfil">${alfilNegro}</li>
        </ul>
     </div>`;
    }
    bModal.innerHTML = htmlCode;
    bModal.style.display = 'flex';
    bModal.style.animation = "aparecer 500ms forwards";
    document.querySelector('.li_torre').addEventListener('click',()=>{
        bModal.style.display = 'none';
        coronar(element,color,'torre');
    });
    document.querySelector('.li_caballo').addEventListener('click',()=>{
        bModal.style.display = 'none';
        coronar(element,color,'caballo');
    });
    document.querySelector('.li_alfil').addEventListener('click',()=>{
        bModal.style.display = 'none';
        coronar(element,color,'alfil');
    });
    document.querySelector('.li_reina').addEventListener('click',(e)=>{
        bModal.style.display = 'none';
        coronar(element,color,'reina');
    });
}
function aparecerModalJaqueMate(color){
    let bModal = document.querySelector('.modal_background');
    let htmlCode;
    if (color == 'white') {
        htmlCode = `<div class="modal-jaque">
        <h3 class="mensaje-modal">Ganan blancas</h3>
        <button class="btn-play">Jugar de nuevo</button>
    </div>`;
    }else{
        htmlCode = `<div class="modal-jaque">
        <h3 class="mensaje-modal">Ganan negras</h3>
        <button class="btn-play">Jugar de nuevo</button>
    </div>`;
    }
    bModal.innerHTML = htmlCode;
    bModal.style.display = 'flex';
    bModal.style.animation = "aparecer 500ms forwards";
    document.querySelector('.btn-play').addEventListener('click',()=>{
        bModal.style.display = 'none';
        restartChess();
    })

}
function coronar(element,color,tipo){   
    let cL = Array.from(element.classList);
    cL[0] = color;
    cL[1] = tipo;
    element.className = cL.join(' ');
    if (color=='white') {
        switch (tipo) {
            case 'reina':
                element.innerHTML = reinaBlanca;
            break;
            case 'torre':
                element.innerHTML = torreBlanca;
            break;
            case 'caballo':
                element.innerHTML = caballoBlanco;
            break;
            case 'alfil':
                element.innerHTML = alfilBlanco;
            break;
        }
    } else {
        switch (tipo) {
            case 'reina':
                element.innerHTML = reinaNegra;
            break;
            case 'torre':
                element.innerHTML = torreNegra;
            break;
            case 'caballo':
                element.innerHTML = caballoNegro;
            break;
            case 'alfil':
                element.innerHTML = alfilNegro;
            break;
        }
    }
}
function isCheckMate(color){
    let allFichas = Array.from(document.querySelectorAll(`.casilla.${color}`));
    let movimientosFichas =[];
    allFichas.forEach(ficha =>{
        if (movimientosEnJaque(ficha)) {
            movimientosFichas.push(...movimientosEnJaque(ficha));
        }
    })

    if (movimientosFichas.length == 0) {
        return true;
    }
    return false;
}
function isDrowned(color){
    let allFichas = Array.from(document.querySelectorAll(`.${color}`));
    let movimientosFichas = [];
    for (const ficha of allFichas) {
        movimientosFichas.push(...movimientosValidos(ficha));
    }
    if (movimientosFichas.length == 0) {
        return true;
    }
    return false;
}
function aparecerModalDrowned(){
    let bModal = document.querySelector('.modal_background');
    let htmlCode = `<div class="modal-jaque">
        <h3 class="mensaje-modal">Rey ahogado</h3>
        <button class="btn-play">Jugar de nuevo</button>
    </div>`;
    
    bModal.innerHTML = htmlCode;
    bModal.style.display = 'flex';
    bModal.style.animation = "aparecer 500ms forwards";
    document.querySelector('.btn-play').addEventListener('click',()=>{
        bModal.style.display = 'none';
        restartChess();
    })
}
//---------------------------------------------------------------------------------//
//Inicio del juego
createChess();
document.querySelectorAll('.casilla').forEach(element=>{ //eventos  
    onClickAll(element);
    onFocusAll(element);
});