import {Anuncio_Auto } from "./anuncio.js";

    const div = document.getElementById('cont');
    let tabla = document.getElementById('tablita');
 
    const tbody = document.getElementById('tbody');
    const btnAlta = document.getElementById('alta');
    let listaAnuncios;
    let idModificar;
    let frm;
    let anuncios;
    let ventas;
    const btnModificar = document.getElementById('btnModificar');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnCancelar = document.getElementById('btnCancelar');
    btnCancelar.addEventListener('click', cancelar);

    function mostrarBotones(tr){
        
        if(tr){

            tr.addEventListener('click',function(e){
                idModificar=e.target.parentNode.id;
             
                document.getElementById('btnModificar').style.display = 'inline';
                document.getElementById('btnEliminar').style.display = 'inline';
                document.getElementById('btnCancelar').style.display = 'inline';
             
                
                buscarElemento(e.target.parentNode.id);
                
                btnModificar.addEventListener('click', modificarAnuncio);
                
                btnEliminar.addEventListener('click', bajaAnuncio);
            });
        
        }
        
    }

    function buscarElemento(id){
        
        listaAnuncios.forEach(element => {
                
            if(element['id'] == id){
    
                document.getElementById('txtTitulo').value = element['titulo'];
                frm.transaccion.value = element['transaccion'];
                document.getElementById('txtDescripcion').value = element['descripcion'];
                document.getElementById('txtPrecio').value = element['precio'];
                document.getElementById('txtPuertas').value = element['puertas'];
                document.getElementById('txtKMs').value = element['kms'];
                document.getElementById('txtPotencia').value = element['potencia'];
              
            }
    
        });
       
    }

    function limpiarFormulario() {
        const frm = document.forms[0];
        frm.reset();
    }

    function cancelar(){

        limpiarFormulario();
        document.getElementById('btnModificar').style.display = 'none';
        document.getElementById('btnEliminar').style.display = 'none';
        document.getElementById('btnCancelar').style.display = 'none';
      }

      window.addEventListener('load',inicializaManejadores);

    function inicializaManejadores(){

    
        actualizarLista();
        frm = document.forms[0];
        btnAlta.addEventListener('click',altaAnuncio);
    
        
    }

    function actualizarLista(){
    
        while(div.hasChildNodes()){
            div.removeChild(div.firstChild);
        }
        const gif = document.createElement('img');
        gif.setAttribute('src',"./img/rueda.gif");
        gif.classList.add('gif');
        gif.classList.add('center');

        div.appendChild(gif);


        setTimeout(() => {
            while(div.hasChildNodes()){
                div.removeChild(div.firstChild);
            }
            
            traerAnuncios();
        }, 3000);
    
    }

    function crearCabecera(item){
        //const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        const thead = document.createElement('thead');
        thead.classList.add('bg-primary');
        for(const key in item){

            const th = document.createElement('th');
            const texto = document.createTextNode(key);
            th.appendChild(texto);
            let checkBox = document.getElementById(key);
            if(checkBox.checked){
                tr.appendChild(th);

            }else if(key == "id"){
                th.remove();
            }
            
        }
        thead.appendChild(tr);
        return thead;
    }

const crearTr = (data)=>{
    //guardo los anuncios en nuevo vec 
    listaAnuncios = [...data];
    const fragmento = document.createDocumentFragment();
    // const tbody2= document.createElement('tbody');
    
    data.forEach(element => {
       
        const tr = document.createElement('tr');
      
        for(const key in element){
            const td = document.createElement('td');
            const texto = document.createTextNode(element[key]);
            td.appendChild(texto);
            tr.appendChild(td);
        
        }
       
        if( element.hasOwnProperty('id')){
               
            tr.setAttribute('id',element['id']);
            
        }   
         mostrarBotones(tr);
        fragmento.appendChild(tr);
    });
    
    
    return fragmento;
}

function filtrarLista(lista){

    let retorno = [];
    
    retorno = lista.map(row => {
        let fila = {};

        for (const key in row) {
          
            let checkBox = document.getElementById(key);
            
                if(checkBox.checked){
                    fila[key] = row[key];

                 }
                
        }
        return fila;        
    });
    return retorno;
}   

function traerAnuncios(){
    
    tbody.innerHTML=""; 
    

    fetch('http://localhost:3000/anuncios')
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(data=>{

        anuncios = data.map((item)=>{
            return new Anuncio_Auto(item.id, item.titulo, item.transaccion, item.descripcion, item.precio, item.puertas, item.kms, item.potencia);
        })
        

        document.getElementById('id').addEventListener('click',mostrar);
        document.getElementById('titulo').addEventListener('click',mostrar);
        document.getElementById('transaccion').addEventListener('click',mostrar);
        document.getElementById('descripcion').addEventListener('click',mostrar);
        document.getElementById('precio').addEventListener('click',mostrar);
        document.getElementById('puertas').addEventListener('click',mostrar);
        document.getElementById('kms').addEventListener('click',mostrar);
        document.getElementById('potencia').addEventListener('click',mostrar);
        
        mostrarTablaFiltros();
        
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{
        
       
    })
}


function mostrarTablaFiltros(){
               

                document.getElementById('id').checked = false;
                document.getElementById('titulo').checked = false;
                document.getElementById('transaccion').checked = false;
                document.getElementById('descripcion').checked = false;
                document.getElementById('precio').checked = false;
                document.getElementById('puertas').checked = false;
                document.getElementById('kms').checked = false;
                document.getElementById('potencia').checked = false;
             
                let losAnuncios;
                let objeto;
                
                losAnuncios = obtenerAnuncios();
                objeto =losAnuncios[0];

                for (const property in objeto) {
                    
                    if(property)
                    document.getElementById(property).checked = true;
                  }
                


                let nuevasLista = obtenerAnuncios(); 
                tabla.appendChild(crearCabecera(nuevasLista[0]));
                filtroSelect();
               
                tbody.appendChild(crearTr(filtrarLista(nuevasLista)));
                tabla.appendChild(tbody);
                div.appendChild(tabla);
                promedioTodos();
}

function mostrar(){

          
            tabla.innerHTML="";
            tbody.innerHTML="";
            tabla.appendChild(crearCabecera(anuncios[0]));
            tbody.appendChild(crearTr(filtrarLista(anuncios)));
            tabla.appendChild(tbody);
            div.appendChild(tabla);
            guardarDatos(anuncios);
}
        
function guardarDatos(lista){

    localStorage.setItem("anuncios",JSON.stringify(filtrarLista(lista)));
    

}


function obtenerAnuncios(){

    return JSON.parse(localStorage.getItem("anuncios")) || [];
    
}

function filtroSelect(){
  
    const selectElement = document.querySelector('#txtTransaccion2');
            selectElement.addEventListener('change', (event) => {
             ventas = anuncios.filter(trans =>trans.transaccion === event.target.value);

             if( event.target.value == "Todos"){
                tabla.innerHTML="";
                tbody.innerHTML="";
                tabla.appendChild(crearCabecera(anuncios[0]));
                tbody.appendChild(crearTr(filtrarLista(anuncios)));
                tabla.appendChild(tbody);
                div.appendChild(tabla);
                guardarDatos(anuncios);
                promedioTodos();

             }else{
                tabla.innerHTML="";
                tbody.innerHTML="";
                tabla.appendChild(crearCabecera(ventas[0]));
                tbody.appendChild(crearTr(filtrarLista(ventas)));
                tabla.appendChild(tbody);
                div.appendChild(tabla);
                guardarDatos(ventas);
                  
                    let totalPromedio = ventas.reduce((previo,actual)=>{
                    return {precio:parseInt(previo.precio) + parseInt(actual.precio)};
                    });
                    document.getElementById('promedio').value = parseFloat(totalPromedio.precio/ventas.length);

                    let mayor = ventas.reduce((previo,actual)=>{
        
                        return {potencia:previo.potencia > actual.potencia ? previo.potencia:actual.potencia};
                    })
                    
                    document.getElementById('mayor').value =mayor.potencia;
                
                    let menor = ventas.reduce((previo,actual)=>{
                        
                        return {potencia:previo.potencia < actual.potencia ? previo.potencia:actual.potencia};
                    })
                    
                    document.getElementById('menor').value =menor.potencia;
           
             }
            
             
        });
}
function promedioTodos(){
    let totalPromedio = anuncios.reduce((previo,actual)=>{
        return {precio:parseInt(previo.precio) + parseInt(actual.precio)};
    });
    document.getElementById('promedio').value = parseFloat(totalPromedio.precio/anuncios.length);

    let totalPromedioPotencia = anuncios.reduce((previo,actual)=>{
        return {potencia:parseInt(previo.potencia) + parseInt(actual.potencia)};
    });
    document.getElementById('proPotencia').value = parseFloat(totalPromedioPotencia.potencia/anuncios.length);

    let mayor = anuncios.reduce((previo,actual)=>{
        
        return {potencia:previo.potencia > actual.potencia ? previo.potencia:actual.potencia};
    })
    
    document.getElementById('mayor').value =mayor.potencia;

    let menor = anuncios.reduce((previo,actual)=>{
        
        return {potencia:previo.potencia < actual.potencia ? previo.potencia:actual.potencia};
    })
    
    document.getElementById('menor').value =menor.potencia;


}   
function altaAnuncio(){
    

    let nuevoAnuncio = {
    "id": "",
    "titulo":document.getElementById('txtTitulo').value,
    "transaccion":frm.transaccion.value,
    "descripcion":document.getElementById('txtDescripcion').value,
    "precio":document.getElementById('txtPrecio').value,
    "puertas":document.getElementById('txtPuertas').value,
    "kms":document.getElementById('txtKMs').value,
    "potencia":document.getElementById('txtPotencia').value
    };

    

    const config ={
        method:"POST",
        headers:{
            "Content-type":"application/json;charset=utf-8"
        },
        body:JSON.stringify(nuevoAnuncio)
    }
    
    fetch('http://localhost:3000/anuncios',config)
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(autoAgregado=>{
      
        console.log("Alata exitosa!",autoAgregado);
     
        actualizarLista();
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{
        limpiarFormulario();
        
    })

}


function modificarAnuncio(){
    
    const id =idModificar;
    let a = {
        "id": "",
        "titulo":document.getElementById('txtTitulo').value,
        "transaccion":frm.transaccion.value,
        "descripcion":document.getElementById('txtDescripcion').value,
        "precio":document.getElementById('txtPrecio').value,
        "puertas":document.getElementById('txtPuertas').value,
        "kms":document.getElementById('txtKMs').value,
        "potencia":document.getElementById('txtPotencia').value
        };


    const config ={
        method:"PUT",
        headers:{
            "Content-type":"application/json;charset=utf-8"
        },
        body:JSON.stringify(a)
    }
    
    fetch('http://localhost:3000/anuncios/' + id,config)
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(anuncio=>{
      
        console.log("Modificación exitosa!",anuncio);

        actualizarLista();
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{
    })

}

function bajaAnuncio(){
    
    const id =idModificar;

    const config ={
        method:"DELETE",
        headers:{
            "Content-type":"application/json;charset=utf-8"
        }
        
    }
    
    fetch('http://localhost:3000/anuncios/' + id,config)
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(anuncio=>{
      
        console.log("Baja exitosa!",anuncio);
        actualizarLista();
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{

    
    })

}












