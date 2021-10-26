$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/Category/all",
        dataType: "JSON",
        success: function (response) {
            console.log(response)
            listarRespuesta(response)
            hideSpinner();
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });
}

function listarRespuesta(items) {

    var tabla = `<table class="table table-bordered">
    <thead class="thead-dark">
              <tr>
                <th>Name</th>
                <th>DESCRIPTION</th>
                <th>COMPUTERS</th>
                <th colspan="2">Acciones</th>
              </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
                             <td>${items[i].name}</td>
                             <td>${items[i].description}</td>
                             <td>${computersName(items[i].computers)}</td>   
                             <td><button class="btn btn-primary" onclick="editarRegistro(${items[i].id})">Editar</td>
                             <td><button class="btn btn-danger" onclick="borrarConfirmacion(${items[i].id})">Borrar</td>    
                </tr>
        `;
    }

    tabla += `</table>`;

    $("#table-container").html(tabla);

}

// Agregar

function agregar() {

    var datos = {
        name: $("#name").val(),
        description: $("#description").val()

    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://localhost:8080/api/Category/save",
        data: datosPeticion,
        type: 'POST',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Insertado");
            traerInformacion();
            limpiarCampos()
            swal("Operación exitosa", "Elemento agregado", "success");
        },

        error: function (xhr, status) {
            console.log(status);
            swal("Error", "No se pudo agregar el elemento", "error");
        }
    });


}

// Borrar elemento

// modal confirmacion
function borrarConfirmacion(id) {
    swal({
        title: "Esta seguro?",
        text: "Los datos no podran ser recuperados",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                borrar(id)
                swal("El elemento fue eliminado", {
                    icon: "success",
                });
            } else {
                swal("El elemento no se borrara");
            }
        });
}



function borrar(numId) {
    var datos = {
        id: numId
    }

    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://localhost:8080/api/Category/" + numId,
        data: datosPeticion,
        type: 'DELETE',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Borrado");
            traerInformacion();
        },

        error: function (xhr, status) {
            console.log("este es el status" + status + xhr);
            swal("El elemento no puede ser eliminado, ya que tiene elementos asociados", {
                icon: "warning",
            });
        }
    });

}
// Editar

function editarRegistro(numId) {
    $("#btn-actualizar").show();
    $("#btn-agregar").hide();
    $("#btn-listar").hide();
    $("#name").focus();
    var datos = {
        id: numId
    }

    $.ajax({
        url: "http://localhost:8080/api/Category/" + numId,
        type: 'GET',
        dataType: 'json',

        success: function (respuesta) {
            let items = respuesta;
            console.log(items.name);
            $("#id").val(items.id)
                $("#name").val(items.name),
                $("#description").val(items.description)
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });

}

function actualizar() {
    var datos = {
        id: $("#id").val(),
        name: $("#name").val(),
        description: $("#description").val(),
    }

    let datosPeticion = JSON.stringify(datos);
    console.log("datos actualizar:" + datosPeticion)

    $.ajax({
        url: "http://localhost:8080/api/Category/update",
        data: datosPeticion,
        type: 'PUT',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Actualizado");
            traerInformacion();
            swal("Operación exitosa", "Elemento actualizado", "success");
            limpiarCampos();
            $("#btn-actualizar").hide();
            $("#btn-agregar").show();
            $("#btn-listar").show();
            $("#id").prop('disabled', false);
        },

        error: function (xhr, status) {
            console.log(status);
            swal("Error", "No se pudo actualizar el elemento", "error");
        }
    });
}
// Function to hide the Spinner
function hideSpinner() {
    document.getElementById('spinner')
        .style.display = 'none';
}

function showSpinner() {
    document.getElementById('spinner')
        .style.display = 'block';
}

function limpiarCampos() {
    $("#name").val("");
    $("#description").val("");
}

function computersName(array){
    let names = []
 array.forEach(pc =>{
    names.push(pc.name) 
 })
 return names.toString();
}