//var zone = [{zadajnik:1, modul: 2, przekaznik: 3, tempZad: 25}, {zadajnik:2, modul: 3, przekaznik: 1, tempZad: 31}];
var zone;
var div = $("#heatingZone");

function showHeatingZones(){
    div.empty();
    if(zone != undefined)
        for(i = 1; i <= zone.length; i++)    {
            z = zone[i-1];
            addHeatingZone(i, z.zadajnik, z.modul, z.przekaznik, z.tempZad);
        }
    else
        zone =[];
}
showHeatingZones();

function reloadRelay(id, _r)  {
    if(!_r) _r = 0;
    $("#zone"+id).find('.przekaznik').empty();
    $("#zone"+id).find('.przekaznik').append("<option value='0' disabled>-- Wybierz przekaźnik -- </option>");
    var mod = $("#zone"+id).find('.modul').val();
    
    if(mod) {
        for(k = 0; k < CtrList.length; k++)	
            if(CtrList[k].address == mod) mod = k;

        for(k = 0; k < CtrList[mod].relay.length; k++)	{
            r = CtrList[mod].relay[k];
            if(r) 
                $("#zone"+id).find('.przekaznik')
                .append("<option value='"+(k+1)+"'>"+(k+1)+". "+r+"</option>");
        }
    }
    $("#zone"+id).find('.przekaznik').find('option[value="'+_r+'"]').attr('selected','selected');

}
        // id, switch, module, relay, tempZad
function addHeatingZone(id, _s, _m, _r, _t){
        if(id == undefined) {
            if(zone != undefined)
                id = zone.length+1;
            else
                id = 1;
            _s = _m = _r = 0;
            _t = null;
            zone.push({zadajnik:0, modul: 0, przekaznik: 0, tempZad: null});
            console.log("NOWY",id);
        }

        div.append('<tr id="zone'+id+'" class="row">\
        <td class="col-lg-3 input-group"> <span class="badge-pill badge-primary align-bottom">'+id+'. </span>&nbsp;<div class="input-group-prepend">\
            <span class="input-group-text"><span class="oi oi-account-login"/></span>\
        </div> <select class="form-control zadajnik"></select></td>\
        \
        <td class="col-lg-3 input-group"> <div class="input-group-prepend">\
            <span class="input-group-text"><span class="oi oi-account-logout"/></span>\
            </div> <select class="form-control modul"></select></td>\
        \
        <td class="col-lg-3 input-group"> <div class="input-group-prepend">\
            <span class="input-group-text"><span class="oi oi-fork"/></span>\
            </div> <select class="form-control przekaznik"></select></td>\
        \
        <td class="col-lg-2 input-group">  <div class="input-group-prepend">\
            <span class="input-group-text"><span class="oi oi-fire"/></span>\
            </div> <input type="number" class="form-control tempZad" placeholder="Zadana"/>\
        </td>\
		<td class="col-lg-1"> \
            <button class="btn btn-outline-danger" onclick="removeZone('+id+')"><span class="oi oi-x"/></button>\
        </td>\
        </tr>');
        ///ZADAJNIKI 
        $("#zone"+id).find('.zadajnik').empty();
        $("#zone"+id).find('.zadajnik').append("<option value='0' disabled>-- Wybierz zadajnik -- </option>");
        for(k = 0; k < SwList.length; k++)	{
            s = SwList[k];
            
           // if(s.button[0].length + s.button[1].length + s.button[2].length+s.button[3].length == 0)
                $("#zone"+id).find('.zadajnik')
                .append("<option value='"+s.address+"'>"+s.name+"</option>");
        }
        $("#zone"+id).find('.zadajnik').find('option[value="'+_s+'"]').attr('selected','selected');

        //modulY
        $("#zone"+id).find('.modul').children().remove();
        $("#zone"+id).find('.modul').append("<option value='0' disabled>-- Wybierz moduł -- </option>");
        for(k = 0; k< CtrList.length; k++)	{
            c = CtrList[k];
            if(c.mode == 3) 
                $("#zone"+id).find('.modul')
                .append("<option value='"+c.address+"'>"+c.name+"</option>");
        }
        $("#zone"+id).find('.modul').find('option[value="'+_m+'"]').attr('selected','selected');
        reloadRelay(id, _r);

        $("#zone"+id).find('.modul').change(function(){
           reloadRelay(id); 
           updateZone(id);
        });
        $("#zone"+id).find('.zadajnik').change(function(){
            updateZone(id);
        });
        $("#zone"+id).find('.przekaznik').change(function(){
            updateZone(id);
        });
        $("#zone"+id).find('.tempZad').change(function(){
            updateZone(id);
        });

        $("#zone"+id).find('.tempZad').val(_t);

}

function removeZone(id)   {
	var r = confirm("Czy na pewno chcesz usunąć strefę?");
	
	if(r == true)	{
		zone.splice(id-1, 1);
		showHeatingZones();
	}
}

function updateZone(id) {
    zone[id-1].zadajnik = $("#zone"+id).find(".zadajnik").val();
    zone[id-1].modul = $("#zone"+id).find(".modul").val();
    zone[id-1].przekaznik = $("#zone"+id).find(".przekaznik").val();
    zone[id-1].tempZad = $("#zone"+id).find(".tempZad").val();
    console.log(zone[id-1]);
}

var abort = 0;
var queue = [];

function sendHeatingZone(){
	var r = confirm("Czy na pewno chcesz wysłać konfigurację do sterownika?");
	if(r == true)	{
		abort = 0 ;
		for(l = 0; l < zone.length; l++) 
			if(zone[l].zadajnik == 0 || zone[l].modul == 0 || zone[l].przekaznik == 0 || zone[l].tempZad == 0){
				alert("Uzupełnij wszystkie pola");
				abort = 1;
				break;
			} 
			
		if (abort == 0)	{
			queue = [];
			for(l = 0; l < zone.length; l++)    {
				zoneId = l+1;
				queue.push({"a":"GRZANIE"+zoneId+"_ZADAJNIK_ADRES","v": zone[l].zadajnik});
				queue.push({"a":"GRZANIE"+zoneId+"_WYKONAWCZY_ADRES","v": zone[l].modul});
				queue.push({"a":"GRZANIE"+zoneId+"_WYKONAWCZY_NR_OUTPUT","v": zone[l].przekaznik});
				queue.push({"a":"GRZANIE"+zoneId+"_TEMPERATURA_ZADANA","v": zone[l].tempZad});
			}
			
			$("#maxAmount").text(queue.length);
			$("#bottomPanelMsg").text("Trwa wysyłanie konfiguracji grzewczej");
			console.log(queue);
			sendGroup(queue);
			$('#bottomPanel').animate({'bottom':'5px'},500);
		}
	}
}


function sendHeatingDefault()	{
	var r = confirm("Czy na pewno chcesz przywrócić ustawienia fabryczne?");
		
	if(r == true)	{
		for(a = 1; a <= 32; a++)	{
			queue.push({"a":"GRZANIE"+a+"_ZADAJNIK_ADRES","v": 0});
			queue.push({"a":"GRZANIE"+a+"_WYKONAWCZY_ADRES","v": 0});
			queue.push({"a":"GRZANIE"+a+"_WYKONAWCZY_NR_OUTPUT","v": 0});
			queue.push({"a":"GRZANIE"+a+"_TEMPERATURA_ZADANA","v": 0});
		}
		
		$("#maxAmount").text(queue.length);
		$("#bottomPanelMsg").text("Trwa przywracanie ustawień fabrycznych ");
		console.log(queue);
		sendGroup(queue);
		$('#bottomPanel').animate({'bottom':'5px'},500);
	}
}