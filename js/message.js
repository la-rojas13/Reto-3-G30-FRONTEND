$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/Message/all",
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
                <th>MESSAGE</th>
                <th>COMPUTER</th> 
                <th>CLIENT</th> '
                <th colspan="2">Acciones</th>            
                </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
                             <td>${items[i].messageText}</td>
                             <td>${items[i].computer.name}</td>
                             <td>${items[i].client.name}</td>
                             <td><button class="btn btn-primary" onclick="editarRegistro(${items[i].idMessage})">Editar</td>
                             <td><button class="btn btn-danger" onclick="borrarConfirmacion(${items[i].idMessage})">Borrar</td>      
                </tr>
        `;
    }

    tabla += `</table>`;

    $("#table-container").html(tabla);

}

// Agregar

function agregar() {
    var datos = {
        messageText: $("#message").val(),
        client: {idClient: $("#client").val()},
        computer: {id: $("#computer").val()}

    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://localhost:8080/api/Message/save",
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
        url: "http://localhost:8080/api/Message/" + numId,
        data: datosPeticion,
        type: 'DELETE',
        contentType: "application/JSON",

        success: function (respuesta) {
            console.log("Borrado");
            traerInformacion();
        },

        error: function (xhr, status) {
            console.log(status);
            swal("El elemento no puede ser eliminado, ya que tiene elementos asociados", {
                icon: "warning",
            });
        }
    });

}
// Editar

function editarRegistro(numId) {
    console.log(numId)
    $("#btn-actualizar").show();
    $("#btn-agregar").hide();
    $("#btn-listar").hide();
    $("#message").focus();
    $("#computer").prop('disabled', true);
    var datos = {
        id: numId
    }

    $.ajax({
        url: "http://localhost:8080/api/Message/" + numId,
        type: 'GET',
        dataType: 'json',

        success: function (respuesta) {
            let items = respuesta;
            console.log(items.client.name)
             $("#id").val(items.idMessage),
            $("#message").val(items.messageText),
            $("#client").val(items.client.idClient),
            $("#computer").val(items.computer.id)
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });

}

function actualizar() {
    var datos = {
        idMessage: $("#id").val(),
        messageText: $("#message").val(),
        client: { idClient: $("#client").val() },
        computer: {id: $("#computer").val()}
    }
console.log($("#client").val())
    let datosPeticion = JSON.stringify(datos);
    console.log("datos actualizar:" + datosPeticion)

    $.ajax({
        url: "http://localhost:8080/api/Message/update",
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
            $("#computer").prop('disabled', false);
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
    $("#message").val("");
    $("#client").val("");
    $("#computer").val("");
}