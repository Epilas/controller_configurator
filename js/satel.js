$(document).ready( function() {

	loadList();
	
	$("#satelIP").val(satelCfg.ip);
	$("#satelPort").val(satelCfg.port);
	$("#satelUserCode").val(satelCfg.userCode);
	$('.sat').click(function()	{
		if($(this).hasClass("btn-secondary")) {
			satel[$(this).attr('n')].active = true;
			$(this).removeClass("btn-secondary").addClass("btn-primary");
		}
		else 
		{
			satel[$(this).attr('n')].active = false;
			$(this).addClass("btn-secondary").removeClass("btn-primary");
		}
	});
	
	$("#satelIP").change(function(){ satelCfg.ip = $(this).val() });
	$("#satelPort").change(function(){ satelCfg.port = $(this).val() });
	$("#satelUserCode").change(function(){ satelCfg.userCode = $(this).val() });
	

});

function loadList()	{
	div = $("#satelContent");
	div.empty();
	
	for(a = 0; a < satel.length; a++)	{
		if(satel[a].active)
			div.append('<button class="btn btn-primary sat m-1" n='+a+'>'+satel[a].disp+'</button>');
		else
			div.append('<button class="btn btn-secondary sat m-1" n='+a+'>'+satel[a].disp+'</button>');			
	}
}

function sendConfig()	{

		var ip = $("#satelIP").val();
		var port = $("#satelPort").val();
		var userCode = $("#satelUserCode").val();
		
		var config = "host="+ip+"\n port="+port+"\n timeout=5000\n refresh=10000\n user_code="+userCode;
		
		if(ip && port && userCode)	{		  
			var request = $.ajax
			({
				url        : "smarthome/fs/write_file/opt/amk/openhab2/etc/services/satel.cfg",
				timeout		:	3000, 
				type       	: 	"POST",
				data       	: 	config, 
				headers    	: 	{"Content-Type": "text/plain", "Accept": "application/json"}
				//dataType	:	"json"
			});
			
			request.done( function(data) 
			{ 
				if(data.status == "success")	{
					alert("Config został wysłany");
				}else{
					alert("Wystąpił błąd");
				}
			});
			
			request.fail( function(jqXHR, textStatus ) 
			{ 
				console.log( "Failure: " + textStatus );
			});
		} else {
			alert("Uzupełnij puste pola");
		}
}
