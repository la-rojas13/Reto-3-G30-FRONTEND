$(document).ready(function () {
    $("#btn-actualizar").hide();
})


function traerInformacion() {
    showSpinner()
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/Reservation/all",
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
                <th>START DATE</th>
                <th>DEVOLUTION DATE</th> 
                <th>CLIENT</th> 
                <th>COMPUTER</th>    
                <th colspan="2">Acciones</th>        
                </tr>
              </thead>
              `;

    for (let i = 0; i < items.length; i++) {
        tabla += `<tr>
                             <td>${items[i].startDate}</td>
                             <td>${items[i].devolutionDate}</td>
                             <td>${items[i].client.name}</td>
                             <td>${items[i].computer.name}</td>
                             <td><button class="btn btn-primary" onclick="editarRegistro(${items[i].idReservation})">Editar</td>
                             <td><button class="btn btn-danger" onclick="borrarConfirmacion(${items[i].idReservation})">Borrar</td>      

                </tr>
        `;
    }

    tabla += `</table>`;

    $("#table-container").html(tabla);

}

// Agregar

function agregar() {
    console.log(Date.parse($("#startDate").val()))
    var datos = {
        startDate: $("#startDate").val(),
        devolutionDate: $("#devolutionDate").val(),
        client: { idClient: $("#client").val() },
        computer: { id: $("#computer").val() }

    }
    console.log(datos)
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://localhost:8080/api/Reservation/save",
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
        url: "http://localhost:8080/api/Reservation/" + numId,
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
    $("#status-container").show();
    $("#brand").focus();
    console.log($("#status").val())
    $("#client").prop('disabled', true);
    $("#computer").prop('disabled', true);
    var datos = {
        id: numId
    }

    $.ajax({
        url: "http://localhost:8080/api/Reservation/" + numId,
        type: 'GET',
        dataType: 'json',

        success: function (respuesta) {
            let items = respuesta;
            console.log(items.id)
            $("#id").val(items.idReservation)
            $("#startDate").val(items.startDate),
                $("#devolutionDate").val(items.devolutionDate),
                $("#client").val(items.client.idClient),
                $("#computer").val(items.computer.id),
                $("#status").val(items.status).prop('selected', true)
        },
        error: function (xhr, status) {
            console.log(status);
        }
    });

}

function actualizar() {
    var datos = {
        idReservation: $("#id").val(),
        startDate: $("#startDate").val(),
        devolutionDate: $("#devolutionDate").val(),
        client: { idClient: $("#client").val() },
        computer: { id: $("#computer").val() },
        status: $("#status").val()
    }
    let datosPeticion = JSON.stringify(datos);
    console.log("datos actualizar:" + datosPeticion)

    $.ajax({
        url: "http://localhost:8080/api/Reservation/update",
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
            $("#status-container").hide();
            $("#client").prop('disabled', false);
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
    $("#startDate").val("");
    $("#devolutionDate").val("");
    $("#client").val("");
    $("#computer").val("");
    $("#status").val("");
}