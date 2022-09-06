﻿$("#datepickerTecnico").datepicker(
    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
    }
);

listar();
$.get("Tecnico/listarEstado", function (data) {
    llenarCombo(data, document.getElementById("cboTecnico"), true)
    llenarCombo(data, document.getElementById("cboEstadoPopup"), true)
});

var btnBuscar = document.getElementById("btnBuscar");
btnBuscar.onclick = function () {
    var idestado = document.getElementById("cboTecnico").value;
    if (idestado == "") {
        listar();
    } else      
        $.get("Tecnico/filtrarEstado/?idestado=" + idestado, function (data) {
        crearListado(["ID", "Nombre", "Apellido", "Telefono", "Fecha Alt", "Estado"], data);
        });
}

function llenarCombo(data, control, primerElemento) {
    var contenido = "";
    if (primerElemento == true) {
        contenido += "<option value=''>--Seleccione--</option>";
    }
    for (var i = 0; i < data.length; i++) {
        contenido += "<option value='" + data[i].ID + "'>";
        contenido += data[i].Estados;
        contenido += "</option>";
    }
    control.innerHTML = contenido;
}

var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function () {
    listar();
}

function listar() {
    $.get("Tecnico/listarTecnico", function (data) {
        crearListado(["ID", "Nombre", "Apellido", "Telefono", "Fecha Alt", "Estado"], data)
    });
}

function crearListado(arrayColumnas, data) {
    var contenido = "";
    contenido += "<table id='tabla-tecnico' class='table'>";
    contenido += "<thead>";

    contenido += "<tr>";
    for (var i = 0; i < arrayColumnas.length; i++) {
        contenido += "<td>";
        contenido += arrayColumnas[i];
        contenido += "</td>";
    }
    //Añadimos columna para las acciones
    contenido += "<td>Acciones</td>";
    contenido += "</tr>";

    contenido += "</thead>";
    var llaves = Object.keys(data[0]);
    contenido += "<tbody>";
    for (var i = 0; i < data.length; i++) {
        contenido += "<tr>";
        for (var j = 0; j < llaves.length; j++) {
            var valorLlaves = llaves[j];
            contenido += "<td>";
            contenido += data[i][valorLlaves];
            contenido += "</td>";
        }
        var llaveID = llaves[0];
        //Añadir iconos
        contenido += "<td>"
        contenido += "<button class='badge rounded-pill bg-success' onclick='abrirModal(" + data[i][llaveID] + ")' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'>Editar</i></ button> "
        contenido += " <button class='badge rounded-pill bg-danger' onclick='eliminar(" + data[i][llaveID] + ")'><i class='glyphicon glyphicon-trash'></i>Borrar</button>"
        contenido += "</td>"

        contenido += "</tr>";
    }
    contenido += "</tbody>";
    contenido += "</table>";

    document.getElementById("tabla").innerHTML = contenido;

    $("#tabla-tecnico").dataTable({
        searching: false
    });
}

function eliminar(id) {
    if (confirm("¿Desea eliminar el dato?") == 1) {
        $.get("Tecnico/eliminar/?id=" + id, function (data) {
            if (data == 0) {
                alert("Ocurrió un error");
            } else {
                alert("Se elimino correctamente");
                listar();
            }
        });
    }
}

function abrirModal(id) {
    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;
    for (var i = 0; i < ncontroles; i++) {
        controlesObligatorios[i].parentNode.classList.remove("error");
    }
    if (id == 0) {
        borrarDatos();
    } else {
        $.get("Tecnico/recuperarDatos/?id=" + id, function (data) {
            document.getElementById("txtIDtecnico").value = data[0].IDtecnico;
            document.getElementById("txtNombre").value = data[0].Nombre;
            document.getElementById("txtApellido").value = data[0].Apellido;
            document.getElementById("txtTelefono").value = data[0].Telefono;
            document.getElementById("datepickerTecnico").value = data[0].fechaAlta;
            document.getElementById("cboEstadoPopup").value = data[0].IDestado;
        });
    }
}

function Agregar() {
    if (datosObligatorios() == true) {
        var frm = new FormData();
        var id = document.getElementById("txtIDtecnico").value;
        var nombre = document.getElementById("txtNombre").value;
        var apellido = document.getElementById("txtApellido").value;
        var telefono = document.getElementById("txtTelefono").value;
        var fecha = document.getElementById("datepickerTecnico").value;
        var estado = document.getElementById("cboEstadoPopup").value;

        frm.append("IDtecnico", id);
        frm.append("Nombre", nombre);
        frm.append("Apellido", apellido);
        frm.append("Telefono", telefono);
        frm.append("FechaAlt", fecha);
        frm.append("IDestado", estado);

        if (confirm("¿Desea guardar los cambios?") == 1) {
            $.ajax({
                type: "POST",
                url: "Tecnico/guardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == 1) {
                        alert("El dato se guardó correctamente");
                        listar();
                        document.getElementById("btnCancelar").click();
                    } else {
                        if (data == -1) {
                            alert("El técnico ya existe");
                        }
                        alert("Ocurrio un error");
                    }
                }
            });
        }
    }
}

function borrarDatos() {
    var controles = document.getElementsByClassName("borrar");
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }
}

function datosObligatorios() {
    var exito = true;
    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;
    for (var i = 0; i < ncontroles; i++) {
        if (controlesObligatorios[i].value == "") {
            exito = false;
            controlesObligatorios[i].parentNode.classList.add("error");
        } else {
            controlesObligatorios[i].parentNode.classList.remove("error");
        }
    }
    return exito;
}

