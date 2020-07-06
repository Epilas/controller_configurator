function loadConfig()	{
		var request = $.ajax
		({
			url        : "smarthome/config/read/data",
			timeout		:	3000, 
			type       	: 	"POST",
		//	data       	: 	state.toString(), 
			contentType :  "application/json",
			headers    	: 	{"Accept": "application/json"},
			dataType	:	"json"
		});
		
		request.done( function(data) 
		{ 
			groups = data.groups;
			zone = data.zone;
			if(data.satelCfg) satelCfg = data.satelCfg;
			if(data.satel.length >= satel.length) satel = data.satel;
			SwList = [];
			for(i = 0; i < data.SwList.length; i++)	{
				SwList.push(new Switch(data.SwList[i].name,data.SwList[i].address,data.SwList[i].buttonsNumber));
				console.log("Dodano SW");
				for(j = 0; j < 4; j++)	{
					for(k = 0; k < data.SwList[i].button[j].length; k++)	{
						SwList[i].addButton(j, data.SwList[i].button[j][k]);
						console.log("Dodano btn");
					}
				}
			}
			
			CtrList = [];
			for(i = 0; i < data.CtrList.length; i++)	{
				console.log(data.CtrList[i].mode);
				CtrList.push(new Controller(data.CtrList[i].address, data.CtrList[i].name, data.CtrList[i].mode));
					
				for(j = 0; j < 8; j++)	{
					CtrList[i].editRelay(j, data.CtrList[i].relay[j])
				}
			}
			console.log(data);
			
			alert("Konfiguracja została wczytana")
		});
		
		request.fail( function(jqXHR, textStatus ) 
		{ 
			console.log( "Failure: " + textStatus );
		});
}

function saveConfig()	{
	
		data = {"SwList":SwList, "CtrList":CtrList, "groups": groups, "zone": zone, "satel": satel, "satelCfg": satelCfg};
		console.log(data);
		var request = $.ajax
		({
			url        : "smarthome/config/write/data",
			timeout		:	3000, 
			type       	: 	"POST",
			data       	: 	JSON.stringify(data), 
			contentType : "application/json",
			headers    	: 	{ "Accept": "application/json"},
			dataType	:	"json"
		});
		
		request.done( function(data) 
		{ 
			alert("Konfiguracja zapisana na sterowniku");
			console.log( data );
		});
		
		request.fail( function(jqXHR, textStatus ) 
		{ 
			console.log( "Failure: " + textStatus );
		});
}

function changePassword()	{
		
	stareHaslo = $("#stareHaslo").val();
	noweHaslo = $("#noweHaslo").val();
	if(!stareHaslo && !noweHaslo) {
		alert("Wypełnij wszystkie pola");
		return false;
	}
	if( noweHaslo.length < 5) {
		alert("Za krótkie hasło");
		return false;
	}
	
	var request = $.ajax
	({
		url        : "smarthome/user/change_password",
		timeout		:	3000, 
		type       	: 	"POST",
		data       	: 	JSON.stringify({"cp": stareHaslo, "np": noweHaslo}), 
		contentType : 	"application/json",
	//	headers    	: 	{ "Accept": "application/json"},
		dataType	:	"json"
	});
	
	request.done( function(data) 
	{ 
		console.log( data );
		if(data.status == "success")
			alert("Hasło zostało zmienione");
		else
			alert("Wystąpił błąd");
	});
	
	request.fail( function(jqXHR, textStatus ) 
	{ 
		console.log( "Failure: " + textStatus );
	});
}
